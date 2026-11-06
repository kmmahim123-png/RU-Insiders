'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2, ExternalLink, Loader2 } from 'lucide-react';

function MapFrame() {
  const searchParams = useSearchParams();
  const queryStr = searchParams?.toString();
  const iframeSrc = queryStr ? `/unseen-ru.html?${queryStr}` : '/unseen-ru.html';

  return (
    <iframe
      src={iframeSrc}
      title="Unseen Rajshahi University & Rajshahi Interactive Map"
      className="w-full h-full border-0 select-none"
      allow="clipboard-write; fullscreen; web-share"
    />
  );
}

export default function MapPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#f6f4ec]">
      
      {/* Top Bar with Return to Store & Actions */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-2.5 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>স্টোরে ফিরুন</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Unseen RU & Rajshahi</span>
              <span className="text-emerald-700 font-bold">• রাবি ও অদেখা রাজশাহী ম্যাপ</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/unseen-ru.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>নতুন ট্যাবে খুলুন</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'প্রস্থান' : 'ফুলস্ক্রিন'}</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Map Application Frame with Suspense */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-[#f6f4ec] text-slate-500 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-xs font-bold font-bengali">ম্যাপ লোড হচ্ছে...</span>
            </div>
          }
        >
          <MapFrame />
        </Suspense>
      </main>

    </div>
  );
}
