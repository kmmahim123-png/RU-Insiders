'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import FilterModal, { FilterState } from '@/components/FilterModal';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { Search, SlidersHorizontal, Loader2, Sparkles, X } from 'lucide-react';
import { formatBDT } from '@/lib/utils';

export default function ShopPage() {
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
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            setProducts(data.products);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filtered and Sorted Products
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

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++;
    if (filters.onlyCustomizable) count++;
    if (filters.sortBy !== 'featured') count++;
    return count;
  }, [filters]);

  const removeFilterTag = (key: keyof FilterState) => {
    if (key === 'category') setFilters({ ...filters, category: 'all' });
    if (key === 'minPrice' || key === 'maxPrice') setFilters({ ...filters, minPrice: 0, maxPrice: 10000 });
    if (key === 'onlyCustomizable') setFilters({ ...filters, onlyCustomizable: false });
    if (key === 'sortBy') setFilters({ ...filters, sortBy: 'featured' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Page Header */}
      <div className="space-y-1 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <span>Official RU Store</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          RU Insiders Apparel & Merch
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-bengali">
          রাজশাহী বিশ্ববিদ্যালয়ের থিমে তৈরি অফিশিয়াল হুডি, ড্রপ শোল্ডার এবং কাস্টমাইজড পোশাক সংগ্রহ।
        </p>
      </div>

      {/* Clean, Decluttered Toolbar (Replacing the old crowded row) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
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

        {/* Filter Trigger Button */}
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

      {/* Active Filter Badges Bar (Shows active criteria clearly) */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-medium">Active filters:</span>
          
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              <span className="capitalize">{filters.category.replace('-', ' ')}</span>
              <button onClick={() => removeFilterTag('category')}>
                <X className="h-3.5 w-3.5 text-blue-600 hover:text-blue-900" />
              </button>
            </span>
          )}

          {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <span>{formatBDT(filters.minPrice)} – {filters.maxPrice >= 10000 ? '৳10,000+' : formatBDT(filters.maxPrice)}</span>
              <button onClick={() => removeFilterTag('minPrice')}>
                <X className="h-3.5 w-3.5 text-emerald-600 hover:text-emerald-900" />
              </button>
            </span>
          )}

          {filters.onlyCustomizable && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>Customizable Only</span>
              <button onClick={() => removeFilterTag('onlyCustomizable')}>
                <X className="h-3.5 w-3.5 text-amber-600 hover:text-amber-900" />
              </button>
            </span>
          )}

          {filters.sortBy !== 'featured' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
              <span>Sort: {filters.sortBy === 'price-asc' ? 'Price Low' : 'Price High'}</span>
              <button onClick={() => removeFilterTag('sortBy')}>
                <X className="h-3.5 w-3.5 text-slate-600 hover:text-slate-900" />
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
            className="text-xs text-rose-600 hover:text-rose-700 font-bold underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid - Mobile 2-column, Desktop 4-column */}
      {loading ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-slate-500 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span>পণ্য লোড হচ্ছে...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3 shadow-sm">
          <p className="text-base font-bold text-slate-800">কোনো পণ্য খুঁজে পাওয়া যায়নি।</p>
          <p className="text-xs text-slate-500 font-bengali">
            অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
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
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Filter Modal / Bottom Sheet */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        totalMatches={filteredProducts.length}
      />

    </div>
  );
}
