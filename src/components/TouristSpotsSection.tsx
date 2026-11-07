'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Camera,
  Sparkles
} from 'lucide-react';
import {
  RAJSHAHI_DIVISION_DISTRICTS,
  DIVISION_ALL_95_SPOTS,
  TouristSpot,
  getStoredTouristSpots
} from '@/lib/touristSpots';
import RajshahiDivisionWaterMap from './RajshahiDivisionWaterMap';

export default function TouristSpotsSection() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('rajshahi');
  const [allSpots, setAllSpots] = useState<TouristSpot[]>(DIVISION_ALL_95_SPOTS);
  const [selectedSpotForDetails, setSelectedSpotForDetails] = useState<TouristSpot | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [visitedSpotIds, setVisitedSpotIds] = useState<string[]>([]);

  useEffect(() => {
    setAllSpots(getStoredTouristSpots());

    // Sync with server for multi-device cross-platform persistence
    async function syncWithServer() {
      try {
        const res = await fetch('/api/spots', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.customTouristSpots) && data.customTouristSpots.length > 0) {
            try {
              localStorage.setItem('ru_custom_tourist_spots_v1', JSON.stringify(data.customTouristSpots));
            } catch (e) {}
            setAllSpots(getStoredTouristSpots());
          }
        }
      } catch (e) {
        console.warn('Server spots sync:', e);
      }
    }
    syncWithServer();

    const handleUpdate = () => {
      setAllSpots(getStoredTouristSpots());
    };
    window.addEventListener('ru_tourist_spots_updated', handleUpdate);
    return () => window.removeEventListener('ru_tourist_spots_updated', handleUpdate);
  }, []);

  // Load visited state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ru_visited_tourist_spots_v1');
      if (saved) {
        setVisitedSpotIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const toggleVisitedSpot = (spotId: string) => {
    const updated = visitedSpotIds.includes(spotId)
      ? visitedSpotIds.filter((id) => id !== spotId)
      : [...visitedSpotIds, spotId];
    setVisitedSpotIds(updated);
    try {
      localStorage.setItem('ru_visited_tourist_spots_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleOpenDetails = (spot: TouristSpot) => {
    setSelectedSpotForDetails(spot);
    setActiveGalleryIdx(0);
  };

  return (
    <section id="tourist-attractions" className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1 pt-2">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-bengali">
            রাজশাহী ও রাজশাহী বিভাগের ঐতিহ্যবাহী দর্শনীয় স্থান
          </h2>
        </div>
      </div>

      {/* Unified Interactive Rajshahi Division Water-Fill Progress Map & Vertical Spot Explorer */}
      <RajshahiDivisionWaterMap
        visitedSpotIds={visitedSpotIds}
        totalSpotsCount={allSpots.length || 95}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(distId) => setSelectedDistrict(distId)}
        allSpots={allSpots}
        onToggleVisited={toggleVisitedSpot}
        onOpenSpotDetails={handleOpenDetails}
      />

      {/* ================================================================= */}
      {/* SPOT DETAILS MODAL (বিস্তারিত তথ্য, একাধিক ছবি গ্যালারি ও লোকেশন) */}
      {/* ================================================================= */}
      {selectedSpotForDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    ক্রমিক {selectedSpotForDetails.rankNo}
                  </span>
                  <span className="text-xs text-emerald-200 font-semibold font-bengali">
                    {selectedSpotForDetails.districtBn}
                  </span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-white pt-1 font-bengali">
                  {selectedSpotForDetails.nameBn}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSpotForDetails(null)}
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Photo Gallery Viewer */}
              {(() => {
                const images = Array.isArray(selectedSpotForDetails.images) && selectedSpotForDetails.images.length > 0
                  ? selectedSpotForDetails.images
                  : (selectedSpotForDetails.imageUrl ? [selectedSpotForDetails.imageUrl] : []);
                const currentImg = images[activeGalleryIdx] || images[0];

                return (
                  <div className="space-y-2.5">
                    {/* Main Active Image View with Next/Prev controls */}
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                      <img
                        src={currentImg}
                        alt={selectedSpotForDetails.nameBn}
                        className="w-full h-full object-cover"
                      />
                      
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setActiveGalleryIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition shadow-md"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveGalleryIdx((prev) => (prev + 1) % images.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition shadow-md"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold">
                            {activeGalleryIdx + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveGalleryIdx(i)}
                            className={`relative h-14 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                              i === activeGalleryIdx ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Spot Information Details */}
              <div className="space-y-3 font-bengali">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                    <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>অবস্থান: {selectedSpotForDetails.locationBn}</span>
                  </div>

                  {/* Mark as Visited Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleVisitedSpot(selectedSpotForDetails.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                      visitedSpotIds.includes(selectedSpotForDetails.id)
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {visitedSpotIds.includes(selectedSpotForDetails.id)
                        ? '✓ আপনি ঘুরেছেন (Visited)'
                        : '+ আমি এই স্থানটি ঘুরেছি'}
                    </span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ঐতিহাসিক প্রেক্ষাপট ও বিস্তারিত বিবরণ:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bengali whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {selectedSpotForDetails.descriptionBn}
                  </p>
                </div>

                {selectedSpotForDetails.tags && selectedSpotForDetails.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {selectedSpotForDetails.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 font-bengali">
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(selectedSpotForDetails.nameBn + ' ' + selectedSpotForDetails.districtBn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Google Maps এ ডিরেকশন</span>
                </a>

                {selectedSpotForDetails.portalUrl && (
                  <a
                    href={selectedSpotForDetails.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition hidden sm:inline-flex"
                  >
                    সরকারি পোর্টাল
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/map?region=${selectedDistrict === 'rajshahi' ? 'rcc' : 'ru'}`}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Navigation className="h-3.5 w-3.5 text-amber-300" />
                  <span>ইন্টারঅ্যাক্টিভ ম্যাপ খুলুন</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedSpotForDetails(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
