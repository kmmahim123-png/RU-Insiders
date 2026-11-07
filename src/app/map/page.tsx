'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Sparkles, Home, Layers } from 'lucide-react';
import TouristSpotsSection from '@/components/TouristSpotsSection';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-bengali">
      {/* Page Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white border-b border-emerald-800/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <Home className="h-3.5 w-3.5" />
                <span>হোম</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">রাজশাহী ম্যাপ</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </span>
              <span>রাজশাহী বিভাগের পূর্ণাঙ্গ ৩-ধাপের ইন্টারঅ্যাক্টিভ ম্যাপ</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              ১. রাজশাহী বিভাগ (৮ জেলা) • ২. রাজশাহী জেলা (২২ অঞ্চল) • ৩. রাজশাহী বিশ্ববিদ্যালয় (৪২ স্পট)। স্থানগুলো ঘুরে দেখুন এবং আপনার ভ্রমণ অগ্রগতি চিহ্নিত করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              লাইভ ওয়াটার-ফিল ম্যাপ সক্রিয়
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        <TouristSpotsSection />
      </main>
    </div>
  );
}
