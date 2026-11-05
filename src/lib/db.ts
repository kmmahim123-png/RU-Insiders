import fs from 'fs';
import os from 'os';
import path from 'path';
import { Product, Order, PrintJob, SteadfastConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PRINT_JOBS, INITIAL_STEADFAST_CONFIG } from './store';

export interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  printJobs: PrintJob[];
  steadfastConfig: SteadfastConfig;
}

// Global cache to persist across serverless warm invocations
declare global {
  var __ru_db_cache: DatabaseSchema | undefined;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, 'db.json');
const SERVERLESS_DB_FILE = path.join(os.tmpdir(), 'ru_insiders_db.json');

const ACTIVE_DB_FILE = isServerless ? SERVERLESS_DB_FILE : LOCAL_DB_FILE;

// Atomic sequential transaction queue to prevent race conditions and lost updates
let transactionQueue: Promise<any> = Promise.resolve();

function runAtomic<T>(operation: () => Promise<T>): Promise<T> {
  const next = transactionQueue.then(operation, operation);
  transactionQueue = next.catch(() => {});
  return next;
}

function getFallbackDb(): DatabaseSchema {
  return {
    products: INITIAL_PRODUCTS.map((p, idx) => ({ ...p, orderIndex: idx })),
    orders: INITIAL_ORDERS,
    printJobs: INITIAL_PRINT_JOBS,
    steadfastConfig: INITIAL_STEADFAST_CONFIG,
  };
}

