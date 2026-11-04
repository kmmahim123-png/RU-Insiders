'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Package, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle,
  Phone,
  Send,
  ExternalLink
} from 'lucide-react';
import { formatBDT, formatDate } from '@/lib/utils';

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackType, setTrackType] = useState<'merch' | 'print'>('merch');
  const [queryCode, setQueryCode] = useState(searchParams.get('orderNumber') || searchParams.get('token') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode || !phone) {
      setError('Please provide both identification code and phone number to verify your order.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = trackType === 'merch' 
        ? `/api/orders?orderNumber=${encodeURIComponent(queryCode)}&phone=${encodeURIComponent(phone)}`
        : `/api/print-station?token=${encodeURIComponent(queryCode)}&phone=${encodeURIComponent(phone)}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No matching records found. Please double-check your code and phone.');
      }

      setResult(trackType === 'merch' ? data.order : data.job);
    } catch (err: any) {
      setError(err.message || 'Error looking up tracking details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Real-Time Status Lookup
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Track Your Merch Order & Print Job
        </h1>
        <p className="text-sm text-slate-400 font-bengali">
          অর্ডার বা প্রিন্ট টোকেন নম্বর এবং মোবাইল নম্বর দিয়ে বর্তমান অবস্থা জানুন।
        </p>
      </div>

      {/* Tracker Card & Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Toggle between Merch Order vs Print Job */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTrackType('merch');
              setResult(null);
              setError(null);
            }}
            className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              trackType === 'merch'
                ? 'bg-rose-900/60 text-amber-300 border border-rose-700/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Merchandise Order (পোশাকের অর্ডার)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTrackType('print');
              setResult(null);
              setError(null);
            }}
            className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              trackType === 'print'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="h-4 w-4" />
            <span>Print Station Token (প্রিন্ট লাগবে)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                {trackType === 'merch' ? 'Order Number (যেমন RU-ORD-1092)' : 'Pickup Token (যেমন RU-PRNT-4821)'}
              </label>
              <input
                type="text"
                required
                placeholder={trackType === 'merch' ? 'RU-ORD-XXXX' : 'RU-PRNT-XXXX'}
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Phone Number (অর্ডারের সময় ব্যবহৃত মোবাইল নম্বর)
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50"
          >
            <Search className="h-4 w-4 text-slate-950" />
            <span>{loading ? 'Verifying...' : 'Track Live Status'}</span>
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* TRACKING RESULT DISPLAY */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {trackType === 'merch' ? 'ORDER RECORD' : 'PRINT QUEUE RECORD'}
              </span>
              <h3 className="text-xl font-black text-white font-mono">
                {result.orderNumber || result.token}
              </h3>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase">
              {result.status.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Stepper Visualizer */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Placed / Queued</div>
              </div>

              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border ${
                  result.status !== 'pending' && result.status !== 'queued'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Processing / Print</div>
              </div>

              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border ${
                  result.status === 'shipped_steadfast' || result.status === 'ready_for_pickup' || result.status === 'delivered' || result.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  <Truck className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Shipped / Ready</div>
              </div>

              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border ${
                  result.status === 'delivered' || result.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="font-bold text-white text-[11px]">Completed</div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Customer Name:</span>
              <span className="text-white font-medium">{result.customerName}</span>
            </div>
            {result.steadfastTrackingCode && (
              <div className="flex justify-between text-slate-400">
                <span>Steadfast Courier Code:</span>
                <span className="text-amber-400 font-mono font-bold">{result.steadfastTrackingCode}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Created Time:</span>
              <span className="text-slate-300 font-mono">{formatDate(result.createdAt)}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold">
              <span>Total Amount:</span>
              <span className="text-emerald-400 font-mono text-sm">{formatBDT(result.total || result.totalAmount)}</span>
            </div>
          </div>

          {/* Direct Support Link */}
          <div className="text-center pt-2">
            <a
              href="https://wa.me/8801718000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Need help? Message RU Insiders Support on WhatsApp</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
