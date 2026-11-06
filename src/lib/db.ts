import fs from 'fs';
import os from 'os';
import path from 'path';
import { Product, Order, PrintJob, SteadfastConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PRINT_JOBS, INITIAL_STEADFAST_CONFIG } from './store';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

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

// Atomic sequential transaction queue to prevent race conditions
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

// ---------------- SUPABASE ROW MAPPERS ----------------
function mapProductFromRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameBn: row.name_bn || '',
    category: row.category,
    description: row.description || '',
    price: Number(row.price),
    regularPrice: row.regular_price ? Number(row.regular_price) : undefined,
    costPrice: row.cost_price ? Number(row.cost_price) : Math.round(Number(row.price) * 0.6),
    images: Array.isArray(row.images) ? row.images : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : ['M', 'L', 'XL', 'XXL'],
    stock: Number(row.stock || 0),
    salesCount: Number(row.sales_count || 0),
    isCustomizable: Boolean(row.customizable ?? row.is_customizable),
    isStoryHighlight: Boolean(row.is_story_highlight ?? row.isStoryHighlight ?? row.featured),
    orderIndex: Number(row.order_index ?? 0),
    video: row.video || '',
    badge: row.badge || undefined,
  };
}

function mapProductToRow(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_bn: p.nameBn || '',
    category: p.category,
    description: p.description || '',
    price: p.price,
    regular_price: p.regularPrice ?? null,
    cost_price: p.costPrice ?? null,
    images: p.images || [],
    colors: p.colors || [],
    sizes: p.sizes || ['M', 'L', 'XL', 'XXL'],
    stock: p.stock || 0,
    sales_count: p.salesCount || 0,
    customizable: Boolean(p.isCustomizable),
    is_story_highlight: Boolean(p.isStoryHighlight ?? p.featured),
    order_index: p.orderIndex ?? 0,
    video: p.video || '',
    badge: p.badge || '',
    updated_at: new Date().toISOString(),
  };
}

