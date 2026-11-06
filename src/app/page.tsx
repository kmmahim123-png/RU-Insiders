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
import TopStoryHighlights from '@/components/TopStoryHighlights';
import CampusTourBanner from '@/components/CampusTourBanner';
import TouristSpotsSection from '@/components/TouristSpotsSection';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { formatBDT } from '@/lib/utils';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
    <div className="space-y-6 sm:space-y-10 pb-20 overflow-hidden bg-white">

      {/* 1. Top Story Highlights (কালেকশন) */}
      <TopStoryHighlights products={products} />

      {/* 2. Campus Tour Rotating Showcase Banner ("আপনি কি রাজশাহী বিশ্ববিদ্যালয়ের সব জায়গা ঘুরেছেন? Explore RU") */}
      <CampusTourBanner />

      {/* 3. Rajshahi & Division Tourist Attractions Guide (পাতা _ রাজশাহী বিভাগ.html অনুযায়ী দর্শনীয় স্থানসমূহ) */}
      <TouristSpotsSection />

      {/* 4. Storefront Search, Category Pills & Product Grid with Campus Backdrop Effect */}
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