'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Image as ImageIcon,
  UploadCloud,
  Camera,
  ExternalLink,
  FolderPlus,
  Video,
  Play,
  X
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
  const [newProductImages, setNewProductImages] = useState<string[]>(['', '', '', '']);
  const [newProductVideo, setNewProductVideo] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCustomizable, setNewProductCustomizable] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Dynamic Categories State
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: 'hoodies', name: 'Winter Hoodie (শীতের হুডি)' },
    { id: 'drop-shoulder', name: 'Drop Shoulder (ড্রপ শোল্ডার)' },
    { id: 'jerseys', name: 'Custom Sports Jersey (কাস্টম জার্সি)' },
    { id: 't-shirts', name: 'Classic Ganji / T-Shirt (গেঞ্জি)' },
    { id: 'accessories', name: 'Campus Accessories (ব্যাগ ও এক্সেসরিজ)' },
  ]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // 4 Images & Video Upload State
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const slotInputRef0 = useRef<HTMLInputElement>(null);
  const slotInputRef1 = useRef<HTMLInputElement>(null);
  const slotInputRef2 = useRef<HTMLInputElement>(null);
  const slotInputRef3 = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;
    const cleanName = customCategoryInput.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newCat = { id: slug, name: cleanName };
    if (!categories.some((c) => c.id === slug)) {
      setCategories((prev) => [...prev, newCat]);
    }
    setNewProductCategory(slug);
    setCustomCategoryInput('');
    setIsAddingNewCategory(false);
    showNotification(`New category "${cleanName}" added!`);
  };

  const handleSlotImageUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Local instant preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewProductImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = event.target!.result as string;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);

    try {
      setUploadingSlot(slotIdx);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewProductImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = data.url;
          return updated;
        });
        showNotification(`ছবি #${slotIdx + 1} সফলভাবে আপলোড হয়েছে!`);
      }
    } catch (err) {
      console.error(err);
      showNotification(`ছবি #${slotIdx + 1} আপলোডে সমস্যা হয়েছে`, 'error');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleProductVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setUploadingVideo(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewProductVideo(data.url);
        showNotification('প্রোডাক্ট ভিডিও সফলভাবে আপলোড হয়েছে!');
      } else {
        throw new Error(data.message || 'Video upload failed');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'ভিডিও আপলোডে সমস্যা হয়েছে', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const getAdminPin = useCallback(() => {
    return typeof window !== 'undefined' 
      ? sessionStorage.getItem('ru_admin_token') || sessionStorage.getItem('ru_admin_pin') || '1953' 
      : '1953';
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
        credentials: 'include',
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.orders);
      }

      // 3. Fetch Print Jobs
      const printRes = await fetch('/api/print-station', {
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });
      if (printRes.ok) {
        const printData = await printRes.json();
        if (printData.success) setPrintJobs(printData.jobs);
      }

      // 4. Fetch Steadfast Config
      const sfRes = await fetch('/api/admin/steadfast', {
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
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

    const finalImages = newProductImages.map((s) => s.trim()).filter(Boolean);
    if (finalImages.length === 0) {
      finalImages.push('/mockups/hoodie-front.jpg');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newProductName,
          nameBn: newProductNameBn,
          category: newProductCategory,
          description: newProductDesc,
          price: newProductPrice,
          costPrice: newProductCost,
          stock: newProductStock,
          images: finalImages,
          video: newProductVideo.trim() || undefined,
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
      setNewProductImages(['', '', '', '']);
      setNewProductVideo('');
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
        credentials: 'include',
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
        credentials: 'include',
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
        credentials: 'include',
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
        credentials: 'include',
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5 bg-white shadow-sm overflow-hidden shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              RU Insiders Central Control Suite
              <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
                PERSISTENT DB
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-bengali">
              প্রোডাক্ট সাজানো, অর্ডার ট্র্যাকিং, প্রিন্ট ডেস্ক ও স্টেডফাস্ট কুরিয়ার নিয়ন্ত্রণ
            </p>
          </div>
        </div>

        {/* Top Actions: Refresh & Exit */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            onClick={loadDatabaseState}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all shadow-sm"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors"
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
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {actionMessage.type === 'success' ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Executive Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">মোট বিক্রয় (Revenue)</span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
              {formatBDT(orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0))}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">
              নেট লাভ: {formatBDT(orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.netProfit : 0), 0))}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">নতুন অর্ডার (Pending)</span>
            <div className="text-lg sm:text-2xl font-black text-blue-700 font-mono">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              মোট অর্ডার: {orders.length} টি
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveTab('print-desk')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">প্রিন্ট রিকোয়েস্ট (Queue)</span>
            <div className="text-lg sm:text-2xl font-black text-indigo-700 font-mono">
              {printJobs.filter(j => j.status === 'queued').length}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              মোট প্রিন্ট জব: {printJobs.length} টি
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Printer className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveTab('products')}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">লাইভ প্রোডাক্টস</span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
              {products.length}
            </div>
            <span className="text-[10px] text-blue-600 font-medium block">
              স্টক ও সিকোয়েন্স রেডি
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
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
          <form onSubmit={handleAddProduct} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                <span>নতুন পণ্য যুক্ত করুন (Add Product)</span>
              </h3>
              <p className="text-xs text-slate-500 font-bengali">
                নতুন পণ্য যুক্ত করামাত্রই তা ডাটাবেজে সেভ হবে এবং হোমপেজের শুরুতে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Product Title (ইংরেজি নাম)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RU Paris Road Drop Shoulder Black"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Bangla Title (বাংলা নাম - অপশনাল)</label>
                <input
                  type="text"
                  placeholder="যেমন: রাবি প্যারিস রোড ড্রপ শোল্ডার"
                  value={newProductNameBn}
                  onChange={(e) => setNewProductNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-bengali"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Category (ক্যাটাগরি)</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>{isAddingNewCategory ? 'Cancel' : '+ নতুন ক্যাটাগরি'}</span>
                  </button>
                </div>

                {isAddingNewCategory && (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 mb-2 space-y-2">
                    <span className="text-[11px] font-bold text-slate-800">নতুন ক্যাটাগরির নাম দিন:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="যেমন: Polo Shirt (পোলো শার্ট) বা Cap"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                      >
                        যুক্ত করুন
                      </button>
                    </div>
                  </div>
                )}

                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Selling Price (বিক্রয় মূল্য ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-blue-700 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Cost Price (উৎপাদন খরচ ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Stock Available (স্টক)</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Customizable?</label>
                  <button
                    type="button"
                    onClick={() => setNewProductCustomizable(!newProductCustomizable)}
                    className={`w-full py-2 rounded-xl border font-bold transition-all ${
                      newProductCustomizable
                        ? 'bg-blue-50 border-blue-600 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {newProductCustomizable ? 'YES (Customizable)' : 'NO'}
                  </button>
                </div>
              </div>

              {/* 4 Photo Upload Slots + Product Video */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span>Product Photo Gallery (৪টি ছবি আপলোড করুন)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-bengali">
                    ১ নম্বর ছবিটি মূল কভার হিসেবে হোমপেজে শো করবে। বাকি ছবিগুলো বিস্তারিত পেজে দেখা যাবে।
                  </p>
                </div>

                {/* 4 Image Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { slotIdx: 0, label: '১. মূল কভার (Main)', hint: 'হোমপেজ ও কার্ড ভিউ' },
                    { slotIdx: 1, label: '২. সাইড / অ্যাঙ্গেল', hint: 'ডিটেইল ভিউ ২' },
                    { slotIdx: 2, label: '৩. ফেব্রিক / ব্যাক', hint: 'ক্লোজ-আপ ভিউ ৩' },
                    { slotIdx: 3, label: '৪. মডেল লুক', hint: 'মডেল শট ৪' },
                  ].map(({ slotIdx, label, hint }) => {
                    const currentImg = newProductImages[slotIdx];
                    const isUploading = uploadingSlot === slotIdx;
                    const ref = [slotInputRef0, slotInputRef1, slotInputRef2, slotInputRef3][slotIdx];

                    return (
                      <div key={slotIdx} className="p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                        <input
                          type="file"
                          ref={ref}
                          accept="image/*"
                          onChange={(e) => handleSlotImageUpload(slotIdx, e)}
                          className="hidden"
                        />

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{label}</span>
                            {slotIdx === 0 && (
                              <span className="text-[8px] bg-blue-600 text-white font-mono px-1 rounded">PRIMARY</span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 line-clamp-1">{hint}</p>
                        </div>

                        {/* Preview Box */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center group">
                          {currentImg ? (
                            <>
                              <img
                                src={currentImg}
                                alt={`Slot ${slotIdx + 1}`}
                                onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProductImages((prev) => {
                                    const updated = [...prev];
                                    updated[slotIdx] = '';
                                    return updated;
                                  });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                                title="Remove"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={() => ref.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-blue-50/50 text-slate-400 hover:text-blue-600 transition-colors p-2 text-center"
                            >
                              {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                              ) : (
                                <>
                                  <Camera className="h-5 w-5" />
                                  <span className="text-[9px] font-bold">+ ছবি দিন</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Upload Button & URL fallback */}
                        <div className="space-y-1">
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => ref.current?.click()}
                            className="w-full py-1 px-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                          >
                            {isUploading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <UploadCloud className="h-3 w-3" />
                            )}
                            <span>{currentImg ? 'পরিবর্তন' : 'আপলোড'}</span>
                          </button>

                          <input
                            type="text"
                            placeholder="বা ছবির লিংক"
                            value={currentImg}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProductImages((prev) => {
                                const updated = [...prev];
                                updated[slotIdx] = val;
                                return updated;
                              });
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[9px] font-mono focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Product Video Upload & Player Section */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                        <Video className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Product Video (প্রোডাক্টের ভিডিও)</h4>
                        <p className="text-[10px] text-slate-500 font-bengali">
                          হোমপেজে মাউস আনলে বা ভিজিট করলে স্বয়ংক্রিয়ভাবে ভিডিও চলবে এবং ডিটেইল পেজে ফুল ভিডিও দেখা যাবে।
                        </p>
                      </div>
                    </div>
                    {newProductVideo && (
                      <button
                        type="button"
                        onClick={() => setNewProductVideo('')}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span>রিমুভ ভিডিও</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={handleProductVideoUpload}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      {uploadingVideo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>ভিডিও আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Video className="h-3.5 w-3.5" />
                          <span>🎥 মোবাইল/পিসি থেকে ভিডিও আপলোড</span>
                        </>
                      )}
                    </button>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder="বা ভিডিও ফাইল লিংক দিন (e.g. /uploads/video.mp4)"
                        value={newProductVideo}
                        onChange={(e) => setNewProductVideo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {newProductVideo && (
                    <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-48 border border-slate-700 shadow-inner">
                      <video
                        src={newProductVideo}
                        controls
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description (বিবরণ)</label>
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="কাপড়ের জিএসএম, সাইজ ও ফেব্রিক ডিটেইল..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
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
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Product Placement & Order ({products.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-bengali">
                  উপরে-নিচে নামিয়ে হোমপেজের কোন পণ্য কোথায় থাকবে তা ঠিক করুন অথবা যেকোনো পণ্য ডিলিট করুন।
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                LIVE ORDER
              </span>
            </div>

            <div className="space-y-3">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  {/* Left: Position Rank & Image */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      #{idx + 1}
                    </div>
                    <img
                      src={p.images[0] || '/mockups/hoodie-front.jpg'}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                        {p.images && p.images.length > 1 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                            {p.images.length} Photos
                          </span>
                        )}
                        {p.video && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                            ▶ Video
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-blue-700 font-bold">{formatBDT(p.price)}</span>
                        <span>•</span>
                        <span>Stock: {p.stock}</span>
                        <span>•</span>
                        <span className="text-slate-600 capitalize">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reorder Buttons & Delete Action */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveProduct(p.id, 'up')}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                      title="Move Product Up (উপরে তুলুন)"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === products.length - 1}
                      onClick={() => handleMoveProduct(p.id, 'down')}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                      title="Move Product Down (নিচে নামান)"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Product */}
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors shadow-sm"
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
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Customer Orders ({orders.length})</h2>
              <p className="text-xs text-slate-500 font-bengali">
                কাস্টমার চেকআউট থেকে সরাসরি আসা অর্ডার তালিকা ও স্টেডফাস্ট কুরিয়ার ডিসপ্যাচ
              </p>
            </div>
            <button
              onClick={loadDatabaseState}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200 bg-white text-slate-500 text-sm shadow-sm">
              এখনও কোনো অর্ডার আসেনি। স্টোরে কোনো অর্ডার প্লেস করলে তা এখানে তাৎক্ষণিক প্রদর্শিত হবে।
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{order.orderNumber}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        order.status === 'shipped_steadfast' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">{formatDate(order.createdAt)}</span>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Customer Details:</h4>
                      <p className="text-slate-900 font-semibold">{order.customerName}</p>
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 flex items-center gap-1 font-mono font-medium">
                        <Phone className="h-3 w-3" /> {order.customerPhone}
                      </a>
                      <p className="text-slate-600">{order.customerAddress}</p>
                      <div className="text-[11px] text-slate-500">
                        Method: <strong className="text-slate-800 capitalize">{order.deliveryMethod.replace(/_/g, ' ')}</strong> • 
                        Payment: <strong className="text-slate-800 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Items Ordered:</h4>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{it.name}</div>
                            <div className="text-[10px] text-slate-500">Size: {it.size} • Qty: {it.quantity}</div>
                            {it.customization?.playerName && (
                              <div className="text-[10px] text-blue-700 font-mono font-semibold">
                                Player: {it.customization.playerName} #{it.customization.playerNumber}
                              </div>
                            )}
                            {it.customization?.customText && (
                              <div className="text-[10px] text-emerald-700 font-semibold">
                                Text: "{it.customization.customText}" ({it.customization.textColor || 'White'})
                              </div>
                            )}
                            {it.customization?.uploadedImage && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[10px] text-indigo-700 font-bold">Custom Artwork:</span>
                                <a
                                  href={it.customization.uploadedImage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                                >
                                  <ImageIcon className="h-3 w-3" />
                                  <span>View Artwork PNG</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-slate-900 font-bold">{formatBDT(it.price * it.quantity)}</div>
                        </div>
                      ))}
                      
                      <div className="pt-2 flex justify-between items-baseline font-bold border-t border-slate-200">
                        <span className="text-slate-600">Total Payable:</span>
                        <span className="text-emerald-700 font-mono text-sm">{formatBDT(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    {order.steadfastTrackingCode ? (
                      <div className="text-xs text-blue-700 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Steadfast Tracking: <strong className="font-mono text-slate-900">{order.steadfastTrackingCode}</strong></span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderForCourier(order)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Dispatch via Steadfast Courier</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 shadow-sm"
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
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-emerald-700 transition-colors"
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
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Steadfast Courier API Settings</h2>
              <p className="text-xs text-slate-500 font-bengali">
                স্টেডফাস্ট মার্চেন্ট পোর্টাল থেকে পাওয়া API Key ও Secret Key সেভ করুন
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Status Indicator */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Gateway Status:</span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full font-mono flex items-center gap-1.5 ${
                steadfastConfig.apiKey && !steadfastConfig.apiKey.startsWith('DEMO_')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  steadfastConfig.apiKey && !steadfastConfig.apiKey.startsWith('DEMO_') ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`} />
                {steadfastConfig.apiKey && !steadfastConfig.apiKey.startsWith('DEMO_')
                  ? 'LIVE CREDENTIALS READY'
                  : 'DEMO / SIMULATION MODE'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-slate-700 space-y-1">
              <p className="font-bold text-blue-900">📌 কীভাবে API Key পাবেন?</p>
              <p className="text-[11px] font-bengali leading-relaxed text-slate-600">
                1. <a href="https://portal.steadfast.com.bd" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">portal.steadfast.com.bd</a> এ লগইন করুন। <br />
                2. বাম পাশের মেনু থেকে <strong>Settings &gt; API Key</strong> অপশনে যান। <br />
                3. সেখানে প্রাপ্ত <strong>Api Key</strong> এবং <strong>Secret Key</strong> কপি করে নিচের বক্সে বসিয়ে সেভ করুন।
              </p>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Steadfast Merchant API Key</label>
              <input
                type="text"
                placeholder="e.g. your_steadfast_api_key"
                value={steadfastConfig.apiKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, apiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Steadfast Merchant Secret Key</label>
              <input
                type="password"
                placeholder="e.g. your_steadfast_secret_key"
                value={steadfastConfig.secretKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, secretKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">API Endpoint URL</label>
              <input
                type="url"
                value={steadfastConfig.baseUrl}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, baseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              onClick={async () => {
                const pin = getAdminPin();
                try {
                  const res = await fetch('/api/admin/steadfast', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-admin-pin': pin,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ action: 'save_config', config: steadfastConfig }),
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    showNotification('স্টেডফাস্ট সেটিংস সফলভাবে ডাটাবেজে সেভ হয়েছে!');
                  } else {
                    showNotification(data.message || 'সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
                  }
                } catch (err: any) {
                  showNotification(err.message || 'Error saving Steadfast settings', 'error');
                }
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Truck className="h-4 w-4" />
              <span>Save Steadfast Settings (সেটিংস সংরক্ষণ করুন)</span>
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
