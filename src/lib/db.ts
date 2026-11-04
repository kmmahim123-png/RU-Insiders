import fs from 'fs';
import path from 'path';
import { Product, Order, PrintJob, SteadfastConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PRINT_JOBS, INITIAL_STEADFAST_CONFIG } from './store';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  printJobs: PrintJob[];
  steadfastConfig: SteadfastConfig;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder and db.json exist
function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        products: INITIAL_PRODUCTS.map((p, idx) => ({ ...p, orderIndex: idx })),
        orders: INITIAL_ORDERS,
        printJobs: INITIAL_PRINT_JOBS,
        steadfastConfig: INITIAL_STEADFAST_CONFIG,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content) as DatabaseSchema;
    return parsed;
  } catch (error) {
    console.error('Error reading database file:', error);
    return {
      products: INITIAL_PRODUCTS.map((p, idx) => ({ ...p, orderIndex: idx })),
      orders: INITIAL_ORDERS,
      printJobs: INITIAL_PRINT_JOBS,
      steadfastConfig: INITIAL_STEADFAST_CONFIG,
    };
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  return ensureDbFile();
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error;
  }
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  const db = await readDb();
  return [...db.products].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

export async function addProduct(product: Product): Promise<Product[]> {
  const db = await readDb();
  // Assign highest priority (orderIndex: 0) and shift others down
  const updatedList = [
    { ...product, orderIndex: 0 },
    ...db.products.map((p) => ({ ...p, orderIndex: (p.orderIndex ?? 0) + 1 })),
  ];
  db.products = updatedList;
  await writeDb(db);
  return db.products;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = { ...db.products[index], ...updates };
  await writeDb(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initialLength) return false;

  // Re-index remaining products
  db.products = db.products.map((p, idx) => ({ ...p, orderIndex: idx }));
  await writeDb(db);
  return true;
}

export async function moveProductPosition(id: string, direction: 'up' | 'down'): Promise<Product[]> {
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

  // Re-assign order indices
  db.products = sorted.map((p, idx) => ({ ...p, orderIndex: idx }));
  await writeDb(db);
  return db.products;
}

// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  const db = await readDb();
  return db.orders;
}

export async function addOrder(order: Order): Promise<Order> {
  const db = await readDb();
  db.orders.unshift(order);
  await writeDb(db);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  steadfastTrackingCode?: string,
  steadfastConsignmentId?: string
): Promise<Order | null> {
  const db = await readDb();
  const index = db.orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  db.orders[index].status = status;
  if (steadfastTrackingCode) db.orders[index].steadfastTrackingCode = steadfastTrackingCode;
  if (steadfastConsignmentId) db.orders[index].steadfastConsignmentId = steadfastConsignmentId;

  await writeDb(db);
  return db.orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  const db = await readDb();
  const len = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length === len) return false;
  await writeDb(db);
  return true;
}

// ---------------- PRINT JOBS ----------------
export async function getPrintJobs(): Promise<PrintJob[]> {
  const db = await readDb();
  return db.printJobs;
}

export async function addPrintJob(job: PrintJob): Promise<PrintJob> {
  const db = await readDb();
  db.printJobs.unshift(job);
  await writeDb(db);
  return job;
}

export async function updatePrintJobStatus(
  id: string,
  status: PrintJob['status'],
  paymentStatus?: PrintJob['paymentStatus']
): Promise<PrintJob | null> {
  const db = await readDb();
  const index = db.printJobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  db.printJobs[index].status = status;
  if (paymentStatus) db.printJobs[index].paymentStatus = paymentStatus;

  await writeDb(db);
  return db.printJobs[index];
}

export async function deletePrintJob(id: string): Promise<boolean> {
  const db = await readDb();
  const len = db.printJobs.length;
  db.printJobs = db.printJobs.filter((j) => j.id !== id);
  if (db.printJobs.length === len) return false;
  await writeDb(db);
  return true;
}

// ---------------- STEADFAST CONFIG ----------------
export async function getSteadfastConfig(): Promise<SteadfastConfig> {
  const db = await readDb();
  return db.steadfastConfig;
}

export async function updateSteadfastConfig(config: Partial<SteadfastConfig>): Promise<SteadfastConfig> {
  const db = await readDb();
  db.steadfastConfig = { ...db.steadfastConfig, ...config };
  await writeDb(db);
  return db.steadfastConfig;
}
