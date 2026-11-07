'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import TopStoryHighlights from '@/components/TopStoryHighlights';
import CampusTourBanner from '@/components/CampusTourBanner';
import TouristSpotsSection from '@/components/TouristSpotsSection';
import CampusNewsLiteratureSection from '@/components/CampusNewsLiteratureSection';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/store';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.error('Failed to load live products:', err);
      }
    }

    loadLiveProducts();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 overflow-hidden bg-white">

      {/* 1. Top Circular Story Highlights (কালেকশন গোল আইকন) */}
      <TopStoryHighlights products={products} showViewAllButton={true} title="কালেকশন" />

      {/* 2. Campus Tour Rotating Showcase Banner ("আপনি কি রাজশাহী বিশ্ববিদ্যালয়ের সব জায়গা ঘুরেছেন? Explore RU") */}
      <CampusTourBanner />

      {/* 3. Rajshahi & Division Tourist Attractions Guide & Interactive Details View */}
      <TouristSpotsSection />

      {/* 4. Quick Link to Full Shop Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-900 font-bengali">
              অফিশিয়াল আরইউ মার্চেন্ডাইজ কালেকশন
            </h3>
            <p className="text-xs text-slate-500 font-bengali">
              হুডি, ড্রপ-শোল্ডার, জার্সি ও কটন গেঞ্জির সব আইটেম সাইজ ও রঙসহ দেখতে আমাদের শপ পেজ ভিজিট করুন।
            </p>
          </div>
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all shrink-0"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>সব পণ্য দেখুন (Go to Shop)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 5. Daily Campus News, Literature, Poetry & RU Talent Spotlight Section */}
      <CampusNewsLiteratureSection />

    </div>
  );
}
