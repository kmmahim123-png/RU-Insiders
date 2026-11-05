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
  FileUp,
  Search,
  SlidersHorizontal,
  Loader2,
  X
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterModal, { FilterState } from '@/components/FilterModal';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { formatBDT } from '@/lib/utils';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    onlyCustomizable: false,
    sortBy: 'featured',
  });

  // Fetch live products from database
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchCategory = filters.category === 'all' || product.category === filters.category;
        const matchSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.nameBn && product.nameBn.includes(searchQuery)) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        const matchCustom = filters.onlyCustomizable ? product.isCustomizable : true;

        return matchCategory && matchSearch && matchPrice && matchCustom;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
      });
  }, [products, filters, searchQuery]);

  // Dynamically extract categories
  const availableCategories = useMemo(() => {
    const defaults = [
      { id: 'all', label: 'All Items', bn: 'সব পণ্য' },
      { id: 'hoodies', label: 'Winter Hoodies', bn: 'শীতের হুডি' },
      { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
      { id: 'jerseys', label: 'Custom Jerseys', bn: 'কাস্টম জার্সি' },
      { id: 't-shirts', label: 'T-Shirts (গেঞ্জি)', bn: 'কটন গেঞ্জি' },
      { id: 'accessories', label: 'Accessories', bn: 'এক্সেসরিজ' },
    ];
    const customCats = products
      .map((p) => p.category)
      .filter((c) => !defaults.some((d) => d.id === c))
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .map((c) => ({
        id: c,
        label: c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        bn: c,
      }));
    return [...defaults, ...customCats];
  }, [products]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++;
    if (filters.onlyCustomizable) count++;
    if (filters.sortBy !== 'featured') count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 overflow-hidden bg-slate-50">
      
      {/* 1. Minimalist Campus Hero with Rajshahi University Scenic Background */}
      <section className="relative overflow-hidden border-b border-slate-200/80 shadow-sm">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.92]"
          style={{ backgroundImage: `url('/ru-campus.jpg')` }}
        />
        {/* Modern Translucent Soft Frost Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/70 backdrop-blur-[1.5px]" />

        <div className="relative max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Elegant Campus Headline (No duplicate logo circle) */}
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-800 text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>RU Insiders • মতিহারের সবুজ চত্বর</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                অফিশিয়াল ক্যাম্পাস মার্চেন্ডাইজ ও প্রিন্ট স্টেশন
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-bengali font-medium leading-relaxed">
                রাজশাহী বিশ্ববিদ্যালয়ের থিমে তৈরি প্রিমিয়াম উইন্টার হুডি, ওভারসাইজড ড্রপ শোল্ডার, কাস্টম ডিপার্টমেন্ট জার্সি ও ইনস্ট্যান্ট PDF প্রিন্ট সার্ভিস।
              </p>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-start md:justify-end">
              <Link
                href="/customize"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                <span>জার্সি/হুডি কাস্টমাইজ</span>
              </Link>

              <Link
                href="/print-station"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
              >
                <Printer className="h-4 w-4 text-blue-600" />
                <span>Print Lagbe (PDF)</span>
              </Link>

              <a
                href="https://www.facebook.com/ru.insiders/followers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 hover:text-blue-700 shadow-sm transition-colors"
                title="Facebook Community"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PRODUCTS DIRECTLY IN FRONT (Decluttered, Modern Toolbar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Minimalist Toolbar Bar (Zero clutter, "No hijibiji") */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন (যেমন হুডি, ড্রপ শোল্ডার, জার্সি)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Clean Filter Trigger Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeFiltersCount > 0
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters (ফিল্টার)</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-700 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              {filteredProducts.length} টি পণ্য
            </span>
          </div>

        </div>

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Applied:</span>
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                <span className="capitalize">{filters.category.replace('-', ' ')}</span>
                <button onClick={() => setFilters({ ...filters, category: 'all' })}>
                  <X className="h-3.5 w-3.5 text-blue-600" />
                </button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                <span>{formatBDT(filters.minPrice)} – {filters.maxPrice >= 10000 ? '৳10,000+' : formatBDT(filters.maxPrice)}</span>
                <button onClick={() => setFilters({ ...filters, minPrice: 0, maxPrice: 10000 })}>
                  <X className="h-3.5 w-3.5 text-emerald-600" />
                </button>
              </span>
            )}
            {filters.onlyCustomizable && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                <span>Customizable Only</span>
                <button onClick={() => setFilters({ ...filters, onlyCustomizable: false })}>
                  <X className="h-3.5 w-3.5 text-amber-600" />
                </button>
              </span>
            )}
            <button
              onClick={() =>
                setFilters({
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 10000,
                  onlyCustomizable: false,
                  sortBy: 'featured',
                })
              }
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Live Product Grid (Mobile 2-column, Desktop 4-column) */}
        {loading ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-slate-500 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>পণ্য লোড হচ্ছে...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3 shadow-sm">
            <p className="text-base font-bold text-slate-800">কোনো পণ্য পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-500 font-bengali">
              ফিল্টার পরিবর্তন করুন অথবা অ্যাডমিন প্যানেল থেকে নতুন প্রোডাক্ট যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* 3. "Print Lagbe" (প্রিন্ট লাগবে) Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold font-mono">
                <Printer className="h-3.5 w-3.5 text-emerald-400" />
                <span>PRINT LAGBE • প্রিন্ট লাগবে</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                টেলিগ্রাম ও হোয়াটসঅ্যাপের ঝামেলা শেষ! <br />
                <span className="text-amber-300">সরাসরি ওয়েবসাইট থেকে PDF প্রিন্ট দিন</span>
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 font-bengali leading-relaxed">
                অ্যাসাইনমেন্ট, ল্যাব রিপোর্ট বা প্রেজেন্টেশন স্লাইড ওয়েবসাইট থেকে সরাসরি আপলোড করুন, পিকআপ টোকেন পান এবং মতিহার প্যারিস রোডের কাউন্টারে পৌঁছে রেডি প্রিন্ট কপি সংগ্রহ করুন।
              </p>

              <div className="pt-2">
                <Link
                  href="/print-station"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Upload PDF & Print (প্রিন্ট অর্ডার করুন)</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-mono text-emerald-300 font-bold">LIVE PRINT QUEUE</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Token:</span>
                  <span className="text-amber-400 font-bold">#RU-PRNT-4821</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-white font-semibold truncate">CSE_4102_Lab_Report.pdf</div>
                  <div className="text-blue-200">18 Pages • Double-Sided B&W • 80 GSM</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs flex items-center justify-between">
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
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Interactive 2D Custom Studio
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              আপনার ব্যাচ বা ডিপার্টমেন্টের নিজস্ব জার্সি ও হুডি ডিজাইন করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
              পেছনে আপনার নাম ও ফেভারিট নম্বর, বুকে রাবির মনোগ্রাম বা শাবাশ বাংলাদেশ লোগো বসিয়ে লাইভ প্রিভিউ দেখুন এবং সরাসরি অর্ডার করুন।
            </p>
          </div>
          <Link
            href="/customize"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Open Customizer Studio
          </Link>
        </div>
      </section>

      {/* Filter Modal / Bottom Sheet */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        totalMatches={filteredProducts.length}
        categoriesList={availableCategories}
      />

    </div>
  );
}
