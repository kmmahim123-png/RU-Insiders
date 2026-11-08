'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Sparkles,
  Home,
  Layers,
  ExternalLink,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react';
import TouristSpotsSection from '@/components/TouristSpotsSection';

export default function MapPage() {
  const [activeTab, setActiveTab] = useState<'gemini_ru' | 'three_stage'>('gemini_ru');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-bengali">
      {/* Page Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white border-b border-emerald-800/60 py-5 sm:py-7 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <Home className="h-3.5 w-3.5" />
                <span>হোম</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">রাজশাহী ম্যাপ</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </span>
              <span>রাজশাহী বিশ্ববিদ্যালয় ও রাজশাহী বিভাগ ইন্টারঅ্যাক্টিভ ম্যাপ</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              রাবি ক্যাম্পাস (৪২ স্পট), রাজশাহী সিটি (২৪ স্পট), রাজশাহী জেলা ও পূর্ণাঙ্গ বিভাগীয় মানচিত্র। স্থানগুলো ঘুরুন ও ভ্রমণ অগ্রগতি ট্র্যাক করুন।
            </p>
          </div>

          {/* Map Switcher Tabs */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-emerald-600/40 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('gemini_ru')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                activeTab === 'gemini_ru'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>🎓 রাবি আনসিন ম্যাপ (জেমিনি আরগন)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('three_stage')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                activeTab === 'three_stage'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>🌊 ৩-ধাপের ওয়াটার ম্যাপ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        {activeTab === 'gemini_ru' ? (
          /* ================================================================= */
          /* OPTION 1: AUTHENTIC GEMINI ARGON UNSEEN RU & RAJSHAHI MAP         */
          /* ================================================================= */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Top Toolbar for Gemini Map */}
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">Unseen RU & Rajshahi • জেমিনি আরগন সংস্করণ</span>
                <span className="hidden sm:inline text-slate-400">• ৪২ ক্যাম্পাস স্পট, সিটি, জেলা ও Antigravity</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/unseen-ru.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">নতুন ট্যাবে খুলুন</span>
                </a>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1"
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  <span>{isFullscreen ? 'প্রস্থান' : 'ফুলস্ক্রিন'}</span>
                </button>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="w-full h-[75vh] min-h-[600px] bg-[#f6f4ec]">
              <iframe
                src="/unseen-ru.html"
                title="Unseen Rajshahi University Interactive Map (Gemini Argon)"
                className="w-full h-full border-0 select-none"
                allow="clipboard-write; fullscreen; web-share"
              />
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* OPTION 2: 3-STAGE WATER-FILL MAP (DIVISION, DISTRICT & RU CAMPUS) */
          /* ================================================================= */
          <TouristSpotsSection />
        )}
      </main>
    </div>
  );
}
