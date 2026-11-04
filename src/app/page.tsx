'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Facebook, 
  Flame, 
  Layers,
  FileUp,
  MapPin,
  Clock
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/lib/store';

export default function HomePage() {
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      
      {/* 1. Hero Showcase Section */}
      <section className="relative min-h-[580px] sm:min-h-[680px] flex items-center justify-center pt-8 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/40 via-slate-950/90 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] sm:w-[800px] sm:h-[400px] bg-rose-700/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Facebook Community Pill */}
          <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <a
              href="https://www.facebook.com/ru.insiders/followers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Facebook className="h-3.5 w-3.5 text-blue-400" />
              <span>Official RU Insiders Community</span>
              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full font-mono">
                Facebook Page
              </span>
            </a>
          </div>

          {/* Hero Headlines */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Wear the Pride of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
                Rajshahi University
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-bengali leading-relaxed">
              মতিহারের প্যারিস রোড, শহীদ মিনার আর রাজশাহী বিশ্ববিদ্যালয়ের ভালোবাসায় নির্মিত প্রিমিয়াম শীতের হুডি, ওভারসাইজড ড্রপ শোল্ডার, কাস্টমাইজড স্পোর্টস জার্সি ও দ্রুততম <span className="text-amber-400 font-bold">"প্রিন্ট লাগবে"</span> সার্ভিস।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/customize"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>Customize Jersey & Hoodie (ডিজাইন কর)</span>
            </Link>

            <Link
              href="/print-station"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-[0.98]"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>Print Lagbe (PDF প্রিন্ট দাও)</span>
            </Link>
          </div>

          {/* Metrics & Features Ribbon */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="glass-card p-3 rounded-xl border border-slate-800">
              <div className="text-lg font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400">Authentic RU Merch</div>
            </div>
            <div className="glass-card p-3 rounded-xl border border-slate-800">
              <div className="text-lg font-black text-amber-400">2-Min</div>
              <div className="text-[11px] text-slate-400">Instant PDF Print Queue</div>
            </div>
            <div className="glass-card p-3 rounded-xl border border-slate-800">
              <div className="text-lg font-black text-emerald-400">Campus</div>
              <div className="text-[11px] text-slate-400">Free Spot Pickup</div>
            </div>
            <div className="glass-card p-3 rounded-xl border border-slate-800">
              <div className="text-lg font-black text-rose-400">64 Districts</div>
              <div className="text-[11px] text-slate-400">Steadfast Courier COD</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Category Quick Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Explore Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Merchandise & University Wear
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              title: 'Winter Hoodies',
              bn: 'শীতের প্রিমিয়াম হুডি',
              href: '/shop?category=hoodies',
              desc: '340+ GSM Brushed Fleece',
              color: 'from-rose-900/40 to-slate-900',
              border: 'border-rose-900/50',
            },
            {
              title: 'Drop Shoulder',
              bn: 'ওভারসাইজড ড্রপ শোল্ডার',
              href: '/shop?category=drop-shoulder',
              desc: '220 GSM Combed Cotton',
              color: 'from-amber-900/30 to-slate-900',
              border: 'border-amber-900/40',
            },
            {
              title: 'Custom Jerseys',
              bn: 'স্পোর্টস জার্সি (নাম ও নম্বর)',
              href: '/customize?garment=jersey',
              desc: 'Inter-Dept & Fest Wear',
              color: 'from-emerald-900/30 to-slate-900',
              border: 'border-emerald-900/40',
            },
            {
              title: 'T-Shirts & Ganji',
              bn: 'সাবাশ বাংলাদেশ টি-শার্ট',
              href: '/shop?category=t-shirts',
              desc: '100% Breathable Cotton',
              color: 'from-blue-900/30 to-slate-900',
              border: 'border-blue-900/40',
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className={`group p-5 rounded-2xl bg-gradient-to-b ${cat.color} border ${cat.border} hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[130px]`}
            >
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-300 font-bengali mt-0.5">{cat.bn}</p>
              </div>
              <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400">
                <span>{cat.desc}</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <Flame className="h-4 w-4" />
              <span>Trending Campus Merch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Signature Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. "Print Lagbe" (প্রিন্ট লাগবে) Campus Document Print Station Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/30 overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-900 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                <Printer className="h-3.5 w-3.5" />
                <span>PRINT LAGBE • প্রিন্ট স্টেশন</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                টেলিগ্রাম ও হোয়াটসঅ্যাপের ঝামেলা শেষ! <br />
                <span className="text-emerald-400">সরাসরি ওয়েবসাইট থেকে PDF প্রিন্ট দাও</span>
              </h2>

              <p className="text-sm text-slate-300 font-bengali leading-relaxed">
                অ্যাসাইনমেন্ট, ল্যাব রিপোর্ট বা প্রেজেন্টেশন স্লাইড আর কাউন্টারে দাঁড়িয়ে ঘণ্টার পর ঘণ্টা অপেক্ষা করতে হবে না। ওয়েবসাইট থেকে সরাসরি ড্র্যাগ অ্যান্ড ড্রপ করে PDF আপলোড করুন, পিকআপ টোকেন পান এবং মতিহার প্যারিস রোডের কাউন্টারে পৌঁছে রেডি প্রিন্ট কপি হাতে নিন!
              </p>

              {/* 3 Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-emerald-400 font-mono">STEP 01</div>
                  <div className="text-slate-200 font-medium">Upload PDF</div>
                  <div className="text-[11px] text-slate-400">পেজ সংখ্যা ও রঙিন/সাদাকালো বাছাই</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-amber-400 font-mono">STEP 02</div>
                  <div className="text-slate-200 font-medium">Get Token Code</div>
                  <div className="text-[11px] text-slate-400">যেমন #RU-PRNT-8429</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-rose-400 font-mono">STEP 03</div>
                  <div className="text-slate-200 font-medium">Fast Pickup</div>
                  <div className="text-[11px] text-slate-400">কাউন্টারে কোড দেখিয়ে সংগ্রহ করুন</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/print-station"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-emeraldGlow transition-all"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Go to Print Station (প্রিন্ট অর্ডার করুন)</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono text-emerald-400 font-bold">LIVE PRINT QUEUE</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Token:</span>
                  <span className="text-amber-400 font-bold">#RU-PRNT-4821</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-300 font-semibold truncate">CSE_4102_Lab_Report.pdf</div>
                  <div className="text-slate-500">18 Pages • Double-Sided B&W • 80 GSM</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Pickup
                  </span>
                </div>

                <div className="text-[11px] text-center text-slate-400 pt-1">
                  Operator Desk Computer Access Synchronized
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Customizer Studio Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-900/50 bg-gradient-to-r from-rose-950/50 via-slate-950 to-amber-950/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Interactive 2D Custom Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              আপনার ব্যাচ বা ডিপার্টমেন্টের নিজস্ব জার্সি ও হুডি ডিজাইন করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
              পেছনে আপনার নাম ও ফেভারিট নম্বর, বুকে রাবির মনোগ্রাম বা শাবাশ বাংলাদেশ লোগো বসিয়ে লাইভ প্রিভিউ দেখুন এবং সরাসরি অর্ডার করুন।
            </p>
          </div>
          <Link
            href="/customize"
            className="shrink-0 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow transition-all"
          >
            Open Customizer Studio
          </Link>
        </div>
      </section>

    </div>
  );
}
