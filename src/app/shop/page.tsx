'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterModal, { FilterState } from '@/components/FilterModal';
import TopStoryHighlights from '@/components/TopStoryHighlights';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { Search, SlidersHorizontal, Loader2, X, Tag } from 'lucide-react';
import { formatBDT } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategoryParam,
    minPrice: 0,
    maxPrice: 10000,
    onlyCustomizable: false,
    sortBy: 'featured',
  });

  // Sync with URL param if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  // Fetch live products from database
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
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

  // Dynamically compute all categories including custom ones added in admin
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

        return matchCategory && matchSearch && matchPrice;
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
    if (filters.sortBy !== 'featured') count++;
    return count;
  }, [filters]);

  const removeFilterTag = (key: keyof FilterState) => {
    if (key === 'category') setFilters({ ...filters, category: 'all' });
    if (key === 'minPrice' || key === 'maxPrice') setFilters({ ...filters, minPrice: 0, maxPrice: 10000 });
    if (key === 'sortBy') setFilters({ ...filters, sortBy: 'featured' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* 1. Top Story Highlights (কালেকশন - গোল আইকন) with Compact Icon-Based Find & Filter */}
      <div className="-mx-4 sm:mx-0">
        <TopStoryHighlights
          products={products}
          showViewAllButton={false}
          title="কালেকশন"
          containerClassName="w-full px-0 py-0"
          cardClassName="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-none sm:rounded-3xl p-3.5 sm:p-5 border-y sm:border border-slate-200/90 shadow-xs sm:shadow-sm space-y-3"
          headerRight={
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Small Find / Search Icon Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isSearchOpen || searchQuery
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
              title="পণ্য খুঁজুন (Search Products)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">খুঁজুন</span>
            </button>

            {/* Small Filter Icon Button with Active Badge */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all relative flex items-center gap-1.5 shadow-xs ${
                activeFiltersCount > 0
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
              title="ফিল্টার (Filters)"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">ফিল্টার</span>
              {activeFiltersCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Product Count Pill */}
            <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-xs hidden xs:inline">
              {filteredProducts.length}টি পণ্য
            </span>
          </div>
        }
      >
        {/* Expandable Compact Search Input (Only shows when search icon is clicked or query exists) */}
        {(isSearchOpen || searchQuery) && (
          <div className="relative w-full pt-1 transition-all">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-blue-600" />
            <input
              type="text"
              autoFocus
              placeholder="পণ্য খুঁজুন (যেমন হুডি, ড্রপ শোল্ডার, গেঞ্জি, এক্সেসরিজ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-2xl bg-white border-2 border-blue-500 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none shadow-sm font-medium"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 sm:top-3.5 text-slate-400 hover:text-rose-600"
                title="ক্লিয়ার করুন"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-3 sm:top-3.5 text-slate-400 hover:text-slate-700"
                title="বন্ধ করুন"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </TopStoryHighlights>
      </div>

      {/* 2. Structured Category Selection Box (ক্যাটাগরি বক্স - এক সারিতে না থেকে সুন্দর বক্সে) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 font-bengali">
              ক্যাটাগরি নির্বাচন করুন (Categories)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            বর্তমানে সক্রিয়: {availableCategories.find((c) => c.id === filters.category)?.bn || 'সব পণ্য'}
          </span>
        </div>

        {/* Structured Grid Box for Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 pt-0.5">
          {availableCategories.map((cat) => {
            const isActive = filters.category === cat.id;
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 group ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/30 scale-[1.02] font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {count}টি
                  </span>
                  {isActive && <span className="text-xs text-white font-bold">✓</span>}
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-bold font-bengali tracking-tight line-clamp-1">
                    {cat.bn}
                  </div>
                  <div
                    className={`text-[10px] font-medium truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {cat.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-medium">সক্রিয় ফিল্টার:</span>
          
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

      {/* Product Grid */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Filter Modal */}
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span>শপ লোড হচ্ছে...</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
