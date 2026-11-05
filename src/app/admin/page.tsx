'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Printer,
  Plus,
  TrendingUp,
  Download,
  RefreshCw,
  LogOut,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  FileDown,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

type OrderStage = 'Pending' | 'Ready for Pickup' | 'Rider' | 'Delivered' | 'Cancelled';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'prints' | 'analytics'>('orders');
  const [orderStageFilter, setOrderStageFilter] = useState<string>('All Orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [printJobs, setPrintJobs] = useState<any[]>([]);
  const [cloudActive, setCloudActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const pin = sessionStorage.getItem('ru_admin_pin');
    if (!pin) {
      router.push('/admin');
      return;
    }
    fetchAllAdminData();
  }, [router]);

  async function fetchAllAdminData() {
    setLoading(true);
    try {
      const [prodRes, ordRes, prntRes] = await Promise.allSettled([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/print-jobs', { cache: 'no-store' }),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const d = await prodRes.value.json();
        setProducts(d.products || []);
        if (d.cloudActive !== undefined) setCloudActive(d.cloudActive);
      }
      if (ordRes.status === 'fulfilled' && ordRes.value.ok) {
        const d = await ordRes.value.json();
        setOrders(d.orders || []);
      }
      if (prntRes.status === 'fulfilled' && prntRes.value.ok) {
        const d = await prntRes.value.json();
        setPrintJobs(d.jobs || d.printJobs || []);
      }
    } catch (e) {
      console.error('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  }

  // 1-Click Order Stage Progression
  async function updateOrderStage(orderId: string, newStage: OrderStage, cancelledFrom?: string) {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
          ...o,
          status: newStage,
          cancelledFromStage: newStage === 'Cancelled' ? cancelledFrom || o.status : o.cancelledFromStage,
        }
        : o
    );
    setOrders(updated);

    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: orderId,
        status: newStage,
        cancelledFromStage: newStage === 'Cancelled' ? cancelledFrom : undefined,
      }),
    }).catch(() => { });
  }

  // 1-Click Steadfast Courier Dispatch
  async function sendToSteadfast(order: any) {
    try {
      const res = await fetch('/api/steadfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, order }),
      });
      const data = await res.json();
      if (data.trackingCode) {
        alert(`Steadfast Tracking Created: ${data.trackingCode}`);
        fetchAllAdminData();
      } else {
        alert(data.message || 'Sent to Steadfast Queue!');
      }
    } catch {
      alert('Failed to connect to Steadfast API. Check Steadfast keys.');
    }
  }

  // Backup full DB as JSON
  function handleBackupJSON() {
    const payload = {
      timestamp: new Date().toISOString(),
      products,
      orders,
      printJobs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ru-insiders-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }

  // Revenue & Profit Analytics
  const analytics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const estimatedProfit = Math.round(totalRevenue * 0.32); // or exact (price - costPrice)
    const lowStockProducts = products.filter((p) => (p.stock ?? 10) <= 5);
    return { totalRevenue, estimatedProfit, validCount: validOrders.length, lowStockProducts };
  }, [orders, products]);

  const stageTabs = [
    { id: 'All Orders', label: 'All Orders (সব অর্ডার)' },
    { id: 'Pending', label: 'Pending (পেন্ডিং)' },
    { id: 'Ready for Pickup', label: 'Ready for Pickup (পিকআপ প্রস্তুত)' },
    { id: 'Rider', label: 'Rider (রাইডারের কাছে)' },
    { id: 'Delivered', label: 'Delivered (ডেলিভার্ড)' },
    { id: 'Cancelled', label: 'Cancelled (বাতিলকৃত)' },
  ];

  const filteredOrders = useMemo(() => {
    if (orderStageFilter === 'All Orders') return orders;
    return orders.filter((o) => o.status === orderStageFilter);
  }, [orders, orderStageFilter]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Dedicated Admin Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs uppercase">
            RU ADMIN
          </span>
          <h1 className="text-sm sm:text-lg font-black text-slate-900">
            Central Control Suite
          </h1>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cloudActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
          >
            {cloudActive ? '🟢 Supabase Cloud Active' : '⚡ Local Fallback Mode'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAllAdminData}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Sync Cloud
          </button>
          <button
            onClick={handleBackupJSON}
            className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Database className="h-3.5 w-3.5" /> Backup DB (JSON)
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('ru_admin_pin');
              router.push('/admin');
            }}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">Total Revenue (মোট বিক্রি)</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatBDT(analytics.totalRevenue)}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">Net Profit (আনুমানিক লাভ)</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{formatBDT(analytics.estimatedProfit)}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">Active Orders (সক্রিয় অর্ডার)</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{analytics.validCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-bold">Print Lagbe Queue (প্রিন্ট জব)</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{printJobs.length}</p>
          </div>
        </div>

        {/* Main Section Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'orders', label: `📦 5-Stage Orders (${orders.length})` },
            { id: 'prints', label: `🖨️ Print Lagbe Desk (${printJobs.length})` },
            { id: 'products', label: `👕 Product Catalog (${products.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: 5-STAGE ORDER PIPELINE */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {stageTabs.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setOrderStageFilter(st.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${orderStageFilter === st.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                    }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                এই স্টেজে কোনো অর্ডার নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-mono text-xs font-black text-blue-600">#{order.id}</span>
                        <h3 className="text-sm font-bold text-slate-900">{order.customerName || 'Student Customer'}</h3>
                        <p className="text-xs text-slate-500">{order.phone} • {order.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                          {order.status}
                        </span>
                        <p className="text-sm font-black text-slate-900 mt-1">{formatBDT(order.total || 0)}</p>
                      </div>
                    </div>

                    {/* If Cancelled, show which stage it was cancelled from + Restore button */}
                    {order.status === 'Cancelled' && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
                        <span>বাতিল পর্যায়: <strong>{order.cancelledFromStage || 'Pending'}</strong></span>
                        <button
                          onClick={() =>
                            updateOrderStage(order.id, (order.cancelledFromStage || 'Pending') as OrderStage)
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 font-bold flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" /> Restore
                        </button>
                      </div>
                    )}

                    {/* 1-Click Progression Buttons */}
                    {order.status !== 'Cancelled' && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => updateOrderStage(order.id, 'Ready for Pickup')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold"
                          >
                            👉 Mark Ready for Pickup
                          </button>
                        )}
                        {order.status === 'Ready for Pickup' && (
                          <button
                            onClick={() => updateOrderStage(order.id, 'Rider')}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                          >
                            🚴 Handover to Rider
                          </button>
                        )}
                        {order.status === 'Rider' && (
                          <button
                            onClick={() => updateOrderStage(order.id, 'Delivered')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                          >
                            ✅ Mark Delivered
                          </button>
                        )}

                        <button
                          onClick={() => sendToSteadfast(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1"
                        >
                          <Truck className="h-3.5 w-3.5 text-blue-600" /> Steadfast 1-Click
                        </button>

                        <button
                          onClick={() => updateOrderStage(order.id, 'Cancelled', order.status)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold ml-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRINT LAGBE DESK (1-Click Exact Original PDF Download) */}
        {activeTab === 'prints' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {printJobs.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                কোনো প্রিন্ট রিকোয়েস্ট নেই।
              </div>
            ) : (
              printJobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-mono text-xs font-black">
                      Token: {job.token || job.id}
                    </span>
                    <span className="text-sm font-black text-blue-600">{formatBDT(job.totalCost || job.price || 0)}</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900 truncate">📄 {job.fileName || 'Student_Document.pdf'}</p>
                    <p>
                      Pages: {job.pages} • Copies: {job.copies} • {job.colorMode} • {job.paperType}
                    </p>
                    <p className="text-slate-500">Student: {job.studentName} ({job.phone})</p>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    {job.fileUrl || job.fileData ? (
                      <a
                        href={job.fileUrl || job.fileData}
                        download={job.fileName || `RU-Print-${job.token}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <FileDown className="h-4 w-4" /> Download Original File
                      </a>
                    ) : (
                      <span className="text-xs text-rose-500 font-semibold">No file payload attached</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG OVERVIEW */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3.5 text-slate-600">{p.category}</td>
                    <td className="p-3.5 font-black text-blue-600">{formatBDT(p.price)}</td>
                    <td className="p-3.5 font-bold">{p.stock ?? 'In Stock'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}