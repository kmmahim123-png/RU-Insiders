'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, ProductCategory } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Fetch live products directly from the persistent database
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.error('Failed to load live products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLiveProducts();
  }, []);

  const categories: { id: ProductCategory; label: string; bn: string }[] = [
    { id: 'all', label: 'All Products', bn: 'সব পণ্য' },
    { id: 'hoodies', label: 'Hoodies', bn: 'শীতের হুডি' },
    { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
    { id: 'jerseys', label: 'Custom Jerseys', bn: 'কাস্টম জার্সি' },
    { id: 't-shirts', label: 'T-Shirts (গেঞ্জি)', bn: 'কটন গেঞ্জি' },
    { id: 'accessories', label: 'Accessories', bn: 'এক্সেসরিজ' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameBn && product.nameBn.includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: respect custom admin ordering (orderIndex)
      return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-10 sm:space-y-14 pb-20 overflow-hidden">
      
      {/* 1. Header Banner & Identity */}
      <section className="relative pt-6 sm:pt-8 pb-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-4 text-left">
            <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 p-0.5 bg-slate-900 shadow-glow">
              <img
                src="/logo.png"
                alt="RU Insiders Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RU Insiders • রাজশাহী বিশ্ববিদ্যালয়</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                অফিশিয়াল ক্যাম্পাস মার্চেন্ডাইজ ও প্রিন্ট স্টেশন
              </h1>
              <p className="text-xs text-slate-400 font-bengali">
                মতিহারের ভালোবাসায় তৈরি হুডি, ওভারসাইজড ড্রপ শোল্ডার, কাস্টম জার্সি এবং দ্রুততম PDF প্রিন্ট সেবা।
              </p>
            </div>
          </div>

          {/* Quick Actions (Customize & Print) */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-start md:justify-end">
            <Link
              href="/customize"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>জার্সি/হুডি কাস্টমাইজ</span>
            </Link>

            <Link
              href="/print-station"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-emeraldGlow transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Lagbe (PDF)</span>
            </Link>

            <a
              href="https://www.facebook.com/ru.insiders/followers"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-800/80 text-blue-300 hover:text-white transition-colors"
              title="Facebook Community"
            >
              <Facebook className="h-4 w-4 text-blue-400" />
            </a>
          </div>

        </div>
      </section>

      {/* 2. PRODUCTS DIRECTLY IN FRONT (User Requested: "r duklai age productu thakbe samne") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Catalog Header & Filter Control Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400">
                  <Flame className="h-4 w-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Available Products (সকল পোশাক ও পণ্য)
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-bengali mt-0.5">
                অ্যাডমিন প্যানেল থেকে সাজানো ক্রম অনুসারে লাইভ প্রদর্শিত হচ্ছে • মোট {products.length}টি পণ্য
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Category Tabs & Sorter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-rose-900/70 text-amber-300 border border-rose-700/80 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="featured">Admin Priority (সাজানো ক্রম)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Product Grid */}
        {loading ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 flex items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
            <span>Loading live catalog from database...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <p className="text-base font-semibold text-slate-300">কোনো পণ্য পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-500 font-bengali">
              অ্যাডমিন প্যানেল থেকে নতুন প্রোডাক্ট যুক্ত করুন অথবা সার্চ ফিল্টার ক্লিয়ার করুন।
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <span>Go to Admin Panel</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* 3. "Print Lagbe" (প্রিন্ট লাগবে) Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-500/30 overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                <Printer className="h-3.5 w-3.5" />
                <span>PRINT LAGBE • প্রিন্ট লাগবে</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                টেলিগ্রাম ও হোয়াটসঅ্যাপের ঝামেলা শেষ! <br />
                <span className="text-emerald-400">সরাসরি ওয়েবসাইট থেকে PDF প্রিন্ট দিন</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
                অ্যাসাইনমেন্ট, ল্যাব রিপোর্ট বা প্রেজেন্টেশন স্লাইড আর কাউন্টারে দাঁড়িয়ে ফাইল খোঁজার দরকার নেই। ওয়েবসাইট থেকে সরাসরি ড্র্যাগ অ্যান্ড ড্রপ করে PDF আপলোড করুন, পিকআপ টোকেন পান এবং মতিহার প্যারিস রোডের কাউন্টারে পৌঁছে রেডি প্রিন্ট কপি হাতে নিন!
              </p>

              <div className="pt-2">
                <Link
                  href="/print-station"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-emeraldGlow transition-all"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Upload PDF & Print (প্রিন্ট অর্ডার করুন)</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm glass-card p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
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
                <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Pickup
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Customizer Studio Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-rose-900/50 bg-gradient-to-r from-rose-950/50 via-slate-950 to-amber-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Interactive 2D Custom Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              আপনার ব্যাচ বা ডিপার্টমেন্টের নিজস্ব জার্সি ও হুডি ডিজাইন করুন
            </h2>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              পেছনে আপনার নাম ও ফেভারিট নম্বর, বুকে রাবির মনোগ্রাম বা শাবাশ বাংলাদেশ লোগো বসিয়ে লাইভ প্রিভিউ দেখুন এবং সরাসরি অর্ডার করুন।
            </p>
          </div>
          <Link
            href="/customize"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow transition-all"
          >
            Open Customizer Studio
          </Link>
        </div>
      </section>

    </div>
  );
}
