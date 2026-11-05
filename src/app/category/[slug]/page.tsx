'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { Loader2, ArrowLeft, Tag, ShoppingBag } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const resolvedParams = use(params);
  const currentCategorySlug = resolvedParams.slug.toLowerCase();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Compute all available categories from live products
  const availableCategories = useMemo(() => {
    const defaults = [
      { id: 'hoodies', label: 'Winter Hoodies', bn: 'শীতের হুডি' },
      { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
      { id: 'jerseys', label: 'Custom Jerseys', bn: 'কাস্টম জার্সি' },
      { id: 't-shirts', label: 'T-Shirts (গেঞ্জি)', bn: 'কটন গেঞ্জি' },
      { id: 'accessories', label: 'Campus Accessories', bn: 'এক্সেসরিজ' },
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

  // Current category details
  const currentCategory = useMemo(() => {
    return (
      availableCategories.find((c) => c.id === currentCategorySlug) || {
        id: currentCategorySlug,
        label: currentCategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        bn: currentCategorySlug,
      }
    );
  }, [availableCategories, currentCategorySlug]);

  // Products belonging strictly to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category.toLowerCase() === currentCategorySlug);
  }, [products, currentCategorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">হোম</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-blue-600 transition-colors">শপ</Link>
        <span>/</span>
        <span className="text-blue-600 font-bold">{currentCategory.bn}</span>
      </div>

      {/* Category Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-[0.5px]"
          style={{ backgroundImage: `url('/campus/paris-road.jpg')` }}
        />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold font-mono">
            <Tag className="h-3.5 w-3.5 text-amber-400" />
            <span>CATEGORY COLLECTION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {currentCategory.bn} ({currentCategory.label})
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-bengali">
            রাজশাহী বিশ্ববিদ্যালয়ের থিমে তৈরি প্রিমিয়াম {currentCategory.bn} কালেকশন। মোট {categoryProducts.length} টি পণ্য পাওয়া গেছে।
          </p>
        </div>
      </div>

      {/* Quick Other Categories Switcher */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-600">অন্যান্য ক্যাটাগরি দেখুন:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Link
            href="/shop"
            className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition-all"
          >
            সব পণ্য (All Items)
          </Link>
          {availableCategories.map((cat) => {
            const isSelected = cat.id === currentCategorySlug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.bn}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products in this category */}
      {loading ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-slate-500 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span>পণ্য লোড হচ্ছে...</span>
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3 shadow-sm">
          <p className="text-base font-bold text-slate-800">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।</p>
          <p className="text-xs text-slate-500 font-bengali">
            অ্যাডমিন প্যানেল থেকে এই ক্যাটাগরিতে নতুন পণ্য আপলোড করা হলে এখানে প্রদর্শিত হবে।
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>অন্যান্য পণ্য দেখুন</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
