'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#f6f4ec]">
      <main className="flex-1 w-full h-full relative">
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