function mapOrderFromRow(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number || row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address || row.delivery_address || '',
    deliveryMethod: row.delivery_method || 'ru_campus_pickup',
    paymentMethod: row.payment_method || 'cash_on_delivery',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee ?? row.delivery_charge ?? 0),
    total: Number(row.total ?? row.total_amount ?? 0),
    estimatedCost: Number(row.estimated_cost || 0),
    netProfit: Number(row.net_profit || 0),
    status: row.status || 'pending',
    cancelledFrom: row.cancelled_from || '',
    riderName: row.rider_name || '',
    steadfastConsignmentId: row.steadfast_consignment_id || undefined,
    steadfastTrackingCode: row.steadfast_tracking_code || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapOrderToRow(o: Order) {
  return {
    id: o.id,
    order_number: o.orderNumber || o.id,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_address: o.customerAddress,
    delivery_method: o.deliveryMethod || 'ru_campus_pickup',
    payment_method: o.paymentMethod || 'cash_on_delivery',
    items: o.items || [],
    subtotal: o.subtotal,
    delivery_fee: o.deliveryFee || 0,
    total: o.total,
    estimated_cost: o.estimatedCost || 0,
    net_profit: o.netProfit || 0,
    status: o.status || 'pending',
    cancelled_from: o.cancelledFrom || '',
    rider_name: o.riderName || '',
    steadfast_consignment_id: o.steadfastConsignmentId || '',
    steadfast_tracking_code: o.steadfastTrackingCode || '',
    created_at: o.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapPrintJobFromRow(row: any): PrintJob {
  return {
    id: row.id,
    token: row.token,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerNotes: row.customer_notes || '',
    fileName: row.file_name,
    fileSizeMb: Number(row.file_size_mb || 1),
    fileDataUrl: row.file_data_url || '',
    pageCount: Number(row.page_count || 1),
    printType: row.print_type || 'bw',
    paperType: row.paper_type || 'standard_80gsm',
    doubleSided: Boolean(row.double_sided),
    copies: Number(row.copies || 1),
    pricePerPage: Number(row.price_per_page || 2.5),
    totalAmount: Number(row.total_amount || 0),
    costAmount: Number(row.cost_amount || 0),
    status: row.status || 'queued',
    paymentStatus: row.payment_status || 'unpaid',
    createdAt: row.created_at,
  };
}

function mapPrintJobToRow(j: PrintJob) {
  return {
    id: j.id,
    token: j.token,
    customer_name: j.customerName,
    customer_phone: j.customerPhone,
    customer_notes: j.customerNotes || '',
    file_name: j.fileName,
    file_size_mb: j.fileSizeMb || 1,
    file_data_url: j.fileDataUrl || '',
    page_count: j.pageCount || 1,
    print_type: j.printType || 'bw',
    paper_type: j.paperType || 'standard_80gsm',
    double_sided: Boolean(j.doubleSided),
    copies: j.copies || 1,
    price_per_page: j.pricePerPage || 2.5,
    total_amount: j.totalAmount || 0,
    cost_amount: j.costAmount || 0,
    status: j.status || 'queued',
    payment_status: j.paymentStatus || 'unpaid',
    created_at: j.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ---------------- LOCAL DISK / IN-MEMORY FALLBACK ----------------
async function loadDbFromDisk(): Promise<DatabaseSchema> {
  if (globalThis.__ru_db_cache) {
    return deepClone(globalThis.__ru_db_cache);
  }

  try {
    if (isServerless && fs.existsSync(SERVERLESS_DB_FILE)) {
      const content = await fs.promises.readFile(SERVERLESS_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      globalThis.__ru_db_cache = parsed;
      return deepClone(parsed);
    }

    if (fs.existsSync(LOCAL_DB_FILE)) {
      const content = await fs.promises.readFile(LOCAL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      globalThis.__ru_db_cache = parsed;

      if (isServerless) {
        try {
          await fs.promises.writeFile(SERVERLESS_DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        } catch (e) {
          console.warn('Could not seed serverless temporary db:', e);
        }
      }

      return deepClone(parsed);
    }

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

export async function readDb(): Promise<DatabaseSchema> {
  return loadDbFromDisk();
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  globalThis.__ru_db_cache = deepClone(data);

  try {
    const targetDir = path.dirname(ACTIVE_DB_FILE);
    if (!fs.existsSync(targetDir)) {
      await fs.promises.mkdir(targetDir, { recursive: true });
    }
    await fs.promises.writeFile(ACTIVE_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

    if (!isServerless && fs.existsSync(LOCAL_DATA_DIR)) {
      await fs.promises.writeFile(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (error) {
    console.warn('Filesystem write warning (in-memory state preserved):', error);
  }
}

// ---------------- PRODUCTS API ----------------
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapProductFromRow);
      }

      // If Supabase table exists but is empty, seed it with INITIAL_PRODUCTS
      if (!error && data && data.length === 0) {
        const seedRows = INITIAL_PRODUCTS.map((p, idx) => ({
          ...mapProductToRow(p),
          order_index: idx,
        }));
        await supabase.from('products').insert(seedRows);
        return INITIAL_PRODUCTS.map((p, idx) => ({ ...p, orderIndex: idx }));
      }
    } catch (err) {
      console.warn('Supabase getProducts fallback to local:', err);
    }
  }

  const db = await readDb();
  return [...db.products].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

export async function addProduct(product: Product): Promise<Product[]> {
  return runAtomic(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = mapProductToRow(product);
        const { error } = await supabase.from('products').insert([row]);
        if (!error) {
          return getProducts();
        }
      } catch (err) {
        console.warn('Supabase addProduct fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.nameBn !== undefined) updatePayload.name_bn = updates.nameBn;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.description !== undefined) updatePayload.description = updates.description;
        if (updates.price !== undefined) updatePayload.price = updates.price;
        if (updates.regularPrice !== undefined) updatePayload.regular_price = updates.regularPrice;
        if (updates.costPrice !== undefined) updatePayload.cost_price = updates.costPrice;
        if (updates.images !== undefined) updatePayload.images = updates.images;
        if (updates.colors !== undefined) updatePayload.colors = updates.colors;
        if (updates.sizes !== undefined) updatePayload.sizes = updates.sizes;
        if (updates.stock !== undefined) updatePayload.stock = updates.stock;
        if (updates.isCustomizable !== undefined) updatePayload.customizable = updates.isCustomizable;
        if (updates.isStoryHighlight !== undefined) updatePayload.is_story_highlight = updates.isStoryHighlight;
        if (updates.video !== undefined) updatePayload.video = updates.video;
        if (updates.badge !== undefined) updatePayload.badge = updates.badge;

        const { data, error } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return mapProductFromRow(data);
        }
      } catch (err) {
        console.warn('Supabase updateProduct fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteProduct fallback:', err);
      }
    }

    const db = await readDb();
    const initialLength = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === initialLength) return false;

    db.products = db.products.map((p, idx) => ({ ...p, orderIndex: idx }));
    await writeDb(db);
    return true;
  });
}

export async function moveProductPosition(id: string, direction: 'up' | 'down'): Promise<Product[]> {
  return runAtomic(async () => {
    const currentProducts = await getProducts();
    const sorted = [...currentProducts].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const currentIndex = sorted.findIndex((p) => p.id === id);

    if (currentIndex === -1) return sorted;
    if (direction === 'up' && currentIndex === 0) return sorted;
    if (direction === 'down' && currentIndex === sorted.length - 1) return sorted;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = sorted[currentIndex];
    sorted[currentIndex] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const reindexed = sorted.map((p, idx) => ({ ...p, orderIndex: idx }));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        for (const item of reindexed) {
          await supabase.from('products').update({ order_index: item.orderIndex }).eq('id', item.id);
        }
        return reindexed;
      } catch (err) {
        console.warn('Supabase moveProductPosition fallback:', err);
      }
    }

    const db = await readDb();
    db.products = reindexed;
    await writeDb(db);
    return db.products;
  });
}

// ---------------- ORDERS API ----------------
export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapOrderFromRow);
      }
    } catch (err) {
      console.warn('Supabase getOrders fallback:', err);
    }
  }

  const db = await readDb();
  return db.orders;
}

