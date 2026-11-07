'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Share2,
  Trophy,
  Sparkles,
  MapPin,
  X,
  Compass,
  Check,
  CheckCircle2,
  Navigation2,
  Eye,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { RAJSHAHI_DIVISION_DISTRICTS, TouristSpot } from '@/lib/touristSpots';
import { RAJSHAHI_DISTRICT_SVGS, RAJSHAHI_VIEWBOX, DistrictSvgData } from '@/lib/rajshahiDistrictsSvg';

interface RajshahiDivisionWaterMapProps {
  visitedSpotIds: string[];
  totalSpotsCount?: number;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  allSpots: TouristSpot[];
  onToggleVisited?: (spotId: string) => void;
  onOpenSpotDetails?: (spot: TouristSpot) => void;
}

export default function RajshahiDivisionWaterMap({
  visitedSpotIds,
  totalSpotsCount = 95,
  selectedDistrict,
  onSelectDistrict,
  allSpots,
  onToggleVisited,
  onOpenSpotDetails,
}: RajshahiDivisionWaterMapProps) {
  const [userName, setUserName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mapViewMode, setMapViewMode] = useState<'division' | 'ru_campus'>('division');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visitedCount = visitedSpotIds.length;
  const divisionPct = Math.min(100, Math.round((visitedCount / totalSpotsCount) * 100));

  // Listen to postMessage from embedded RU Campus Map
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UNSEEN_RU_PLACE_VISITED') {
        if (onToggleVisited && !visitedSpotIds.includes('spot-rj-ru')) {
          onToggleVisited('spot-rj-ru');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onToggleVisited, visitedSpotIds]);

  // Listen for custom trigger from Hero/CampusTourBanner to open RU campus map right here
  useEffect(() => {
    const handleOpenRU = () => {
      onSelectDistrict('rajshahi');
      setMapViewMode('ru_campus');
    };
    window.addEventListener('ru_open_campus_map', handleOpenRU);
    return () => window.removeEventListener('ru_open_campus_map', handleOpenRU);
  }, [onSelectDistrict]);

  // Per-district visited calculations
  const districtStats = useMemo(() => {
    const stats: Record<string, { total: number; visited: number; pct: number }> = {};
    RAJSHAHI_DIVISION_DISTRICTS.forEach((d) => {
      const distSpots = allSpots.filter((s) => s.districtId === d.id);
      const total = distSpots.length || d.spotCount;
      const visited = distSpots.filter((s) => visitedSpotIds.includes(s.id)).length;
      const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
      stats[d.id] = { total, visited, pct };
    });
    return stats;
  }, [allSpots, visitedSpotIds]);

  // Active district info
  const activeDistrictData = RAJSHAHI_DIVISION_DISTRICTS.find((d) => d.id === selectedDistrict) || RAJSHAHI_DIVISION_DISTRICTS[0];
  const activeStats = districtStats[selectedDistrict] || { total: activeDistrictData.spotCount, visited: 0, pct: 0 };

  // Spots belonging to the currently selected district
  const activeDistrictSpots = useMemo(() => {
    return allSpots.filter((s) => s.districtId === selectedDistrict);
  }, [allSpots, selectedDistrict]);

  // Explorer rank
  const getExplorerRank = (percentage: number) => {
    if (percentage === 0) return { title: 'শুরুর অভিযাত্রী', sub: 'New Explorer', level: 0, badge: '🌱' };
    if (percentage <= 15) return { title: 'পদ্মা ও মতিহার পদযাত্রী', sub: 'Padma Wanderer', level: 1, badge: '🌊' };
    if (percentage <= 35) return { title: 'বরেন্দ্র ও মহাস্থান বিজয়ী', sub: 'Heritage Explorer', level: 2, badge: '🏛️' };
    if (percentage <= 65) return { title: 'চলনবিল ও উত্তরবঙ্গ অভিযাত্রী', sub: 'Division Adventurer', level: 3, badge: '🛶' };
    if (percentage < 100) return { title: 'রাজশাহী মাস্টার ট্রাভেলার', sub: 'Master Traveller', level: 4, badge: '⭐' };
    return { title: 'রাজশাহী বিভাগীয় পর্যটন সুলতান', sub: 'Grand Sultan of Rajshahi', level: 5, badge: '👑' };
  };

  const rank = getExplorerRank(divisionPct);

  // Default user name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('ru_explorer_user_name') || 'রাজশাহী অভিযাত্রী';
      setUserName(savedName);
    }
  }, []);

  // Update canvas poster whenever modal opens
  useEffect(() => {
    if (!isShareModalOpen) return;
    drawPoster();
  }, [isShareModalOpen, userName, divisionPct, visitedCount, selectedDistrict, mapViewMode]);

  // =========================================================================
  // POSTER CANVAS DRAWING: INCLUDES THE REAL WATER-FILLED VECTOR MAP!
  // =========================================================================
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 1250;
    canvas.width = W;
    canvas.height = H;

    // 1. Royal Dark Emerald & Slate Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#062817');
    bgGrad.addColorStop(0.4, '#021c10');
    bgGrad.addColorStop(1, '#010f08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Radial Glow
    const rad = ctx.createRadialGradient(W / 2, 450, 50, W / 2, 450, 450);
    rad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // Gold Outer Border Frame
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 38, W - 76, H - 76);

    // Brand Header
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RU INSIDERS • UNSEEN RAJSHAHI DIVISION', W / 2, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.fillText('রাজশাহী বিভাগ পর্যটন সনদ', W / 2, 140);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('OFFICIAL HERITAGE & TOURISM EXPLORER CITATION', W / 2, 170);

    // Citated To
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('এই গৌরবময় সনদপত্রটি সসম্মানে প্রদান করা হলো:', W / 2, 230);

    // User Name
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 44px sans-serif';
    ctx.fillText(userName || 'রাজশাহী অভিযাত্রী', W / 2, 280);

    // =======================================================================
    // 2. THE REAL WATER-FILLED MAP DRAWN PROMINENTLY IN THE POSTER!
    // =======================================================================
    const mapCardX = 140;
    const mapCardY = 320;
    const mapCardW = 620;
    const mapCardH = 430;

    // Map Card Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.roundRect(mapCardX, mapCardY, mapCardW, mapCardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (mapViewMode === 'ru_campus') {
      // Draw RU Campus Citation Special Graphic
      ctx.fillStyle = '#064e3b';
      ctx.roundRect(mapCardX + 25, mapCardY + 25, mapCardW - 50, mapCardH - 50, 20);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('🏛️ রাজশাহী বিশ্ববিদ্যালয়', W / 2, mapCardY + 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('মতিহারের সবুজ চত্বর ও প্যারিস রোড', W / 2, mapCardY + 175);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('৪২টি টেরিটরি (একাডেমিক ভবন, হল, স্মৃতিস্তম্ভ ও মুক্তমঞ্চ)', W / 2, mapCardY + 225);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`রাবি ক্যাম্পাস ভ্রমণ রেকর্ড • RU Insiders Verified`, W / 2, mapCardY + 310);
    } else {
      // Draw Complete 8-District Vector Map using Path2D
      const viewBoxMinX = -5;
      const viewBoxMinY = 185;
      const viewBoxW = 245;
      const viewBoxH = 220;

      const scale = Math.min((mapCardW - 60) / viewBoxW, (mapCardH - 50) / viewBoxH);
      const mapOffsetX = mapCardX + (mapCardW - viewBoxW * scale) / 2;
      const mapOffsetY = mapCardY + (mapCardH - viewBoxH * scale) / 2;

      ctx.save();
      ctx.translate(mapOffsetX, mapOffsetY);
      ctx.scale(scale, scale);
      ctx.translate(-viewBoxMinX, -viewBoxMinY);

      RAJSHAHI_DISTRICT_SVGS.forEach((dist) => {
        try {
          const path = new Path2D(dist.d);
          const st = districtStats[dist.id] || { pct: 0 };
          const isDistSelected = dist.id === selectedDistrict;

          // Base Land Background Fill
          ctx.fillStyle = '#10522c';
          ctx.fill(path);

          // Water level clipping
          if (st.pct > 0) {
            ctx.save();
            ctx.clip(path);
            const waterH = (dist.bbox.h * st.pct) / 100;
            const waterTop = dist.bbox.maxY - waterH;
            ctx.fillStyle = '#059669';
            ctx.fillRect(dist.bbox.minX - 5, waterTop, dist.bbox.w + 10, waterH + 5);

            // Water crest highlight
            ctx.fillStyle = '#6ee7b7';
            ctx.fillRect(dist.bbox.minX - 5, waterTop, dist.bbox.w + 10, 2);
            ctx.restore();
          }

          // District Border
          ctx.strokeStyle = isDistSelected ? '#fbbf24' : '#34d399';
          ctx.lineWidth = isDistSelected ? 3 : 1.2;
          ctx.stroke(path);

          // Location Pin
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(dist.pin.x, dist.pin.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dist.pin.x, dist.pin.y, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Bengali Label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(dist.nameBn, dist.pin.x, dist.pin.y - 4.5);
        } catch (err) {}
      });

      ctx.restore();
    }

    // Map Footnote
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`রাজশাহী বিভাগ ভ্রমণ প্রগ্রেস: ${divisionPct}% সম্পন্ন (${visitedCount}/${totalSpotsCount} স্থান)`, W / 2, mapCardY + mapCardH + 30);

    // Progress Bar on poster
    const barX = 140;
    const barY = mapCardY + mapCardH + 45;
    const barW = 620;
    const barH = 14;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.roundRect(barX, barY, barW, barH, 7);
    ctx.fill();

    const fillW = Math.max(0, (barW * divisionPct) / 100);
    if (fillW > 0) {
      const fillGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      fillGrad.addColorStop(0, '#f59e0b');
      fillGrad.addColorStop(0.5, '#10b981');
      fillGrad.addColorStop(1, '#34d399');
      ctx.fillStyle = fillGrad;
      ctx.roundRect(barX, barY, fillW, barH, 7);
      ctx.fill();
    }

    // Rank Badge
    ctx.fillStyle = '#064e3b';
    ctx.roundRect(W / 2 - 200, barY + 30, 400, 52, 16);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${rank.badge} পদবী: ${rank.title}`, W / 2, barY + 64);

    // 8 Districts Stats Grid (2 rows x 4 cols)
    const gridStartY = barY + 105;
    const colW = 145;
    const rowH = 65;
    const startX = 140;

    RAJSHAHI_DIVISION_DISTRICTS.forEach((d, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = startX + col * (colW + 13);
      const y = gridStartY + row * (rowH + 10);
      const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };

      ctx.fillStyle = 'rgba(6, 78, 59, 0.45)';
      ctx.roundRect(x, y, colW, rowH, 12);
      ctx.fill();
      ctx.strokeStyle = st.visited > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(d.nameBn.replace(/^[০-৯]+\.\s*/, ''), x + colW / 2, y + 26);

      ctx.fillStyle = st.visited > 0 ? '#34d399' : '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(`${st.visited}/${st.total} (${st.pct}%)`, x + colW / 2, y + 48);
    });

    // Footer Signature & Verification
    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('RU INSIDERS • MOTIHAR CAMPUS & RAJSHAHI DIVISION', W / 2, H - 75);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('ruinsiders.vercel.app • Verified Heritage Travel Log', W / 2, H - 52);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ru-insiders-rajshahi-${divisionPct}pct.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const shareText = `আমি রাজশাহী বিভাগের ${divisionPct}% দর্শনীয় স্থান ভ্রমণ করেছি! (${visitedCount}/${totalSpotsCount} টি স্থান সম্পন্ন)। আমার পদবী: "${rank.title}"। আপনি কয়টি ঘুরেছেন? দেখুন RU Insiders-এ: https://ruinsiders.vercel.app`;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `rajshahi-travel-${divisionPct}pct.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'আমার রাজশাহী বিভাগ ভ্রমণ প্রগ্রেস',
              text: shareText,
              files: [file],
            });
          } else {
            await navigator.share({
              title: 'আমার রাজশাহী বিভাগ ভ্রমণ প্রগ্রেস',
              text: shareText,
              url: 'https://ruinsiders.vercel.app',
            });
          }
        });
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {}
  };

  return (
    <div className="w-full bg-[#faf8f2] rounded-[32px] p-3.5 sm:p-7 text-slate-900 shadow-xl border border-amber-900/10 space-y-5 relative overflow-hidden">
      
      {/* Decorative Ambient Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Navigation Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-black tracking-wider text-emerald-800 uppercase font-bengali">
              রাজশাহী বিভাগ ও রাবি ক্যাম্পাস ওয়াটার-ফিল ম্যাপ ট্র্যাকার
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-bengali tracking-tight flex items-center gap-2.5">
            <span>বিভাগীয় ভ্রমণ মাত্রা:</span>
            <span className="text-emerald-700 font-mono font-black">{divisionPct}%</span>
            <span className="text-xs sm:text-sm font-bold text-slate-500 font-bengali font-normal">
              ({visitedCount} / {totalSpotsCount} স্থান ঘোরা সম্পন্ন)
            </span>
          </h3>
          <p className="text-xs text-slate-600 font-bengali">
            যেকোনো জেলায় ক্লিক করুন—পাশের তালিকায় সেই জেলার স্পটগুলো চলে আসবে এবং ভ্রমণ করা স্থানে টিক দিলে ম্যাপে পানি ভরে উঠবে!
          </p>
        </div>

        {/* View Switcher Pills & Share Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {mapViewMode === 'ru_campus' && (
            <button
              type="button"
              onClick={() => setMapViewMode('division')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-slate-800 font-black text-xs border border-stone-300 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>← জেলা ম্যাপে ফিরুন</span>
            </button>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#1f7a44] hover:bg-[#166534] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Share2 className="h-4 w-4" />
            <span>পোস্টার ও শেয়ার</span>
            <Sparkles className="h-4 w-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* 8-DISTRICTS SELECTOR TABS (Across the top for instant 1-click access) */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 font-bengali uppercase tracking-wide flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-emerald-700" />
            <span>বিভাগের ৮টি জেলা থেকে নির্বাচন করুন:</span>
          </span>
          <span className="text-[10px] text-slate-500 font-bold font-bengali">
            (ক্লিক করলে ম্যাপ ও স্থান উভয়ই পরিবর্তিত হবে)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {RAJSHAHI_DIVISION_DISTRICTS.map((d) => {
            const isActive = selectedDistrict === d.id && mapViewMode === 'division';
            const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  onSelectDistrict(d.id);
                  if (mapViewMode !== 'division') setMapViewMode('division');
                }}
                className={`p-2 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1 group cursor-pointer ${
                  isActive
                    ? 'bg-[#15803d] text-white border-emerald-500 shadow-md ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 text-slate-800 border-stone-200/90 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-black font-bengali truncate ${isActive ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                    {d.nameBn}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-emerald-100' : 'text-slate-500'}>
                    {st.visited}/{st.total}
                  </span>
                  <span className={`font-bold ${isActive ? 'text-amber-300' : st.visited > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {st.pct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTRAL 2-COLUMN VIEW: MAP (LEFT) & VERTICAL SPOTS LIST (RIGHT) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Side (6 Cols): Clean Vector SVG Water Map (Standard Across All Districts) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[245/220] min-h-[380px] sm:min-h-[440px] bg-[#f2eee3] rounded-[28px] p-2 sm:p-4 border-2 border-emerald-900/15 shadow-inner flex items-center justify-center overflow-hidden group">
            
            {/* VIEW: RU CAMPUS MAP (If opened) */}
            {mapViewMode === 'ru_campus' ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#f6f4ec]">
                <iframe
                  src="/unseen-ru.html?region=ru&embed=true"
                  title="Rajshahi University 42 Territories Map"
                  className="w-full h-full min-h-[420px] border-0 select-none rounded-2xl"
                  allow="clipboard-write; fullscreen; web-share"
                />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-400/40 shadow-md flex items-center gap-1.5 z-20 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>রাবি ক্যাম্পাস: ৪২টি অঞ্চল (ম্যাপে ক্লিক করে এক্সপ্লোর করুন)</span>
                </div>

                {/* Bottom Quick Navigation */}
                <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMapViewMode('division')}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-black text-[10px] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 transition-all"
                  >
                    <span>← জেলা ম্যাপে ফিরুন</span>
                  </button>
                </div>
              </div>

            ) : (
              /* VIEW: UNIFIED CLEAN VECTOR DISTRICT WATER MAP (Exact standard design for all districts!) */
              <svg
                viewBox={RAJSHAHI_VIEWBOX}
                className="w-full h-full object-contain select-none"
              >
                <defs>
                  {/* Glowing drop shadow filter for active selected district border */}
                  <filter id="active-district-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#facc15" floodOpacity="0.95" />
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.8" />
                  </filter>

                  {/* Per-district dynamic water fill clips (rising from bottom of each district) */}
                  {RAJSHAHI_DISTRICT_SVGS.map((dist) => {
                    const st = districtStats[dist.id] || { pct: 0 };
                    const waterHeight = (dist.bbox.h * st.pct) / 100;
                    const waterY = dist.bbox.maxY - waterHeight;

                    return (
                      <clipPath key={`clip-${dist.id}`} id={`water-clip-${dist.id}`}>
                        <rect
                          x={dist.bbox.minX - 5}
                          y={waterY}
                          width={dist.bbox.w + 10}
                          height={waterHeight + 10}
                          className="transition-all duration-700 ease-out"
                        />
                      </clipPath>
                    );
                  })}
                </defs>

                {/* 1. Base District Territories with Borders and Water */}
                {RAJSHAHI_DISTRICT_SVGS.map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  const isHovered = hoveredDistrict === dist.id;
                  const st = districtStats[dist.id] || { pct: 0, visited: 0, total: 0 };

                  return (
                    <g
                      key={dist.id}
                      onClick={() => onSelectDistrict(dist.id)}
                      onMouseEnter={() => setHoveredDistrict(dist.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className="cursor-pointer transition-transform duration-200"
                    >
                      {/* Land Silhouette */}
                      <path
                        d={dist.d}
                        fill={isSelected ? '#0e4a2c' : isHovered ? '#125c37' : '#10522c'}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {/* Rising Liquid Green Water Fill */}
                      {st.pct > 0 && (
                        <path
                          d={dist.d}
                          fill="#059669"
                          clipPath={`url(#water-clip-${dist.id})`}
                          opacity="0.92"
                          className="transition-all duration-700 ease-out"
                        />
                      )}

                      {/* Distinct District Borders */}
                      <path
                        d={dist.d}
                        fill="none"
                        stroke={isSelected ? '#facc15' : isHovered ? '#6ee7b7' : '#ffffff'}
                        strokeWidth={isSelected ? '2.4' : '1.2'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {/* Glowing Golden Stroke for Active District */}
                      {isSelected && (
                        <path
                          d={dist.d}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="3.2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          filter="url(#active-district-glow)"
                          className="animate-pulse"
                        />
                      )}

                      {/* Ripple Line on top of water */}
                      {st.pct > 0 && (
                        <line
                          x1={dist.bbox.minX}
                          x2={dist.bbox.maxX}
                          y1={dist.bbox.maxY - (dist.bbox.h * st.pct) / 100}
                          y2={dist.bbox.maxY - (dist.bbox.h * st.pct) / 100}
                          stroke="#a7f3d0"
                          strokeWidth="1.2"
                          strokeDasharray="2,2"
                          clipPath={`url(#water-clip-${dist.id})`}
                        />
                      )}

                      {/* District Pin Center Core */}
                      <circle
                        cx={dist.pin.x}
                        cy={dist.pin.y}
                        r="3.5"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1"
                        className="shadow"
                      />

                      {/* Center Dot */}
                      <circle
                        cx={dist.pin.x}
                        cy={dist.pin.y}
                        r="1.1"
                        fill="#ffffff"
                      />

                      {/* Bengali District Name Text */}
                      <text
                        x={dist.pin.x}
                        y={dist.pin.y - 4.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        stroke="#062817"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        className="pointer-events-none select-none tracking-tight font-bengali"
                      >
                        {dist.nameBn}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Floating Selection Banner on Map */}
            {mapViewMode === 'division' && (
              <div className="absolute bottom-2.5 inset-x-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-400/40 shadow-lg flex items-center justify-between pointer-events-none">
                <span className="flex items-center gap-1.5 font-bengali">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ম্যাপে নির্বাচিত: {activeDistrictData.nameBn}</span>
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-bold">
                  ভ্রমণ: {activeStats.pct}% ({activeStats.visited}/{activeStats.total})
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Right Side (6 Cols): Active District Header & VERTICAL SPOTS LIST */}
        <div className="lg:col-span-6 space-y-3.5">
          
          {/* Active District Spotlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border border-emerald-700/60 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5 font-bengali">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>বর্তমানে নির্বাচিত জেলা</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {activeDistrictSpots.length}টি দর্শনীয় স্থান
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-black text-white font-bengali">
                {activeDistrictData.nameBn}
              </div>
              <div className="text-sm font-mono font-bold text-amber-300">
                {activeStats.visited} / {activeStats.total} টি স্থান ঘোরা সম্পন্ন
              </div>
            </div>

            {/* District Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${activeStats.pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-emerald-200 font-mono">
                <span>জেলা ভ্রমণ পূর্ণতা: {activeStats.pct}%</span>
                <span>অবশিষ্ট: {activeStats.total - activeStats.visited} টি স্থান</span>
              </div>
            </div>

            {/* Special shortcut for Rajshahi University if Rajshahi is active */}
            {selectedDistrict === 'rajshahi' && (
              <div className="pt-2 border-t border-emerald-700/50 flex items-center justify-between">
                <span className="text-[11px] text-emerald-200 font-bengali">
                  রাজশাহী বিশ্ববিদ্যালয় (রাবি ক্যাম্পাস):
                </span>
                <button
                  type="button"
                  onClick={() => setMapViewMode('ru_campus')}
                  className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] transition-all flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                  <span>🏫 রাবি ক্যাম্পাস ম্যাপ (৪২ স্পট)</span>
                </button>
              </div>
            )}
          </div>

          {/* VERTICAL SPOTS LIST ("nicha nicha akta akta kore and standard vabe koro") */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {activeDistrictSpots.map((spot) => {
              const isVisited = visitedSpotIds.includes(spot.id);
              const spotImages = Array.isArray(spot.images) && spot.images.length > 0
                ? spot.images
                : (spot.imageUrl ? [spot.imageUrl] : []);

              return (
                <div
                  key={spot.id}
                  className={`p-3 sm:p-3.5 rounded-2xl bg-white border transition-all duration-200 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between group shadow-sm hover:shadow-md ${
                    isVisited
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90 hover:border-emerald-400/80'
                  }`}
                >
                  {/* Left: Thumbnail Image with Zoom Preview */}
                  <div
                    onClick={() => onOpenSpotDetails && onOpenSpotDetails(spot)}
                    className="relative w-full sm:w-28 h-28 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer shadow-inner"
                  >
                    <img
                      src={spotImages[0] || spot.imageUrl}
                      alt={spot.nameBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] font-bengali shadow">
                        {spot.rankNo}
                      </span>
                    </div>
                    {isVisited && (
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-600 text-white shadow">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Center: Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4
                      onClick={() => onOpenSpotDetails && onOpenSpotDetails(spot)}
                      className="text-xs sm:text-sm font-black text-slate-900 font-bengali line-clamp-1 group-hover:text-emerald-700 cursor-pointer"
                    >
                      {spot.nameBn}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bengali">
                      <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                      <span className="truncate">{spot.locationBn}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-bengali line-clamp-2 leading-relaxed">
                      {spot.descriptionBn}
                    </p>

                    {/* Action Row */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleVisited && onToggleVisited(spot.id)}
                        className={`py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all font-bengali ${
                          isVisited
                            ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isVisited ? 'ঘুরেছি (✔ সম্পন্ন)' : 'আমি এই জায়গা ঘুরেছি (টিক দিন)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenSpotDetails && onOpenSpotDetails(spot)}
                        className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 font-bengali shadow-sm transition"
                      >
                        <Eye className="h-3 w-3 text-amber-300" />
                        <span>বিস্তারিত ও ছবি</span>
                      </button>

                      {spot.id === 'spot-rj-ru' && (
                        <button
                          type="button"
                          onClick={() => setMapViewMode('ru_campus')}
                          className="py-1.5 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 font-bengali shadow-sm transition"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>ক্যাম্পাস ম্যাপ</span>
                        </button>
                      )}

                      <a
                        href={spot.portalUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.nameBn + ' ' + spot.locationBn)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] flex items-center gap-1 transition"
                        title="গুগল ম্যাপে লোকেশন দেখুন"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="hidden sm:inline">ম্যাপ</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* SHARE / POSTER MODAL (Full citation with water map) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black font-bengali text-white">
                  রাজশাহী বিভাগ ভ্রমণ সনদ ও পোস্টার
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Poster Canvas Preview */}
            <div className="relative w-full aspect-[900/1250] bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Edit Name Bar */}
            <div className="space-y-1">
              <label className="text-xs text-emerald-300 font-bold font-bengali">
                সনদে আপনার নাম পরিবর্তন করুন:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  try {
                    localStorage.setItem('ru_explorer_user_name', e.target.value);
                  } catch (err) {}
                }}
                placeholder="আপনার নাম লিখুন..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-500/40 text-white font-bengali text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>পোস্টার ডাউনলোড</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে!' : 'বন্ধুদের সাথে শেয়ার'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
