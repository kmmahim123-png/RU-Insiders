'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomizerCanvas from '@/components/CustomizerCanvas';
import { Sparkles, Info, ShieldCheck, Ruler } from 'lucide-react';

function CustomizerContent() {
  const searchParams = useSearchParams();
  const initialGarment = (searchParams.get('garment') as any) || 'jersey';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Studio Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Interactive 2D Apparel Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          RU Insiders Customizer Studio
        </h1>
        <p className="text-sm text-slate-600 font-bengali">
          নিজের পছন্দমতো জার্সিতে নাম ও নম্বর বসান, রাবির অফিশিয়াল মনোগ্রাম প্লেসমেন্ট করুন এবং লাইভ টুডি মকআপ দেখুন।
        </p>
      </div>

      {/* Main Interactive Studio Canvas Component */}
      <CustomizerCanvas initialGarment={initialGarment} />

      {/* Sizing & Material Assurance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Ruler className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">Standard Asian Sizing</h4>
            <p className="text-[11px] text-slate-500 font-bengali">
              M (চেস্ট ৩৮"), L (চেস্ট ৪০"), XL (চেস্ট ৪২"), XXL (চেস্ট ৪৪")।
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">Permanent Screen & Sublimation</h4>
            <p className="text-[11px] text-slate-500 font-bengali">
              লন্ড্রি ওয়াশে প্রিন্ট ফেটে যাওয়া বা ওঠার কোনো ভয় নেই।
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">Easy Campus Exchange</h4>
            <p className="text-[11px] text-slate-500 font-bengali">
              সাইজ না মিললে ৪৮ ঘণ্টার মধ্যে কাউন্টারে এসে বিনামূল্যে এক্সচেঞ্জ সুবিধা।
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Customizer Studio...</div>}>
      <CustomizerContent />
    </Suspense>
  );
}
