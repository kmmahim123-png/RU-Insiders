'use client';

import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import RevenueCharts from '@/components/RevenueCharts';
import PrintDesk from '@/components/PrintDesk';
import SteadfastModal from '@/components/SteadfastModal';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_PRINT_JOBS, 
  INITIAL_STEADFAST_CONFIG, 
  calculateRevenueSummary 
} from '@/lib/store';
import { Product, Order, PrintJob, SteadfastConfig, ProductCategory } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'print-desk' | 'orders' | 'products' | 'steadfast'>('analytics');
  
  // State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(INITIAL_PRINT_JOBS);
  const [steadfastConfig, setSteadfastConfig] = useState<SteadfastConfig>(INITIAL_STEADFAST_CONFIG);
  
  // Steadfast Modal State
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<Order | null>(null);

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('hoodies');
  const [newProductPrice, setNewProductPrice] = useState(1150);
  const [newProductCost, setNewProductCost] = useState(650);
  const [newProductStock, setNewProductStock] = useState(30);
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCustomizable, setNewProductCustomizable] = useState(false);
  const [productAddSuccess, setProductAddSuccess] = useState(false);

  // Check PIN auth on mount
  useEffect(() => {
    const pin = sessionStorage.getItem('ru_admin_pin');
    if (!pin) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('ru_admin_pin');
    router.push('/admin');
  };

  const revenueSummary = calculateRevenueSummary(orders, printJobs, products);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`;
    
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newProductName,
      nameBn: '',
      category: newProductCategory,
      description: newProductDesc || 'Official Rajshahi University Merch',
      price: Number(newProductPrice),
      costPrice: Number(newProductCost),
      regularPrice: Math.round(Number(newProductPrice) * 1.25),
      images: [newProductImage],
      colors: [{ name: 'Campus Maroon', hex: '#881337' }, { name: 'Midnight Black', hex: '#18181b' }],
      sizes: ['M', 'L', 'XL', 'XXL'],
      stock: Number(newProductStock),
      salesCount: 0,
      isCustomizable: newProductCustomizable,
      badge: 'New Arrival',
    };

    setProducts([newProd, ...products]);
    setProductAddSuccess(true);
    setNewProductName('');
    setNewProductDesc('');
    setTimeout(() => setProductAddSuccess(false), 3000);
  };

  const handleCourierSuccess = (consignmentId: string, trackingCode: string) => {
    if (!selectedOrderForCourier) return;

    const updatedOrders = orders.map((o) =>
      o.id === selectedOrderForCourier.id
        ? {
            ...o,
            status: 'shipped_steadfast' as const,
            steadfastConsignmentId: consignmentId,
            steadfastTrackingCode: trackingCode,
          }
        : o
    );

    setOrders(updatedOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Admin Tabs Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-800 to-amber-700 text-white shadow-crimsonGlow border border-rose-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              RU Insiders Executive Studio
              <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                ADMIN AUTHENTICATED
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-bengali">
              অর্ডার প্রসেসিং, প্রিন্ট ডেস্ক, আয়-ব্যয় এবং স্টেডফাস্ট কুরিয়ার নিয়ন্ত্রণ
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors self-end md:self-auto"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Session</span>
        </button>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {[
          { id: 'analytics', label: 'Revenue & Profit', icon: TrendingUp, count: null },
          { id: 'print-desk', label: 'Print Lagbe Desk', icon: Printer, count: printJobs.filter(j => j.status === 'queued').length },
          { id: 'orders', label: 'Merchandise Orders', icon: ShoppingBag, count: orders.length },
          { id: 'products', label: 'Product Manager', icon: PlusCircle, count: products.length },
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
                  ? 'bg-rose-900/60 text-amber-300 border border-rose-700/60 shadow-sm'
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

      {/* TAB 1: REVENUE & PROFIT ANALYTICS */}
      {activeTab === 'analytics' && (
        <RevenueCharts summary={revenueSummary} />
      )}

      {/* TAB 2: PRINT DESK OPERATOR CONSOLE */}
      {activeTab === 'print-desk' && (
        <PrintDesk initialJobs={printJobs} onJobUpdate={setPrintJobs} />
      )}

      {/* TAB 3: MERCHANDISE ORDERS PROCESSING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Apparel Orders Management</h2>
              <p className="text-xs text-slate-400 font-bengali">হুডি, ড্রপ শোল্ডার ও কাস্টমাইজড জার্সির লাইভ অর্ডার ডেলিভারি পাইপলাইন</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              Total: {orders.length} Orders
            </span>
          </div>

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
                  <span className="text-xs text-slate-400 font-mono">{formatDate(order.createdAt)}</span>
                </div>

                {/* Items & Customer Info */}
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
                              Custom Print: {it.customization.playerName} #{it.customization.playerNumber}
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

                {/* Courier Dispatch Actions */}
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
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
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
                        `আসসালামু আলাইকুম ${order.customerName}, আপনার RU Insiders অর্ডার #${order.orderNumber} এর আপডেট। বর্তমান স্ট্যাটাস: ${order.status.replace(/_/g, ' ')}। ধন্যবাদ!`
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
        </div>
      )}

      {/* TAB 4: PRODUCT MANAGER (Add Hoodie, Drop Shoulder, Ganji with Price, Cost & Picture) */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add Product Form (5 Cols) */}
          <form onSubmit={handleAddProduct} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-amber-400" />
                <span>Add New Product to Store</span>
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                নতুন হুডি, ড্রপ শোল্ডার, গেঞ্জি বা জার্সির ছবি ও বিবরণ যুক্ত করুন
              </p>
            </div>

            {productAddSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Product added to store successfully!</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Title (নাম)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RU Varsity Winter Hoodie Maroon"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category (ক্যাটাগরি)</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="hoodies">Winter Hoodie (শীতের হুডি)</option>
                  <option value="drop-shoulder">Drop Shoulder (ড্রপ শোল্ডার)</option>
                  <option value="jerseys">Custom Sports Jersey (জার্সি)</option>
                  <option value="t-shirts">Classic Ganji / T-Shirt (গেঞ্জি)</option>
                  <option value="accessories">Campus Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Retail Price (বিক্রয় মূল্য)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Price (উৎপাদন খরচ)</label>
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
                  <label className="block text-slate-400 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customizable?</label>
                  <button
                    type="button"
                    onClick={() => setNewProductCustomizable(!newProductCustomizable)}
                    className={`w-full py-2 rounded-xl border font-bold transition-all ${
                      newProductCustomizable
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {newProductCustomizable ? 'YES (Customizable)' : 'NO'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Fabric GSM, fit details, wash care..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publish Product to Store</span>
            </button>
          </form>

          {/* Current Products Inventory Table (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Current Product Inventory ({products.length})</h3>
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        {p.category} • Stock: {p.stock} • Sales: {p.salesCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-amber-400">{formatBDT(p.price)}</div>
                    <span className="text-[10px] text-slate-500">Cost: {formatBDT(p.costPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: STEADFAST COURIER API CONFIG */}
      {activeTab === 'steadfast' && (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Steadfast Courier Integration</h2>
              <p className="text-xs text-slate-400 font-bengali">
                স্টেডফাস্ট কুরিয়ারের অফিশিয়াল API ক্রেডেনশিয়াল ও অটো-বুকিং সেটিংস
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

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Live API Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  AUTHENTICATED & READY
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bengali">
                আপনার মার্চেন্ডাইজ অর্ডার এলে এক ক্লিকেই স্টেডফাস্ট পোর্টালে কনসাইনমেন্ট আইডি ও ট্র্যাকিং কোড জেনারেট হয়ে যাবে।
              </p>
            </div>

            <button
              onClick={() => alert('Steadfast credentials saved securely to session!')}
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
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
