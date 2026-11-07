'use client';

import React from 'react';
import Link from 'next/link';
import { Home, GraduationCap, Briefcase, Globe2, Sparkles } from 'lucide-react';
import RuFacultiesSection from '@/components/RuFacultiesSection';

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-bengali">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-b border-indigo-900/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-indigo-300">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <Home className="h-3.5 w-3.5" />
                <span>হোম</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">অনুষদ ও বিভাগ</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </span>
              <span>রাজশাহী বিশ্ববিদ্যালয়ের সকল অনুষদ, বিভাগ ও ক্যারিয়ার সম্ভাবনা</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl">
              ১২টি অনুষদ, ৫৯টি অ্যাকাডেমিক বিভাগ, সর্বমোট আসন সংখ্যা, দেশে ও বিদেশে উচ্চশিক্ষা এবং ক্যারিয়ার সুযোগ ও অ্যালামনাই নেটওয়ার্ক।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-800/80 border border-indigo-600/50 text-indigo-200 text-xs font-bold shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ৫৯টি অ্যাকাডেমিক বিভাগ
            </span>
          </div>
        </div>
      </div>

      {/* Main Faculties & Career Guide Component */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        <RuFacultiesSection />
      </main>
    </div>
  );
}
