'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Search,
  SlidersHorizontal,
  Loader2,
  X,
  ShoppingBag,
  Tag,
  ArrowRight,
  Maximize2,
  Compass
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterModal, { FilterState } from '@/components/FilterModal';
import CampusMapExplorer from '@/components/CampusMapExplorer';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { formatBDT } from '@/lib/utils';

const campusSlides = [
  { src: '/campus/ru-admin.jpg', name: 'প্রশাসন ভবন ও গোল চত্বর' },
  { src: '/campus/paris-road-rain.jpg', name: 'বৃষ্টিতে মতিহার ও প্যারিস রোড' },
  { src: '/campus/ru-gate.jpg', name: 'বিশ্ববিদ্যালয় প্রধান ফটক' },
  { src: '/campus/ru-spot.jpg', name: 'প্যারিস রোডের ছায়াবীথি' },
  { src: '/campus/ru-roundabout.jpg', name: 'মতিহারের সবুজ প্রান্তর' },
  { src: '/campus/ru-master-plan-3d.jpg', name: 'মতিহার ৩ডি মাস্টারপ্ল্যান' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Dynamic campus slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % campusSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    onlyCustomizable: false,
    sortBy: 'featured',
  });

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
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

  const availableCategories = useMemo(() => {
    const defaults = [
      { id: 'all', label: 'All Items', bn: 'সব পণ্য' },
      { id: 'hoodies', label: 'Hoodies', bn: 'শীতের হুডি' },
      { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
      { id: 'jerseys', label: 'Custom Jerseys', bn: 'কাস্টম জার্সি' },
      { id: 't-shirts', label: 'T-Shirts', bn: 'কটন গেঞ্জি' },
      { id: 'accessories', label: 'Accessories', bn: 'এক্সেসরিজ' },
    ];
    const customCats = products
      .map((p) => p.category)
      .filter((c) => c && !defaults.some((d) => d.id === c))
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
    <div className="space-y-8 sm:space-y-12 pb-20 overflow-hidden bg-white">

      {/* 1. Minimalist Campus Hero with Dynamic Slideshow */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-900 min-h-[300px] sm:min-h-[340px] flex items-center">
        {/* Dynamic Campus Photos Slideshow - Vivid, clearly visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {campusSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out filter brightness-[0.92] ${
                index === activeSlide ? 'opacity-85 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url('${slide.src}')` }}
            />
          ))}
          {/* Subtle gradient to keep left text ultra-readable while preserving full picture visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div className="max-w-2xl space-y-3 bg-slate-950/40 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RU Insiders • মতিহারের সবুজ চত্বর</span>
                <span className="text-white/40">|</span>
                <span className="text-amber-300 font-semibold text-[11px]">📍 {campusSlides[activeSlide].name}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                অফিশিয়াল রাজশাহী বিশ্ববিদ্যালয় মার্চেন্ডাইজ স্টোর
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-bengali font-medium leading-relaxed max-w-xl">
                মতিহারের ভালোবাসায় তৈরি অফিসিয়াল হুডি, ওভারসাইজড ড্রপ শোল্ডার, কটন গেঞ্জি, এক্সেসরিজ ও ক্যাম্পাস কালেকশন। পছন্দমতো পণ্য নির্বাচন করে সহজেই অর্ডার করুন।
              </p>

              {/* Campus Photo Indicators */}
              <div className="flex items-center gap-1.5 pt-1">
                {campusSlides.map((slide, idx) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    title={slide.name}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide ? 'w-7 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Unseen RU Interactive Map Section (Google Argon Model Map) */}
      <section id="campus-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Unseen RU • ৪২টি সীমানা অঞ্চল ও রুট ম্যাপ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              আনসিন রাজশাহী বিশ্ববিদ্যালয় — ইন্টারঅ্যাক্টিভ সীমানা ম্যাপ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
              ম্যাপে ক্লিক করে আপনি যে যে এলাকা ঘুরে দেখেছেন সেগুলো সবুজ করুন, লাইভ পারসেন্টেজ দেখুন এবং আপনার অর্জনের পোস্টার ডাউনলোড করে বন্ধুদের সাথে শেয়ার করুন!
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/map"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-[0.98]"
            >
              <Maximize2 className="h-4 w-4" />
              <span>⛶ ফুলস্ক্রিন ম্যাপ খুলুন</span>
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Map Frame */}
        <div className="w-full h-[640px] sm:h-[720px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-[#f6f4ec] relative">
          <iframe
            src="/unseen-ru.html"
            title="Unseen Rajshahi University Interactive Map"
            className="w-full h-full border-0 select-none"
            allow="clipboard-write; fullscreen; web-share"
          />
        </div>
      </section>

      {/* 3. Storefront Search, Category Pills & Product Grid with Campus Backdrop Effect */}
      <section id="catalog" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Ambient Campus Photo Background Effect behind the products */}
        <div 
          className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 rounded-3xl bg-cover bg-center pointer-events-none opacity-[0.16] filter saturate-150 contrast-110"
          style={{ backgroundImage: `url('/campus/ru-admin.jpg')` }}
        />
        <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 rounded-3xl bg-gradient-to-b from-white/90 via-white/80 to-white/95 pointer-events-none" />

        <div className="relative z-10 space-y-5">
        {/* Search & Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
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

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeFiltersCount > 0
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

            <span className="text-xs text-slate-500 font-bold whitespace-nowrap hidden sm:inline">
              {filteredProducts.length} টি পণ্য
            </span>
          </div>
        </div>

        {/* Horizontal Quick Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {availableCategories.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {cat.bn} ({cat.label})
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-slate-500 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>পণ্য লোড হচ্ছে...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3 shadow-sm">
            <p className="text-base font-bold text-slate-800">কোনো পণ্য পাওয়া যায়নি।</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 10000,
                  onlyCustomizable: false,
                  sortBy: 'featured',
                });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              সব পণ্য দেখুন (Reset Filters)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        </div>
      </section>

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