function deepClone<T>(obj: T): T {
  try {
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
}

/**
 * Load or initialize database state asynchronously
 */
async function loadDbFromDisk(): Promise<DatabaseSchema> {
  if (globalThis.__ru_db_cache) {
    return deepClone(globalThis.__ru_db_cache);
  }

  try {
    // 1. If in serverless and tmp db file exists, read it
    if (isServerless && fs.existsSync(SERVERLESS_DB_FILE)) {
      const content = await fs.promises.readFile(SERVERLESS_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      globalThis.__ru_db_cache = parsed;
      return deepClone(parsed);
    }

    // 2. Read bundled data/db.json from repo
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const content = await fs.promises.readFile(LOCAL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      globalThis.__ru_db_cache = parsed;

      // Seed to temporary file if in serverless
      if (isServerless) {
        try {
          await fs.promises.writeFile(SERVERLESS_DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        } catch (e) {
          console.warn('Could not seed serverless temporary db:', e);
        }
      }

      return deepClone(parsed);
    }

    // 3. Fallback if neither exists
    const initialDb = getFallbackDb();
    globalThis.__ru_db_cache = initialDb;

    try {
      const targetDir = path.dirname(ACTIVE_DB_FILE);
      if (!fs.existsSync(targetDir)) {
        await fs.promises.mkdir(targetDir, { recursive: true });
      }
      await fs.promises.writeFile(ACTIVE_DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Filesystem write not permitted, using in-memory DB:', e);
    }

    return deepClone(initialDb);
  } catch (error) {
    console.error('Error reading database file:', error);
    const fallback = getFallbackDb();
    globalThis.__ru_db_cache = fallback;
    return deepClone(fallback);
  }
}

/**
 * Read database with defensive copy
 */
export async function readDb(): Promise<DatabaseSchema> {
  return loadDbFromDisk();
}

/**
 * Atomic write to database cache and persistent files
 */
export async function writeDb(data: DatabaseSchema): Promise<void> {
  // Update in-memory cache with defensive copy
  globalThis.__ru_db_cache = deepClone(data);

  try {
    const targetDir = path.dirname(ACTIVE_DB_FILE);
    if (!fs.existsSync(targetDir)) {
      await fs.promises.mkdir(targetDir, { recursive: true });
    }
    await fs.promises.writeFile(ACTIVE_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

    // Also attempt writing to local data dir if not on serverless
    if (!isServerless && fs.existsSync(LOCAL_DATA_DIR)) {
      await fs.promises.writeFile(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (error) {
    console.warn('Filesystem write warning (in-memory state preserved):', error);
  }
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  const db = await readDb();
  return [...db.products].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

export async function addProduct(product: Product): Promise<Product[]> {
  return runAtomic(async () => {
    const db = await readDb();
    const updatedList = [
      { ...product, orderIndex: 0 },
      ...db.products.map((p) => ({ ...p, orderIndex: (p.orderIndex ?? 0) + 1 })),
    ];
    db.products = updatedList;
    await writeDb(db);
    return db.products;
  });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  return runAtomic(async () => {
    const db = await readDb();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    db.products[index] = { ...db.products[index], ...updates };
    await writeDb(db);
    return db.products[index];
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return runAtomic(async () => {
    const db = await readDb();
    const initialLength = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === initialLength) return false;

    // Re-index remaining products
    db.products = db.products.map((p, idx) => ({ ...p, orderIndex: idx }));
    await writeDb(db);
    return true;
  });
}

export async function moveProductPosition(id: string, direction: 'up' | 'down'): Promise<Product[]> {
  return runAtomic(async () => {
    const db = await readDb();
    const sorted = [...db.products].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const currentIndex = sorted.findIndex((p) => p.id === id);

    if (currentIndex === -1) return sorted;
    if (direction === 'up' && currentIndex === 0) return sorted;
    if (direction === 'down' && currentIndex === sorted.length - 1) return sorted;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = sorted[currentIndex];
    sorted[currentIndex] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    db.products = sorted.map((p, idx) => ({ ...p, orderIndex: idx }));
    await writeDb(db);
    return db.products;
  });
}

// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  const db = await readDb();
  return db.orders;
}

export async function addOrder(order: Order): Promise<Order> {
  return runAtomic(async () => {
    const db = await readDb();
    db.orders.unshift(order);
    await writeDb(db);
    return order;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  steadfastTrackingCode?: string,
  steadfastConsignmentId?: string,
  cancelledFrom?: string,
  riderName?: string
): Promise<Order | null> {
  return runAtomic(async () => {
    const db = await readDb();
    const index = db.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    db.orders[index].status = status;
    if (steadfastTrackingCode) db.orders[index].steadfastTrackingCode = steadfastTrackingCode;
    if (steadfastConsignmentId) db.orders[index].steadfastConsignmentId = steadfastConsignmentId;
    if (cancelledFrom) db.orders[index].cancelledFrom = cancelledFrom;
    if (riderName) db.orders[index].riderName = riderName;

    await writeDb(db);
    return db.orders[index];
  });
}

export async function deleteOrder(id: string): Promise<boolean> {
  return runAtomic(async () => {
    const db = await readDb();
    const len = db.orders.length;
    db.orders = db.orders.filter((o) => o.id !== id);
    if (db.orders.length === len) return false;
    await writeDb(db);
    return true;
  });
}

// ---------------- PRINT JOBS ----------------
export async function getPrintJobs(): Promise<PrintJob[]> {
  const db = await readDb();
  return db.printJobs;
}

export async function addPrintJob(job: PrintJob): Promise<PrintJob> {
  return runAtomic(async () => {
    const db = await readDb();
    db.printJobs.unshift(job);
    await writeDb(db);
    return job;
  });
}

export async function updatePrintJobStatus(
  id: string,
  status: PrintJob['status'],
  paymentStatus?: PrintJob['paymentStatus']
): Promise<PrintJob | null> {
  return runAtomic(async () => {
    const db = await readDb();
    const index = db.printJobs.findIndex((j) => j.id === id);
    if (index === -1) return null;

    db.printJobs[index].status = status;
    if (paymentStatus) db.printJobs[index].paymentStatus = paymentStatus;

    await writeDb(db);
    return db.printJobs[index];
  });
}

export async function deletePrintJob(id: string): Promise<boolean> {
  return runAtomic(async () => {
    const db = await readDb();
    const len = db.printJobs.length;
    db.printJobs = db.printJobs.filter((j) => j.id !== id);
    if (db.printJobs.length === len) return false;
    await writeDb(db);
    return true;
  });
}

// ---------------- STEADFAST CONFIG ----------------
export async function getSteadfastConfig(): Promise<SteadfastConfig> {
  const db = await readDb();
  if (!db.steadfastConfig.baseUrl || db.steadfastConfig.baseUrl.includes('steadfast.com.bd')) {
    db.steadfastConfig.baseUrl = 'https://portal.packzy.com/api/v1';
  }
  return db.steadfastConfig;
}

export async function updateSteadfastConfig(config: Partial<SteadfastConfig>): Promise<SteadfastConfig> {
  return runAtomic(async () => {
    const db = await readDb();
    let sanitizedBaseUrl = config.baseUrl || db.steadfastConfig.baseUrl || 'https://portal.packzy.com/api/v1';
    if (sanitizedBaseUrl.includes('steadfast.com.bd')) {
      sanitizedBaseUrl = 'https://portal.packzy.com/api/v1';
    }
    db.steadfastConfig = { 
      ...db.steadfastConfig, 
      ...config,
      baseUrl: sanitizedBaseUrl.trim().replace(/\/+$/, '')
    };
    await writeDb(db);
    return db.steadfastConfig;
  });
}
