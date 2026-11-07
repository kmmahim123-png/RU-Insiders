'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Bell, ChevronRight, Sparkles, Volume2 } from 'lucide-react';

interface BreakingNewsItem {
  id: string;
  badge: string;
  headline: string;
  linkText?: string;
  category: string;
}

const DEFAULT_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'bn-1',
    badge: 'জরুরি ভর্তি বিজ্ঞপ্তি',
    headline: 'রাজশাহী বিশ্ববিদ্যালয় ২০২৪-২০২৫ শিক্ষাবর্ষের স্নাতক (সম্মান) ১ম বর্ষ ভর্তি পরীক্ষার পূর্ণাঙ্গ রুটিন প্রকাশিত হয়েছে।',
    linkText: 'বিস্তারিত রুটিন',
    category: 'ভর্তি'
  },
  {
    id: 'bn-2',
    badge: 'গবেষণা ও প্রকাশনা',
    headline: 'আন্তর্জাতিক পরিবেশ বিজ্ঞান জার্নালে রাজশাহী বিশ্ববিদ্যালয়ের ভূতত্ত্ব গবেষকদের বরেন্দ্র ভূগর্ভস্থ পানি মডেল উচ্চ প্রশংসিত।',
    linkText: 'পেপার পড়ুন',
    category: 'গবেষণা'
  },
  {
    id: 'bn-3',
    badge: 'ক্লাব সদস্য আহ্বান',
    headline: 'রাজশাহী ইউনিভার্সিটি ক্যারিয়ার ক্লাব (RUCS) ও সায়েন্স ক্লাবে নতুন সেশনের সদস্য ভর্তি চলছে — অনলাইনে যুক্ত হোন!',
    linkText: 'ক্লাবে আবেদন',
    category: 'ক্লাব'
  },
  {
    id: 'bn-4',
    badge: 'সাহিত্য ও গল্প',
    headline: 'ইনসাইড আরইউ: মতিহারের প্রেম, প্যারিস রোডের স্মৃতি ও শিক্ষার্থীদের স্বরচিত কবিতা ও গল্প প্রকাশিত হচ্ছে প্রতিদিন।',
    linkText: 'গল্প পড়ুন',
    category: 'সাহিত্য'
  }
];

export default function BreakingNewsTicker() {
  const [newsList, setNewsList] = useState<BreakingNewsItem[]>(DEFAULT_BREAKING_NEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [newsList.length]);

  const currentItem = newsList[currentIndex] || newsList[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-1 sm:p-1.5 shadow-md flex items-center gap-2 sm:gap-3 text-white">
        
        {/* Red Flashing Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-[11px] sm:text-xs font-black tracking-wide font-bengali uppercase shadow border border-white/20 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
          </span>
          <Flame className="h-3.5 w-3.5 text-amber-300 shrink-0" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Dynamic Rotating Headline */}
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 overflow-hidden py-1">
          <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold font-bengali text-amber-100 shrink-0">
            {currentItem.badge}
          </span>
          
          <p className="text-xs sm:text-sm font-bold font-bengali text-white truncate transition-all duration-300 animate-in fade-in slide-in-from-bottom-1">
            {currentItem.headline}
          </p>
        </div>

        {/* Action Link */}
        <a
          href="#inside-ru"
          className="shrink-0 hidden sm:flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-slate-900 hover:bg-amber-100 text-[11px] font-black font-bengali transition-colors shadow-sm"
        >
          <span>{currentItem.linkText || 'পড়ুন'}</span>
          <ChevronRight className="h-3 w-3 text-slate-700" />
        </a>

      </div>
    </div>
  );
}
