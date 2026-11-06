'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowRight, MapPin, Maximize2, Sparkles, Navigation } from 'lucide-react';

interface CampusSpotSlide {
  titleBn: string;
  titleEn: string;
  location: string;
  image: string;
  desc: string;
  mapPlaceId: string;
}

const RU_SPOTS_SLIDES: CampusSpotSlide[] = [
  {
    titleBn: 'ঐতিহাসিক প্যারিস রোড',
    titleEn: 'Historic Paris Road',
    location: 'ক্যাম্পাস মূল সড়ক • প্রশাসন ভবন থেকে কাজলা',
    image: '/campus/paris-road-rain.jpg',
    desc: 'সুউচ্চ গগনশিরীষ বৃক্ষশোভিত মতিহারের সবচেয়ে নান্দনিক ও রূপময় রাস্তা।',
    mapPlaceId: 'paris_road'
  },
  {
    titleBn: 'সাবাস বাংলাদেশ ভাস্কর্য',
    titleEn: 'Shabash Bangladesh Memorial',
    location: 'সিনেট ভবন ও মেইন গেট সংলগ্ন উন্মুক্ত চত্বর',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    desc: 'শিল্পী নিতুন কুন্ডু নির্মিত মহান মুক্তিযুদ্ধের অমর স্মৃতিস্তম্ভ ও শিক্ষার্থীদের প্রিয় আড্ডাস্থল।',
    mapPlaceId: 'shabash_bd'
  },
  {
    titleBn: 'সৈয়দ নজরুল ইসলাম প্রশাসন ভবন ও গোল চত্বর',
    titleEn: 'Administrative Building & Roundabout',
    location: 'প্যারিস রোডের কেন্দ্রস্থল',
    image: '/campus/ru-admin.jpg',
    desc: 'বিশ্ববিদ্যালয়ের কেন্দ্রীয় প্রশাসনিক ভবন, সিনেট ভবন এবং সুদৃশ্য গোল চত্বর।',
    mapPlaceId: 'admin_senate'
  },
  {
    titleBn: 'বধ্যভূমি স্মৃতিস্তম্ভ',
    titleEn: 'Boddhobhumi Memorial',
    location: 'ক্যাম্পাসের উত্তর-পূর্ব প্রান্ত',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    desc: '১৯৭১ সালের মহান মুক্তিযুদ্ধে শহীদদের আত্মত্যাগের চিরন্তন স্মৃতিস্তম্ভ।',
    mapPlaceId: 'boddhobhumi'
  },
  {
    titleBn: 'শেখ কামাল স্টেডিয়াম',
    titleEn: 'Sheikh Kamal Stadium',
    location: 'কেন্দ্রীয় স্টেডিয়াম ও ইনডোর স্পোর্টস জোন',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    desc: 'ক্যাম্পাসের হৃদপিণ্ডে অবস্থিত বিশাল সবুজ খেলার মাঠ ও বার্ষিক অ্যাথলেটিক্স ভেন্যু।',
    mapPlaceId: 'stadium'
  },
  {
    titleBn: 'শহীদ স্মৃতি সংগ্রহশালা',
    titleEn: 'Shaheed Smriti Museum',
    location: 'মেইন গেটের পূর্ব পাশে',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    desc: 'বাংলাদেশের প্রথম স্থায়ী মুক্তিযুদ্ধ জাদুঘর যা মতিহার ক্যাম্পাসে অবস্থিত।',
    mapPlaceId: 'smriti_museum'
  },
  {
    titleBn: 'বোটানিক্যাল গার্ডেন',
    titleEn: 'Botanical Garden',
    location: 'উত্তর ক্যাম্পাস • রেললাইনের দক্ষিণ পাশে',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    desc: 'শত শত প্রজাতির দুর্লভ বৃক্ষ, শান্ত লেক ও সবুজ নিবিড় প্রাকৃতিক উদ্যান।',
    mapPlaceId: 'botanical_garden'
  }
];

export default function CampusTourBanner() {
  const [slides, setSlides] = useState<CampusSpotSlide[]>(RU_SPOTS_SLIDES);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Load custom slides configured in Admin Dashboard (with server sync)
  useEffect(() => {
    const loadSlides = () => {
      try {
        const saved = localStorage.getItem('ru_main_banner_slides_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
            return;
          }
        }
      } catch (e) {}
      setSlides(RU_SPOTS_SLIDES);
    };

    loadSlides();

    // Fetch from server for cross-device persistence
    async function syncBannerSlides() {
      try {
        const res = await fetch('/api/spots', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bannerSlides) && data.bannerSlides.length > 0) {
            setSlides(data.bannerSlides);
            try {
              localStorage.setItem('ru_main_banner_slides_v1', JSON.stringify(data.bannerSlides));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    syncBannerSlides();

    window.addEventListener('ru_banner_slides_updated', loadSlides);
    return () => window.removeEventListener('ru_banner_slides_updated', loadSlides);
  }, []);

  // Auto-rotate slides smoothly every 4.2 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSpot = slides[currentIdx] || slides[0] || RU_SPOTS_SLIDES[0];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="relative overflow-hidden rounded-3xl bg-[#064e3b] border border-emerald-500/30 shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center">
        
        {/* Dynamic Background Image Showcase (Auto-Rotating) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {slides.map((slide, idx) => (
            <div
              key={slide.titleBn + idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out filter brightness-[0.88] ${
                idx === currentIdx ? 'opacity-80 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
          ))}

          {/* Lush Green Gradients to guarantee text readability and vibrant campus identity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#032e23] via-[#064e3b]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022119] via-[#064e3b]/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full py-8 sm:py-12 px-5 sm:px-10 lg:px-12">
          <div className="max-w-2xl space-y-4">
            
            {/* Live Spot Tracker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>মতিহারের সবুজ চত্বর • ৪২টি টেরিটরি অঞ্চল</span>
              <span className="text-white/40">|</span>
              <span className="text-amber-300 font-semibold truncate max-w-[200px]">
                📍 {activeSpot.titleBn}
              </span>
            </div>

            {/* Core Question Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg font-bengali">
                দেখুন ভার্সিটির কতটুকু ঘোরা হলো
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-bengali font-semibold leading-relaxed max-w-xl">
                রাজশাহী বিশ্ববিদ্যালয়ের কোন কোন জায়গা ঘুরেছেন তা ইন্টারঅ্যাক্টিভ ম্যাপে চিহ্নিত করুন এবং আপনার ভ্রমণ শতকরা বের করুন।
              </p>
            </div>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/map?region=ru"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-black/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-45 transition-transform text-slate-950" />
                <span>রাজশাহী বিশ্ববিদ্যালয় (ম্যাপে দেখুন) →</span>
              </Link>
            </div>

            {/* Slide Navigation Dots & Spot Name Selector */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-300 mr-1">দর্শনীয় স্পট:</span>
              {slides.map((slide, idx) => (
                <button
                  key={slide.titleBn + idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    idx === currentIdx
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105'
                      : 'bg-white/15 hover:bg-white/30 text-white/90 backdrop-blur-sm'
                  }`}
                >
                  {slide.titleBn}
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
