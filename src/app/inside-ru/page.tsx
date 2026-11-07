'use client';

import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, Sparkles, Bell } from 'lucide-react';
import InsideRajshahiSection from '@/components/InsideRajshahiSection';
import NotificationSubscribeBanner from '@/components/NotificationSubscribeBanner';

export default function InsideRuPage() {
  return (
    <div className="min-h-screen bg-white pb-16 font-bengali">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white border-b border-blue-800/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <Home className="h-3.5 w-3.5" />
                <span>হোম</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">ইনসাইড আরইউ</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-blue-500/20 border border-blue-400/30">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </span>
              <span>ইনসাইড রাজশাহী বিশ্ববিদ্যালয়: ক্যাম্পাস নিউজ, গল্প, সাহিত্য ও কবিতা</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl">
              দৈনিক ক্যাম্পাস সংবাদ, শিক্ষার্থীদের লেখা গল্প, কবিতা, রিসার্চ পেপার ও মেধার স্বীকৃতিসমূহ এক নজরে পড়ুন ও মন্তব্য করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-800/80 border border-blue-600/50 text-blue-200 text-xs font-bold shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              লাইভ আপডেট কর্নার
            </span>
          </div>
        </div>
      </div>

      {/* Instant Notification Banner */}
      <NotificationSubscribeBanner />

      {/* Main Full News & Literary Portal */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        <InsideRajshahiSection />
      </main>
    </div>
  );
}