export async function addOrder(order: Order): Promise<Order> {
  return runAtomic(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = mapOrderToRow(order);
        const { error } = await supabase.from('orders').insert([row]);
        if (!error) return order;
      } catch (err) {
        console.warn('Supabase addOrder fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload: Record<string, any> = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (steadfastTrackingCode) payload.steadfast_tracking_code = steadfastTrackingCode;
        if (steadfastConsignmentId) payload.steadfast_consignment_id = steadfastConsignmentId;
        if (cancelledFrom) payload.cancelled_from = cancelledFrom;
        if (riderName) payload.rider_name = riderName;

        const { data, error } = await supabase
          .from('orders')
          .update(payload)
          .eq('id', orderId)
          .select()
          .single();

        if (!error && data) {
          return mapOrderFromRow(data);
        }
      } catch (err) {
        console.warn('Supabase updateOrderStatus fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteOrder fallback:', err);
      }
    }

    const db = await readDb();
    const len = db.orders.length;
    db.orders = db.orders.filter((o) => o.id !== id);
    if (db.orders.length === len) return false;
    await writeDb(db);
    return true;
  });
}

// ---------------- PRINT JOBS API ----------------
export async function getPrintJobs(): Promise<PrintJob[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapPrintJobFromRow);
      }
    } catch (err) {
      console.warn('Supabase getPrintJobs fallback:', err);
    }
  }

  const db = await readDb();
  return db.printJobs;
}

export async function addPrintJob(job: PrintJob): Promise<PrintJob> {
  return runAtomic(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = mapPrintJobToRow(job);
        const { error } = await supabase.from('print_jobs').insert([row]);
        if (!error) return job;
      } catch (err) {
        console.warn('Supabase addPrintJob fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload: Record<string, any> = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (paymentStatus) payload.payment_status = paymentStatus;

        const { data, error } = await supabase
          .from('print_jobs')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return mapPrintJobFromRow(data);
        }
      } catch (err) {
        console.warn('Supabase updatePrintJobStatus fallback:', err);
      }
    }

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
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('print_jobs').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deletePrintJob fallback:', err);
      }
    }

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
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('steadfast_config')
        .select('*')
        .eq('id', 'primary')
        .single();

      if (!error && data) {
        return {
          apiKey: data.api_key || '',
          secretKey: data.secret_key || '',
          baseUrl: data.base_url || 'https://portal.packzy.com/api/v1',
          isEnabled: Boolean(data.is_active ?? data.is_enabled),
        };
      }
    } catch (err) {
      console.warn('Supabase getSteadfastConfig fallback:', err);
    }
  }

  const db = await readDb();
  if (!db.steadfastConfig.baseUrl || db.steadfastConfig.baseUrl.includes('steadfast.com.bd')) {
    db.steadfastConfig.baseUrl = 'https://portal.packzy.com/api/v1';
  }
  return db.steadfastConfig;
}

export async function updateSteadfastConfig(config: Partial<SteadfastConfig>): Promise<SteadfastConfig> {
  return runAtomic(async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let sanitizedBaseUrl = config.baseUrl || 'https://portal.packzy.com/api/v1';
        if (sanitizedBaseUrl.includes('steadfast.com.bd')) {
          sanitizedBaseUrl = 'https://portal.packzy.com/api/v1';
        }
        await supabase.from('steadfast_config').upsert({
          id: 'primary',
          api_key: config.apiKey ?? '',
          secret_key: config.secretKey ?? '',
          base_url: sanitizedBaseUrl.trim().replace(/\/+$/, ''),
          is_active: config.isEnabled ?? false,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase updateSteadfastConfig fallback:', err);
      }
    }

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
