import { Product, Order, PrintJob, SteadfastConfig, RevenueSummary } from './types';

// Initial Rajshahi University Curated Merchandise Catalog
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-ru-hoodie-maroon',
    slug: 'ru-heritage-winter-hoodie-maroon',
    name: 'RU Heritage Heavyweight Winter Hoodie',
    nameBn: 'রাবি হেরিটেজ উইন্টার হুডি (মেরুন)',
    category: 'hoodies',
    description: 'Premium 340+ GSM fleece hoodie featuring the embossed Rajshahi University emblem, kangaroo pocket, and thermal brushed interior. Built for cold Paris Road morning walks.',
    price: 1150,
    regularPrice: 1400,
    costPrice: 680,
    images: [
      '/mockups/hoodie-front.jpg',
      '/mockups/drop-shoulder-front.jpg',
      '/mockups/jersey-front.jpg',
      '/mockups/t-shirt-front.jpg'
    ],
    colors: [
      { name: 'Heritage Maroon', hex: '#881337', imageIndex: 0 },
      { name: 'Midnight Black', hex: '#09090b', imageIndex: 1 },
      { name: 'Campus Navy', hex: '#1e3a8a', imageIndex: 2 },
      { name: 'Pure White', hex: '#ffffff', imageIndex: 3 }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 45,
    salesCount: 182,
    isCustomizable: true,
    featured: true,
    badge: 'Best Seller',
    fabricSpecs: '340+ GSM 80% Organic Combed Cotton, 20% Polyester Anti-Pilling Brushed Fleece'
  },
  {
    id: 'prod-ru-dropshoulder-paris',
    slug: 'paris-road-oversized-dropshoulder',
    name: 'Paris Road Signature Drop Shoulder Tee',
    nameBn: 'প্যারিস রোড ওভারসাইজড ড্রপ শোল্ডার',
    category: 'drop-shoulder',
    description: '220 GSM 100% combed compact cotton with relaxed drop-shoulder cut. Featuring minimalist RU Paris Road typographic screen print on back and subtle chest crest.',
    price: 580,
    regularPrice: 750,
    costPrice: 310,
    images: [
      '/mockups/drop-shoulder-front.jpg',
      '/mockups/t-shirt-front.jpg',
      '/mockups/hoodie-front.jpg',
      '/mockups/jersey-front.jpg'
    ],
    colors: [
      { name: 'Vintage Olive', hex: '#3f6212', imageIndex: 0 },
      { name: 'Charcoal Black', hex: '#18181b', imageIndex: 1 },
      { name: 'Off White', hex: '#f8fafc', imageIndex: 2 },
      { name: 'Heritage Maroon', hex: '#881337', imageIndex: 3 }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 60,
    salesCount: 240,
    isCustomizable: true,
    featured: true,
    badge: 'Trending',
    fabricSpecs: '220 GSM 100% Compact Combed Cotton, Bio-washed and Pre-shrunk'
  },
  {
    id: 'prod-ru-custom-jersey-2026',
    slug: 'ru-inter-dept-custom-sports-jersey',
    name: 'RU Inter-Dept Custom Sports Jersey',
    nameBn: 'রাবি কাস্টমাইজড স্পোর্টস জার্সি (নাম ও নম্বর সহ)',
    category: 'jerseys',
    description: 'Dry-fit micro-mesh breathable sports jersey. Fully customizable with your Department Name, Personal Name, Batch Year, and Favorite Number.',
    price: 650,
    regularPrice: 850,
    costPrice: 340,
    images: [
      '/mockups/jersey-front.jpg',
      '/mockups/t-shirt-front.jpg',
      '/mockups/hoodie-front.jpg',
      '/mockups/drop-shoulder-front.jpg'
    ],
    colors: [
      { name: 'RU Crimson & Gold', hex: '#9f1239', imageIndex: 0 },
      { name: 'Royal Blue & Gold', hex: '#1d4ed8', imageIndex: 1 },
      { name: 'Stealth Blackout', hex: '#111827', imageIndex: 2 },
      { name: 'Campus White', hex: '#ffffff', imageIndex: 3 }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 120,
    salesCount: 310,
    isCustomizable: true,
    featured: true,
    badge: 'Customizable',
    fabricSpecs: '160 GSM Sublimation Dry-Fit Polyester Mesh with Moisture Wicking Technology'
  },
  {
    id: 'prod-ru-shabash-ganji',
    slug: 'shabash-bangladesh-heritage-tshirt',
    name: 'Shabash Bangladesh Classic Cotton Tee (গেঞ্জি)',
    nameBn: 'সাবাশ বাংলাদেশ ঐতিহ্যবাহী কটন গেঞ্জি',
    category: 't-shirts',
    description: '180 GSM ring-spun breathable soft cotton tee with the iconic Shabash Bangladesh sculpture vector illustration. Durable water-base screen print.',
    price: 390,
    regularPrice: 500,
    costPrice: 190,
    images: [
      '/mockups/t-shirt-front.jpg',
      '/mockups/drop-shoulder-front.jpg',
      '/mockups/jersey-front.jpg',
      '/mockups/hoodie-front.jpg'
    ],
    colors: [
      { name: 'Pure White', hex: '#ffffff', imageIndex: 0 },
      { name: 'Charcoal Grey', hex: '#334155', imageIndex: 1 },
      { name: 'Maroon Red', hex: '#991b1b', imageIndex: 2 },
      { name: 'Midnight Black', hex: '#0f172a', imageIndex: 3 }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 85,
    salesCount: 145,
    isCustomizable: true,
    featured: false,
    badge: 'New Arrival',
    fabricSpecs: '180 GSM 100% Ring Spun Combed Cotton, Soft Silicone Finished'
  },
  {
    id: 'prod-ru-varsity-jacket',
    slug: 'ru-insiders-limited-varsity-jacket',
    name: 'RU Insiders Edition Leatherette Varsity Jacket',
    nameBn: 'রাবি ইনসাইডার্স লিমিটেড ভার্সিটি জ্যাকেট',
    category: 'hoodies',
    description: 'Collector edition wool body with faux leather sleeves, heavy chenille university crest patch on chest, custom embroidered batch numerals on sleeve.',
    price: 2200,
    regularPrice: 2800,
    costPrice: 1350,
    images: [
      '/mockups/hoodie-front.jpg',
      '/mockups/drop-shoulder-front.jpg',
      '/mockups/jersey-front.jpg',
      '/mockups/t-shirt-front.jpg'
    ],
    colors: [
      { name: 'Crimson & Cream', hex: '#881337', imageIndex: 0 },
      { name: 'Navy & White', hex: '#1e3a8a', imageIndex: 1 },
      { name: 'Black & Gold', hex: '#09090b', imageIndex: 2 }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 15,
    salesCount: 42,
    isCustomizable: false,
    featured: true,
    badge: 'Limited Edition',
    fabricSpecs: 'Premium Heavy Wool Blend with Faux Nappa Leather Sleeves and Satin Quilted Lining'
  },
  {
    id: 'prod-ru-totebag',
    slug: 'ru-canvas-heavy-tote-bag',
    name: 'Rajshahi University Campus Canvas Tote Bag',
    nameBn: 'রাবি ক্যাম্পাস ক্যানভাস টোট ব্যাগ',
    category: 'accessories',
    description: 'Heavy duty 14oz raw ecru canvas tote bag. Easily accommodates 15-inch laptops, library books, and exam sheets with reinforced box stitching.',
    price: 280,
    regularPrice: 350,
    costPrice: 120,
    images: [
      '/mockups/t-shirt-front.jpg',
      '/mockups/drop-shoulder-front.jpg',
      '/mockups/hoodie-front.jpg',
      '/mockups/jersey-front.jpg'
    ],
    colors: [
      { name: 'Natural Ecru', hex: '#fef3c7', imageIndex: 0 },
      { name: 'Black Canvas', hex: '#1f2937', imageIndex: 1 }
    ],
    sizes: ['Standard (16" x 14")'],
    stock: 50,
    salesCount: 88,
    isCustomizable: false,
    featured: false,
    fabricSpecs: '14oz 100% Heavy Organic Raw Cotton Canvas with Reinforced Webbed Handles'
  }
];

// Initial Print Station Jobs (Print Lagbe)
export const INITIAL_PRINT_JOBS: PrintJob[] = [
  {
    id: 'prnt-001',
    token: 'RU-PRNT-4821',
    customerName: 'Shakil Ahmed',
    customerPhone: '01711223344',
    customerNotes: 'CSE 4th Year - AI Assignment (Front page color, rest B&W)',
    fileName: 'CSE_4102_Lab_Report_Shakil.pdf',
    fileSizeMb: 3.4,
    pageCount: 18,
    printType: 'bw',
    paperType: 'standard_80gsm',
    doubleSided: true,
    copies: 1,
    pricePerPage: 2.5,
    totalAmount: 45,
    costAmount: 18,
    status: 'ready_for_pickup',
    paymentStatus: 'paid_cash',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'prnt-002',
    token: 'RU-PRNT-7934',
    customerName: 'Farhana Yasmin',
    customerPhone: '01855667788',
    customerNotes: 'Department of Law - Term Paper. Double sided on 80gsm paper.',
    fileName: 'Constitutional_Law_Term_Paper.pdf',
    fileSizeMb: 5.8,
    pageCount: 32,
    printType: 'bw',
    paperType: 'standard_80gsm',
    doubleSided: true,
    copies: 2,
    pricePerPage: 2.5,
    totalAmount: 160,
    costAmount: 64,
    status: 'printing',
    paymentStatus: 'paid_bkash',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'prnt-003',
    token: 'RU-PRNT-9201',
    customerName: 'Tanvir Hasan',
    customerPhone: '01911445566',
    customerNotes: 'Jersey back print vector graphic (Color Print on Art Paper)',
    fileName: 'Physics_Fest_Jersey_Vector_Back.pdf',
    fileSizeMb: 12.1,
    pageCount: 2,
    printType: 'color',
    paperType: 'art_paper_matte',
    doubleSided: false,
    copies: 5,
    pricePerPage: 15,
    totalAmount: 150,
    costAmount: 50,
    status: 'queued',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

// Initial Merchandise Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-801',
    orderNumber: 'RU-ORD-1092',
    customerName: 'Md. Al Amin',
    customerPhone: '01712998877',
    customerAddress: 'Shaheed Habibur Rahman Hall, Room 314, Rajshahi University',
    deliveryMethod: 'ru_campus_pickup',
    paymentMethod: 'cash_on_delivery',
    items: [
      {
        id: 'item-1',
        productId: 'prod-ru-hoodie-maroon',
        name: 'RU Heritage Heavyweight Winter Hoodie',
        price: 1150,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        size: 'XL',
        color: 'Heritage Maroon',
        quantity: 1
      }
    ],
    subtotal: 1150,
    deliveryFee: 0,
    total: 1150,
    estimatedCost: 680,
    netProfit: 470,
    status: 'ready_for_pickup',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ord-802',
    orderNumber: 'RU-ORD-1093',
    customerName: 'Kazi Mahin',
    customerPhone: '01718000000',
    customerAddress: 'Kazla, Motihar Thana, Rajshahi',
    deliveryMethod: 'steadfast_courier',
    paymentMethod: 'bkash',
    items: [
      {
        id: 'item-2',
        productId: 'prod-ru-custom-jersey-2026',
        name: 'RU Inter-Dept Custom Sports Jersey',
        price: 650,
        image: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
        size: 'L',
        color: 'RU Crimson & Gold',
        quantity: 2,
        customization: {
          playerName: 'MAHIN',
          playerNumber: '10',
          chestLogo: 'ru-monogram',
          garmentType: 'jersey'
        }
      }
    ],
    subtotal: 1300,
    deliveryFee: 70,
    total: 1370,
    estimatedCost: 680,
    netProfit: 620,
    status: 'shipped_steadfast',
    steadfastConsignmentId: 'STDFST-892401',
    steadfastTrackingCode: 'RU-SF-9921',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Initial Steadfast Settings
export const INITIAL_STEADFAST_CONFIG: SteadfastConfig = {
  apiKey: 'DEMO_STEADFAST_KEY_RU_INSIDERS_2026',
  secretKey: 'DEMO_STEADFAST_SECRET_SECURE_HASH',
  baseUrl: 'https://portal.packzy.com/api/v1',
  isEnabled: true
};

// Analytics Helper
export function calculateRevenueSummary(orders: Order[], printJobs: PrintJob[], products: Product[]): RevenueSummary {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

  let dailyRevenue = 0;
  let dailyProfit = 0;
  let weeklyRevenue = 0;
  let weeklyProfit = 0;
  let monthlyRevenue = 0;
  let monthlyProfit = 0;

  // Aggregate merchandise orders
  orders.forEach(order => {
    if (order.status === 'cancelled') return;
    const orderTime = new Date(order.createdAt).getTime();
    const orderRev = order.subtotal;
    const orderProf = order.netProfit;

    if (orderTime >= oneDayAgo) {
      dailyRevenue += orderRev;
      dailyProfit += orderProf;
    }
    if (orderTime >= oneWeekAgo) {
      weeklyRevenue += orderRev;
      weeklyProfit += orderProf;
    }
    if (orderTime >= oneMonthAgo) {
      monthlyRevenue += orderRev;
      monthlyProfit += orderProf;
    }
  });

  // Aggregate print station jobs
  printJobs.forEach(job => {
    if (job.status === 'cancelled') return;
    const jobTime = new Date(job.createdAt).getTime();
    const jobRev = job.totalAmount;
    const jobProf = job.totalAmount - job.costAmount;

    if (jobTime >= oneDayAgo) {
      dailyRevenue += jobRev;
      dailyProfit += jobProf;
    }
    if (jobTime >= oneWeekAgo) {
      weeklyRevenue += jobRev;
      weeklyProfit += jobProf;
    }
    if (jobTime >= oneMonthAgo) {
      monthlyRevenue += jobRev;
      monthlyProfit += jobProf;
    }
  });

  // Best selling vs low selling products
  const sortedProducts = [...products].sort((a, b) => b.salesCount - a.salesCount);
  const bestSellingProducts = sortedProducts.slice(0, 3).map(p => ({
    id: p.id,
    name: p.name,
    salesCount: p.salesCount,
    revenue: p.salesCount * p.price
  }));

  const lowSellingProducts = [...products]
    .sort((a, b) => a.salesCount - b.salesCount)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      salesCount: p.salesCount,
      stock: p.stock
    }));

  return {
    dailyRevenue,
    dailyProfit,
    weeklyRevenue,
    weeklyProfit,
    monthlyRevenue,
    monthlyProfit,
    totalOrders: orders.length,
    totalPrintJobs: printJobs.length,
    bestSellingProducts,
    lowSellingProducts
  };
}
