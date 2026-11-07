'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Users, Award, Sparkles, MessageCircle } from 'lucide-react';
import RuClubsSection from '@/components/RuClubsSection';

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-bengali">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border-b border-emerald-800/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <Home className="h-3.5 w-3.5" />
                <span>হোম</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">ক্লাব ও সংগঠন</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </span>
              <span>রাজশাহী বিশ্ববিদ্যালয়ের সকল ক্লাব ও সংগঠন (মেম্বারশিপ পোর্টাল)</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
              ক্যারিয়ার, বিতর্ক, সায়েন্স, রক্তদান, সংস্কৃতি, রোবোটিক্স ও কোডিং ক্লাবসমূহের বিস্তারিত তথ্য এবং অনলাইনে সরাসরি সদস্য হওয়ার সুযোগ।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold shadow-inner">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              অনলাইন মেম্বারশিপ পোর্টাল
            </span>
          </div>
        </div>
      </div>

      {/* Main Clubs Portal Component */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        <RuClubsSection hideHeroBanner={true} />
      </main>
    </div>
  );
}
