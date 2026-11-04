'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Printer, 
  ShoppingBag, 
  PlusCircle, 
  Truck, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  FileText,
  Phone,
  Send,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import RevenueCharts from '@/components/RevenueCharts';
import PrintDesk from '@/components/PrintDesk';
import SteadfastModal from '@/components/SteadfastModal';
import { Product, Order, PrintJob, SteadfastConfig, ProductCategory, RevenueSummary } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';
import { INITIAL_STEADFAST_CONFIG, calculateRevenueSummary } from '@/lib/store';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'print-desk' | 'analytics' | 'steadfast'>('products');
  
  // Real-time Database State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [steadfastConfig, setSteadfastConfig] = useState<SteadfastConfig>(INITIAL_STEADFAST_CONFIG);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Steadfast Modal State
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<Order | null>(null);

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameBn, setNewProductNameBn] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('hoodies');
  const [newProductPrice, setNewProductPrice] = useState(1150);
  const [newProductCost, setNewProductCost] = useState(650);
  const [newProductStock, setNewProductStock] = useState(30);
  const [newProductImage, setNewProductImage] = useState('/logo.png');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCustomizable, setNewProductCustomizable] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const getAdminPin = useCallback(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('ru_admin_pin') || '1953' : '1953';
  }, []);

  // Fetch full live database state
  const loadDatabaseState = useCallback(async () => {
    setRefreshing(true);
    const pin = getAdminPin();

    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
      }

      // 2. Fetch Orders
      const ordRes = await fetch('/api/orders', {
        headers: { 'x-admin-pin': pin },
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.orders);
      }

      // 3. Fetch Print Jobs
      const printRes = await fetch('/api/print-station', {
        headers: { 'x-admin-pin': pin },
      });
      if (printRes.ok) {
        const printData = await printRes.json();
        if (printData.success) setPrintJobs(printData.jobs);
      }

      // 4. Fetch Steadfast Config
      const sfRes = await fetch('/api/admin/steadfast', {
        headers: { 'x-admin-pin': pin },
      });
      if (sfRes.ok) {
        const sfData = await sfRes.json();
        if (sfData.success && sfData.config) setSteadfastConfig(sfData.config);
      }
    } catch (e) {
      console.error('Error refreshing admin database:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAdminPin]);

  useEffect(() => {
    const pin = sessionStorage.getItem('ru_admin_pin');
    if (!pin) {
      router.push('/admin');
      return;
    }
    loadDatabaseState();
  }, [router, loadDatabaseState]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ru_admin_pin');
    router.push('/admin');
  };

  // Add Product to Persistent Database
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    const pin = getAdminPin();

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({
          name: newProductName,
          nameBn: newProductNameBn,
          category: newProductCategory,
          description: newProductDesc,
          price: newProductPrice,
          costPrice: newProductCost,
          stock: newProductStock,
          images: [newProductImage || '/logo.png'],
          isCustomizable: newProductCustomizable,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add product');
      }

      showNotification('পণ্য সফলভাবে ডাটাবেজে যুক্ত হয়েছে এবং মূল পেজে লাইভ হয়েছে!');
      setNewProductName('');
      setNewProductNameBn('');
      setNewProductDesc('');
      setProducts(data.products || [data.product, ...products]);
      loadDatabaseState();
    } catch (err: any) {
      showNotification(err.message || 'Error adding product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product from Persistent Database
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? এটি সম্পূর্ণ ডাটাবেজ ও মূল পেজ থেকে মুছে যাবে।`)) {
      return;
    }

    const pin = getAdminPin();
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete');
      }

      showNotification(`"${name}" ডাটাবেজ থেকে সফলভাবে মুছে ফেলা হয়েছে!`);
      setProducts(data.products || products.filter((p) => p.id !== id));
    } catch (err: any) {
      showNotification(err.message || 'Error deleting product', 'error');
    }
  };

  // Reorder Product Position (Move Up / Down)
  const handleMoveProduct = async (id: string, direction: 'up' | 'down') => {
    const pin = getAdminPin();
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({ action: 'move', id, direction }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reorder');
      }

      showNotification(`পণ্যের অবস্থান সফলভাবে পরিবর্তন করা হয়েছে!`);
      setProducts(data.products);
    } catch (err: any) {
      showNotification(err.message || 'Error reordering product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const pin = getAdminPin();
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        showNotification('অর্ডার স্ট্যাটাস আপডেট হয়েছে!');
        loadDatabaseState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}?`)) return;
    const pin = getAdminPin();
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
      });
      if (res.ok) {
        showNotification(`Order ${orderNumber} deleted.`);
        setOrders(orders.filter((o) => o.id !== orderId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourierSuccess = (consignmentId: string, trackingCode: string) => {
    showNotification(`Steadfast Consignment booked! Code: ${trackingCode}`);
    loadDatabaseState();
  };

  const revenueSummary: RevenueSummary = calculateRevenueSummary(orders, printJobs, products);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400 p-0.5 bg-slate-900 shadow-glow overflow-hidden shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              RU Insiders Central Control Suite
              <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                PERSISTENT DB
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-bengali">
              প্রোডাক্ট সাজানো, অর্ডার ট্র্যাকিং, প্রিন্ট ডেস্ক ও স্টেডফাস্ট কুরিয়ার নিয়ন্ত্রণ
            </p>
          </div>
        </div>

        {/* Top Actions: Refresh & Exit */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            onClick={loadDatabaseState}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800 shadow-emeraldGlow' 
            : 'bg-rose-950/90 text-rose-300 border border-rose-800'
        }`}>
          {actionMessage.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'products', label: 'Product Manager (পণ্য ও ক্রম)', icon: PlusCircle, count: products.length },
          { id: 'orders', label: 'Merchandise Orders', icon: ShoppingBag, count: orders.length },
          { id: 'print-desk', label: 'Print Lagbe Desk', icon: Printer, count: printJobs.filter(j => j.status === 'queued').length },
          { id: 'analytics', label: 'Revenue & Profit', icon: TrendingUp, count: null },
          { id: 'steadfast', label: 'Steadfast Courier API', icon: Truck, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-rose-900/70 text-amber-300 border border-rose-700/80 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCT MANAGER & POSITION REORDERING */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add Product Form (5 Cols) */}
          <form onSubmit={handleAddProduct} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-amber-400" />
                <span>নতুন পণ্য যুক্ত করুন (Add Product)</span>
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                নতুন পণ্য যুক্ত করামাত্রই তা ডাটাবেজে সেভ হবে এবং হোমপেজের শুরুতে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Product Title (ইংরেজি নাম)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RU Paris Road Drop Shoulder Black"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bangla Title (বাংলা নাম - অপশনাল)</label>
                <input
                  type="text"
                  placeholder="যেমন: রাবি প্যারিস রোড ড্রপ শোল্ডার"
                  value={newProductNameBn}
                  onChange={(e) => setNewProductNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 font-bengali"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category (ক্যাটাগরি)</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="hoodies">Winter Hoodie (শীতের হুডি)</option>
                  <option value="drop-shoulder">Drop Shoulder (ড্রপ শোল্ডার)</option>
                  <option value="jerseys">Custom Sports Jersey (কাস্টম জার্সি)</option>
                  <option value="t-shirts">Classic Ganji / T-Shirt (গেঞ্জি)</option>
                  <option value="accessories">Campus Accessories (ব্যাগ ও এক্সেসরিজ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Selling Price (বিক্রয় মূল্য ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Cost Price (উৎপাদন খরচ ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Stock Available (স্টক)</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Customizable?</label>
                  <button
                    type="button"
                    onClick={() => setNewProductCustomizable(!newProductCustomizable)}
                    className={`w-full py-2 rounded-xl border font-bold transition-all ${
                      newProductCustomizable
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {newProductCustomizable ? 'YES (Customizable)' : 'NO'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Image URL or Path</label>
                <input
                  type="text"
                  required
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  placeholder="/logo.png or image URL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500">
                  Tip: Use <strong>/logo.png</strong> for official logo or any image link.
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description (বিবরণ)</label>
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="কাপড়ের জিএসএম, সাইজ ও ফেব্রিক ডিটেইল..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50"
            >
              {submittingProduct ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish & Save to Database</span>
                </>
              )}
            </button>
          </form>

          {/* Product Position Reordering & Deletion Table (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Product Placement & Order ({products.length})</span>
                </h3>
                <p className="text-xs text-slate-400 font-bengali">
                  উপরে-নিচে নামিয়ে হোমপেজের কোন পণ্য কোথায় থাকবে তা ঠিক করুন অথবা যেকোনো পণ্য ডিলিট করুন।
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                LIVE ORDER
              </span>
            </div>

            <div className="space-y-3">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  {/* Left: Position Rank & Image */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      #{idx + 1}
                    </div>
                    <img
                      src={p.images[0] || '/logo.png'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400 font-bold">{formatBDT(p.price)}</span>
                        <span>•</span>
                        <span>Stock: {p.stock}</span>
                        <span>•</span>
                        <span className="text-slate-300 capitalize">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reorder Buttons & Delete Action */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveProduct(p.id, 'up')}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Move Product Up (উপরে তুলুন)"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === products.length - 1}
                      onClick={() => handleMoveProduct(p.id, 'down')}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Move Product Down (নিচে নামান)"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Product */}
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 hover:text-white transition-colors"
                      title="Delete Product from Database (পণ্য মুছে ফেলুন)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MERCHANDISE ORDERS PROCESSING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Live Customer Orders ({orders.length})</h2>
              <p className="text-xs text-slate-400 font-bengali">
                কাস্টমার চেকআউট থেকে সরাসরি আসা অর্ডার তালিকা ও স্টেডফাস্ট কুরিয়ার ডিসপ্যাচ
              </p>
            </div>
            <button
              onClick={loadDatabaseState}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 text-slate-500 text-sm">
              এখনও কোনো অর্ডার আসেনি। স্টোরে কোনো অর্ডার প্লেস করলে তা এখানে তাৎক্ষণিক প্রদর্শিত হবে।
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        order.status === 'shipped_steadfast' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono">{formatDate(order.createdAt)}</span>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-300">Customer Details:</h4>
                      <p className="text-white font-medium">{order.customerName}</p>
                      <a href={`tel:${order.customerPhone}`} className="text-amber-400 flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3" /> {order.customerPhone}
                      </a>
                      <p className="text-slate-400">{order.customerAddress}</p>
                      <div className="text-[11px] text-slate-400">
                        Method: <strong className="text-slate-200 capitalize">{order.deliveryMethod.replace(/_/g, ' ')}</strong> • 
                        Payment: <strong className="text-slate-200 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-300">Items Ordered:</h4>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-200">{it.name}</div>
                            <div className="text-[10px] text-slate-400">Size: {it.size} • Qty: {it.quantity}</div>
                            {it.customization?.playerName && (
                              <div className="text-[10px] text-amber-400 font-mono">
                                Custom: {it.customization.playerName} #{it.customization.playerNumber}
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-white font-bold">{formatBDT(it.price * it.quantity)}</div>
                        </div>
                      ))}
                      
                      <div className="pt-2 flex justify-between items-baseline font-bold">
                        <span className="text-slate-400">Total Payable:</span>
                        <span className="text-emerald-400 font-mono text-sm">{formatBDT(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    {order.steadfastTrackingCode ? (
                      <div className="text-xs text-blue-400 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Steadfast Tracking: <strong className="font-mono text-white">{order.steadfastTrackingCode}</strong></span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderForCourier(order)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Dispatch via Steadfast Courier</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="shipped_steadfast">Shipped (Steadfast)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <a
                        href={`https://wa.me/88${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম ${order.customerName}, আপনার RU Insiders অর্ডার #${order.orderNumber} এর স্ট্যাটাস: ${order.status.replace(/_/g, ' ')}। ধন্যবাদ!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                        title="WhatsApp Customer"
                      >
                        <Send className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRINT DESK OPERATOR CONSOLE */}
      {activeTab === 'print-desk' && (
        <PrintDesk initialJobs={printJobs} onJobUpdate={setPrintJobs} />
      )}

      {/* TAB 4: REVENUE & PROFIT ANALYTICS */}
      {activeTab === 'analytics' && (
        <RevenueCharts summary={revenueSummary} />
      )}

      {/* TAB 5: STEADFAST COURIER API CONFIG */}
      {activeTab === 'steadfast' && (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Steadfast Courier API Settings</h2>
              <p className="text-xs text-slate-400 font-bengali">
                স্টেডফাস্ট মার্চেন্ট পোর্টাল থেকে পাওয়া API Key ও Secret Key সেভ করুন
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Steadfast Merchant API Key</label>
              <input
                type="text"
                value={steadfastConfig.apiKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, apiKey: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Steadfast Merchant Secret Key</label>
              <input
                type="password"
                value={steadfastConfig.secretKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, secretKey: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">API Endpoint URL</label>
              <input
                type="url"
                value={steadfastConfig.baseUrl}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, baseUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={async () => {
                const pin = getAdminPin();
                const res = await fetch('/api/admin/steadfast', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-admin-pin': pin,
                  },
                  body: JSON.stringify({ action: 'save_config', config: steadfastConfig }),
                });
                if (res.ok) {
                  showNotification('Steadfast credentials saved securely to database!');
                }
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
            >
              Save Steadfast Settings
            </button>
          </div>
        </div>
      )}

      {/* Steadfast Dispatch Modal */}
      {selectedOrderForCourier && (
        <SteadfastModal
          order={selectedOrderForCourier}
          config={steadfastConfig}
          isOpen={true}
          onClose={() => setSelectedOrderForCourier(null)}
          onSuccess={handleCourierSuccess}
        />
      )}

    </div>
  );
}
