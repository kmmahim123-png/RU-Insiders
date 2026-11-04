export type ProductCategory = 
  | 'all'
  | 'hoodies' 
  | 'drop-shoulder' 
  | 'jerseys' 
  | 't-shirts' 
  | 'accessories';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;
  category: ProductCategory;
  description: string;
  price: number;
  regularPrice?: number;
  costPrice: number; // For admin profit analytics
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  salesCount: number;
  isCustomizable: boolean;
  featured?: boolean;
  badge?: string;
}

export interface CustomizerState {
  garmentType: 'jersey' | 'dropshoulder' | 'hoodie' | 'tshirt';
  color: string;
  size: string;
  view: 'front' | 'back';
  playerName: string;
  playerNumber: string;
  chestLogo: 'ru-monogram' | 'shabash-bangladesh' | 'ru-paris-road' | 'none';
  customText: string;
  fontStyle: 'sports' | 'serif' | 'clean';
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  customization?: {
    playerName?: string;
    playerNumber?: string;
    chestLogo?: string;
    garmentType?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryMethod: 'ru_campus_pickup' | 'rajshahi_city' | 'steadfast_courier';
  paymentMethod: 'cash_on_delivery' | 'bkash' | 'nagad';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedCost: number; // Total cost price of products
  netProfit: number;
  status: 'pending' | 'processing' | 'shipped_steadfast' | 'ready_for_pickup' | 'delivered' | 'cancelled';
  steadfastConsignmentId?: string;
  steadfastTrackingCode?: string;
  createdAt: string;
}

export interface PrintJob {
  id: string;
  token: string; // e.g. "RU-PRNT-8942"
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  fileName: string;
  fileSizeMb: number;
  fileDataUrl?: string; // Preview or stored download reference
  pageCount: number;
  printType: 'bw' | 'color';
  paperType: 'standard_80gsm' | 'art_paper_matte' | 'glossy_photo';
  doubleSided: boolean;
  copies: number;
  pricePerPage: number;
  totalAmount: number;
  costAmount: number;
  status: 'queued' | 'printing' | 'ready_for_pickup' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid_cash' | 'paid_bkash';
  createdAt: string;
}

export interface SteadfastConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  isEnabled: boolean;
}

export interface RevenueSummary {
  dailyRevenue: number;
  dailyProfit: number;
  weeklyRevenue: number;
  weeklyProfit: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  totalOrders: number;
  totalPrintJobs: number;
  bestSellingProducts: {
    id: string;
    name: string;
    salesCount: number;
    revenue: number;
  }[];
  lowSellingProducts: {
    id: string;
    name: string;
    salesCount: number;
    stock: number;
  }[];
}
