'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Navigation, ExternalLink, Compass, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  RAJSHAHI_DIVISION_DISTRICTS,
  RAJSHAHI_OFFICIAL_9_SPOTS,
  DIVISION_OTHER_DISTRICTS_HIGHLIGHTS,
  TouristSpot
} from '@/lib/touristSpots';

export default function TouristSpotsSection() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('rajshahi');

  const spotsToDisplay = React.useMemo(() => {
    if (selectedDistrict === 'rajshahi') {
      return RAJSHAHI_OFFICIAL_9_SPOTS;
    }
    return DIVISION_OTHER_DISTRICTS_HIGHLIGHTS.filter(
      (s) => s.districtId === selectedDistrict
    );
  }, [selectedDistrict]);

  const activeDistrictInfo = RAJSHAHI_DIVISION_DISTRICTS.find(
    (d) => d.id === selectedDistrict
  ) || RAJSHAHI_DIVISION_DISTRICTS[0];

  return (
    <section id="tourist-attractions" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Section Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>জাতীয় তথ্য বাতায়ন • rajshahidiv.gov.bd</span>
            <span className="text-white/40">|</span>
            <span className="text-amber-300 font-semibold">ঐতিহাসিক দর্শনীয় স্থান গাইড</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug font-bengali">
            রাজশাহী ও রাজশাহী বিভাগের ঐতিহ্যবাহী দর্শনীয় স্থান
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
            সরকারি পোর্টালে তালিকাভুক্ত রাজশাহীর ৯টি প্রধান স্পট এবং রাজশাহী বিভাগের ৮ জেলার জনপ্রিয় পর্যটন কেন্দ্র। যেকোনো স্থানে ক্লিক করলেই সরাসরি আমাদের ইন্টারঅ্যাক্টিভ ম্যাপে চলে যাবেন!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            href="/map"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>⛶ ইন্টারঅ্যাক্টিভ ম্যাপ খুলুন</span>
          </Link>

          <a
            href="https://rajshahidiv.gov.bd/pages/tourist-spot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-amber-300" />
            <span>বিভাগীয় সরকারি পোর্টাল</span>
          </a>
        </div>
      </div>

      {/* District Selection Table (রাজশাহী বিভাগের ৮টি জেলা তালিকা টেবিল) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Landmark className="h-4 w-4 text-emerald-600" />
            <span>জেলা নির্বাচন করুন (রাজশাহী বিভাগের ৮টি জেলা)</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            বর্তমানে সক্রিয়: {activeDistrictInfo.nameBn}
          </span>
        </div>

        {/* Structured Table-like Grid for Districts (2 rows x 4 columns on desktop / 2-4 cols responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
          {RAJSHAHI_DIVISION_DISTRICTS.map((dist, idx) => {
            const isActive = selectedDistrict === dist.id;
            return (
              <button
                key={dist.id}
                type="button"
                onClick={() => setSelectedDistrict(dist.id)}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 group ${
                  isActive
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/30 font-bold scale-[1.02]'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {String(idx + 1).padStart(2, '০')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {dist.spotCount}টি স্পট
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-bold tracking-tight truncate">
                  {dist.nameBn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tourist Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {spotsToDisplay.map((spot) => {
          const mapHref = spot.mapPlaceId
            ? `/map?place=${spot.mapPlaceId}&region=${spot.mapRegion || 'rajshahi'}`
            : `/map?region=${selectedDistrict === 'rajshahi' ? 'rajshahi' : 'rcc'}`;

          return (
            <div
              key={spot.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Spot Photo with Rank Badge */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={spot.imageUrl}
                    alt={spot.nameBn}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                  {/* Spot Rank Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm">
                      ক্রমিক নং {spot.rankNo}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 font-bold text-[10px] border border-white/20">
                      {spot.districtBn}
                    </span>
                  </div>

                  {/* Spot Title on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-black text-sm sm:text-base leading-snug drop-shadow-md">
                      {spot.nameBn}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium truncate">
                      {spot.nameEn}
                    </p>
                  </div>
                </div>

                {/* Spot Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">{spot.locationBn}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-bengali leading-relaxed line-clamp-3">
                    {spot.descriptionBn}
                  </p>

                  {/* Tags */}
                  {spot.tags && spot.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {spot.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={mapHref}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#1f7a44] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all group/btn"
                >
                  <Navigation className="h-3.5 w-3.5 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
                  <span>ইন্টারঅ্যাক্টিভ ম্যাপে দেখুন</span>
                </Link>

                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(spot.nameBn + ' ' + spot.districtBn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  title="Google Map-এ দেখুন"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
