'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { ProductCategory } from '@/lib/types';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  const categories: { id: ProductCategory; label: string; bn: string }[] = [
    { id: 'all', label: 'All Items', bn: 'সব পোশাক' },
    { id: 'hoodies', label: 'Hoodies', bn: 'শীতের হুডি' },
    { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
    { id: 'jerseys', label: 'Custom Jerseys', bn: 'স্পোর্টস জার্সি' },
    { id: 't-shirts', label: 'T-Shirts (গেঞ্জি)', bn: 'কটন টি-শার্ট' },
    { id: 'accessories', label: 'Accessories', bn: 'ক্যাম্পাস ব্যাগ ও এক্সেসরিজ' },
  ];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameBn && product.nameBn.includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCustom = onlyCustomizable ? product.isCustomizable : true;

      return matchCategory && matchSearch && matchCustom;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.salesCount - a.salesCount;
    });
  }, [selectedCategory, searchQuery, sortBy, onlyCustomizable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Official Store Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          RU Insiders Apparel & Merch
        </h1>
        <p className="text-sm text-slate-400 font-bengali">
          রাজশাহী বিশ্ববিদ্যালয়ের থিমে তৈরি অফিশিয়াল হুডি, ড্রপ শোল্ডার এবং কাস্টমাইজড পোশাক সংগ্রহ।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-900/60 text-amber-300 border border-rose-700/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Controls: Search, Sort, Custom toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="featured">Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Customizable Toggle */}
          <button
            onClick={() => setOnlyCustomizable(!onlyCustomizable)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              onlyCustomizable
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Customizable Only</span>
          </button>

        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 text-slate-500 text-sm">
          No products matched your search or category filter. Try clearing filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
