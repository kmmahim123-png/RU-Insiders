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
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl text-center">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-800 to-amber-700 flex items-center justify-center mx-auto border border-rose-500/30 shadow-crimsonGlow">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">
            RU Insiders Admin Portal
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            অ্যাডমিন অ্যানালিটিক্স, প্রিন্ট ডেস্ক ও পণ্য ব্যবস্থাপনা প্যানেল
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Enter Admin Security PIN</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Default: 1953"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <span className="block text-[11px] text-slate-500 mt-1">
              Hint: Rajshahi University founding year (<strong className="text-amber-400">1953</strong>)
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-900">
          Strict Role-Based Access Control • Encrypted Session
        </div>

      </div>
    </div>
  );
}
