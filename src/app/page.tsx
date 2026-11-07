'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import TopStoryHighlights from '@/components/TopStoryHighlights';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import NotificationSubscribeBanner from '@/components/NotificationSubscribeBanner';
import CompactInsideRu from '@/components/CompactInsideRu';
import TouristSpotsSection from '@/components/TouristSpotsSection';
import CompactFaculties from '@/components/CompactFaculties';
import CompactClubs from '@/components/CompactClubs';
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
    <div className="space-y-4 sm:space-y-6 pb-16 overflow-hidden bg-white">

      {/* 1. Top Circular Story Highlights (প্রোডাক্টস কালেকশন গোল আইকন) */}
      <TopStoryHighlights products={products} showViewAllButton={true} title="কালেকশন" />

      {/* 2. Breaking News Live Ticker (ক্যাম্পাস ব্রেকিং নিউজ ও আপডেট) */}
      <BreakingNewsTicker />

      {/* 3. News & Breaking Update Notification Subscribe Banner */}
      <NotificationSubscribeBanner />

      {/* 4. Compact Inside RU News, Stories, Poetry & Talent (আইকন ক্লিক করলেই একটি একটি করে নিউজ ও গল্প) */}
      <CompactInsideRu />

      {/* 5. The 3-Stage Interactive Water Map (১. বিভাগ, ২. জেলা, ৩. রাবি ক্যাম্পাস) */}
      <TouristSpotsSection />

      {/* 6. Compact RU Faculties, Departments & Careers (আইকন ক্লিক করলেই বিভাগ ও ক্যারিয়ার) */}
      <CompactFaculties />

      {/* 7. Compact RU Clubs & Online Membership (আইকন ক্লিক করলেই ক্লাব ও মেম্বারশিপ আবেদন) */}
      <CompactClubs />

      {/* 8. Quick Link to Official Merch Store Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-900 font-bengali">
              অফিশিয়াল আরইউ মার্চেন্ডাইজ কালেকশন
            </h3>
            <p className="text-xs text-slate-500 font-bengali">
              হুডি, ড্রপ-শোল্ডার, জার্সি ও কটন গেঞ্জির সব প্রিমিয়াম আইটেম সাইজ ও রঙসহ দেখতে আমাদের শপ পেজ ভিজিট করুন।
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

    </div>
  );
}
