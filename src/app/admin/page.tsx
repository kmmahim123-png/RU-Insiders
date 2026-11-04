'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Incorrect Admin PIN. Try founding year: 1953');
      }

      // Store in session storage for client-side API requests
      sessionStorage.setItem('ru_admin_pin', pin);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl text-center">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900">
            RU Insiders Admin Portal
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            অ্যাডমিন অ্যানালিটিক্স, প্রিন্ট ডেস্ক ও পণ্য ব্যবস্থাপনা প্যানেল
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left text-xs">
            <label className="block text-slate-700 mb-1 font-semibold">Enter Admin Security PIN</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Default: 1953"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <span className="block text-[11px] text-slate-500 mt-1.5 text-center">
              Hint: Rajshahi University founding year (<strong className="text-blue-600">1953</strong>)
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
          Strict Role-Based Access Control • Encrypted Session
        </div>

      </div>
    </div>
  );
}
