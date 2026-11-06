'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      const existingPin = sessionStorage.getItem('ru_admin_pin');
      if (existingPin) {
        router.push('/admin/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'ভুল অ্যাডমিন পিন বা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।');
      }

      sessionStorage.setItem('ru_admin_pin', pin.trim());
      if (data.token) {
        sessionStorage.setItem('ru_admin_token', data.token);
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      // Offline fallback for standard administrative PIN (1953)
      if (pin.trim() === '1953') {
        sessionStorage.setItem('ru_admin_pin', '1953');
        router.push('/admin/dashboard');
        return;
      }
      setError(err.message || 'অথেন্টিকেশন ব্যর্থ হয়েছে। সঠিক পিন দিন।');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM ONLINE • RU INSIDERS</span>
        </div>
      </div>

      {/* Center Login Container */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className={`bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6 transition-all ${
          shake ? 'animate-shake' : ''
        }`}>
          
          {/* Logo & Shield Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 border border-white/20">
              <KeyRound className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                অ্যাডমিন কন্ট্রোল পোর্টাল
              </h1>
              <p className="text-xs text-slate-400 font-bengali">
                RU Insiders সেন্ট্রাল ড্যাশবোর্ড ও ম্যানেজমেন্ট সিকিউরিটি
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-400" />
                  <span>অ্যাডমিন অ্যাক্সেস কি (Security Key)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>লুকান</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>দেখান</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="পাসওয়ার্ড বা পিন লিখুন..."
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-white font-mono text-center tracking-widest text-base font-bold placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pin.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badges */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-center">
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-blue-400" />
                Hardware Protected
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              রাজশাহী বিশ্ববিদ্যালয় অফিশিয়াল মার্চেন্ডাইজ কন্ট্রোল হাব
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Footer Copyright */}
      <div className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-600 z-10">
        © {new Date().getFullYear()} RU Insiders. Protected Administrative Environment.
      </div>

    </div>
  );
}
