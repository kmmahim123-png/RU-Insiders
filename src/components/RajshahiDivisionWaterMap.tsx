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
  Layers,
  ZoomIn
} from 'lucide-react';
import { RAJSHAHI_DIVISION_DISTRICTS, TouristSpot } from '@/lib/touristSpots';
import { RAJSHAHI_DISTRICT_SVGS, RAJSHAHI_VIEWBOX, DistrictSvgData } from '@/lib/rajshahiDistrictsSvg';

interface RajshahiDivisionWaterMapProps {
  visitedSpotIds: string[];
  totalSpotsCount?: number;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  allSpots: TouristSpot[];
}

export default function RajshahiDivisionWaterMap({
  visitedSpotIds,
  totalSpotsCount = 95,
  selectedDistrict,
  onSelectDistrict,
  allSpots,
}: RajshahiDivisionWaterMapProps) {
  const [userName, setUserName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mapViewMode, setMapViewMode] = useState<'division' | 'rajshahi_detailed'>('division');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detailedMapImgRef = useRef<HTMLImageElement | null>(null);

  const visitedCount = visitedSpotIds.length;
  const divisionPct = Math.min(100, Math.round((visitedCount / totalSpotsCount) * 100));

  // Pre-load detailed Rajshahi image for poster and fast rendering
  useEffect(() => {
    const img = new Image();
    img.src = '/campus/rajshahi-district-detailed-map.jpg';
    img.onload = () => {
      detailedMapImgRef.current = img;
    };
  }, []);

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
  const rajshahiStats = districtStats['rajshahi'] || { total: 9, visited: 0, pct: 0 };

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

  // Default user name from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('ru_explorer_user_name') || 'রাজশাহী অভিযাত্রী';
      setUserName(savedName);
    }
  }, []);

  // Update canvas poster whenever modal opens, name changes, or percentage changes
  useEffect(() => {
    if (!isShareModalOpen) return;
    drawPoster();
  }, [isShareModalOpen, userName, divisionPct, visitedCount, selectedDistrict, mapViewMode]);

  // =========================================================================
  // POSTER CANVAS DRAWING: INCLUDES THE REAL WATER-FILLED VECTOR / DETAILED MAP!
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
    ctx.font = '900 42px sans-serif';
    ctx.fillText('রাজশাহী বিভাগ পর্যটন সনদ', W / 2, 135);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('OFFICIAL HERITAGE & TOURISM EXPLORER CITATION', W / 2, 168);

    // Divider
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(220, 190);
    ctx.lineTo(680, 190);
    ctx.stroke();

    // Explorer Name & Citation
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText('এই গৌরবময় সনদপত্রটি সসম্মানে প্রদান করা হলো:', W / 2, 225);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 38px sans-serif';
    ctx.fillText(userName || 'রাজশাহী অভিযাত্রী', W / 2, 270);

    // Rank Pill
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.roundRect(W / 2 - 220, 295, 440, 46, 23);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${rank.badge} ${rank.title} • ${rank.sub}`, W / 2, 325);

    // =======================================================================
    // 2. THE REAL WATER-FILLED MAP DRAWN PROMINENTLY IN THE POSTER!
    // =======================================================================
    const mapCardX = 140;
    const mapCardY = 360;
    const mapCardW = 620;
    const mapCardH = 430;

    // Map Card Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.roundRect(mapCardX, mapCardY, mapCardW, mapCardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (mapViewMode === 'rajshahi_detailed' && detailedMapImgRef.current) {
      // Draw Detailed Rajshahi Separation Map with Water Fill
      const img = detailedMapImgRef.current;
      const innerW = 400;
      const innerH = 400;
      const innerX = mapCardX + (mapCardW - innerW) / 2;
      const innerY = mapCardY + 15;

      ctx.save();
      ctx.roundRect(innerX, innerY, innerW, innerH, 16);
      ctx.clip();
      ctx.drawImage(img, innerX, innerY, innerW, innerH);

      // Liquid water fill overlay for Rajshahi
      const rPct = rajshahiStats.pct;
      if (rPct > 0) {
        const fillHeight = (innerH * rPct) / 100;
        const fillY = innerY + innerH - fillHeight;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fillRect(innerX, fillY, innerW, fillHeight);
      }
      ctx.restore();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`রাজশাহী জেলা বিস্তারিত এলাকা: ${rajshahiStats.pct}% ভ্রমণ সম্পন্ন (${rajshahiStats.visited}/${rajshahiStats.total} স্পট)`, W / 2, mapCardY + mapCardH - 15);
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

      // Draw each of the 8 districts with water fill and borders
      RAJSHAHI_DISTRICT_SVGS.forEach((dist) => {
        try {
          const path = new Path2D(dist.d);
          const isSelected = selectedDistrict === dist.id;
          const st = districtStats[dist.id] || { pct: 0 };

          // Base District Green
          ctx.fillStyle = isSelected ? '#14532d' : '#1f7a44';
          ctx.fill(path);

          // Liquid Water Fill inside this district
          if (st.pct > 0) {
            ctx.save();
            ctx.clip(path);
            const waterHeight = (dist.bbox.h * st.pct) / 100;
            const waterY = dist.bbox.maxY - waterHeight;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(dist.bbox.minX - 5, waterY, dist.bbox.w + 10, waterHeight + 5);
            ctx.restore();
          }

          // Border stroke
          ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
          ctx.lineWidth = (isSelected ? 2.6 : 0.8) / scale;
          ctx.stroke(path);
        } catch (e) {}
      });

      ctx.restore();

      // Draw Pins & Bengali Text on Canvas
      RAJSHAHI_DISTRICT_SVGS.forEach((dist) => {
        const pinCanvasX = mapOffsetX + (dist.pin.x - viewBoxMinX) * scale;
        const pinCanvasY = mapOffsetY + (dist.pin.y - viewBoxMinY) * scale;
        const isSelected = selectedDistrict === dist.id;

        // Red Pin
        ctx.beginPath();
        ctx.arc(pinCanvasX, pinCanvasY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pinCanvasX, pinCanvasY, 9, 0, Math.PI * 2);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Bengali Label
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 3.5;
        ctx.strokeText(dist.nameBn, pinCanvasX, pinCanvasY - 11);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dist.nameBn, pinCanvasX, pinCanvasY - 11);
      });
    }

    // 3. Overall Division Progress Bar
    const barW = 600;
    const barH = 24;
    const barX = (W - barW) / 2;
    const barY = 825;

    ctx.fillStyle = '#1e293b';
    ctx.roundRect(barX, barY, barW, barH, 12);
    ctx.fill();

    const fillW = Math.max(24, (barW * divisionPct) / 100);
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
    fillGrad.addColorStop(0, '#10b981');
    fillGrad.addColorStop(1, '#34d399');
    ctx.fillStyle = fillGrad;
    ctx.roundRect(barX, barY, fillW, barH, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`বিভাগীয় ভ্রমণ সম্পন্ন: ${visitedCount} / ${totalSpotsCount} স্থান (${divisionPct}% পূর্ণ)`, W / 2, 880);

    // 4. 8 Districts Breakdown Grid on Poster
    const startY = 910;
    const colW = 180;
    const rowH = 80;
    const cols = 4;
    const gridStartX = (W - (cols * colW + (cols - 1) * 16)) / 2;

    RAJSHAHI_DIVISION_DISTRICTS.forEach((d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = gridStartX + col * (colW + 16);
      const y = startY + row * (rowH + 14);
      const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };
      const isSel = selectedDistrict === d.id;

      ctx.fillStyle = isSel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      ctx.roundRect(x, y, colW, rowH, 14);
      ctx.fill();
      ctx.strokeStyle = isSel ? '#fbbf24' : st.visited > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.stroke();

      ctx.fillStyle = isSel ? '#fbbf24' : '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.nameBn.replace(/^[০-৯.\s]+/, ''), x + 14, y + 30);

      ctx.fillStyle = st.visited > 0 ? '#34d399' : '#94a3b8';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${st.visited}/${st.total} টি স্থান (${st.pct}%)`, x + 14, y + 58);
    });

    // Verification Seal Bottom
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('★ RU INSIDERS OFFICIAL VERIFIED HERITAGE BADGE ★', W / 2, 1150);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText(`তারিখ: ${new Date().toLocaleDateString('bn-BD')} • মতিহার ক্যাম্পাস ও রাজশাহী বিভাগ`, W / 2, 1180);
  };

  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `rajshahi-explorer-${userName || 'traveler'}-${divisionPct}pct.png`;
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
      } catch (e) {
        console.warn('Share error:', e);
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {}
  };

  return (
    <div className="w-full bg-[#faf8f2] rounded-[32px] p-3.5 sm:p-7 text-slate-900 shadow-xl border border-amber-900/10 space-y-5 relative overflow-hidden">
      
      {/* Decorative Warm Topographic Ambient Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Navigation Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-black tracking-wider text-emerald-800 uppercase font-bengali">
              রাজশাহী বিভাগ ওয়াটার-ফিল ম্যাপ ট্র্যাকার
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
            ম্যাপে যেকোনো জেলায় টাচ করুন অথবা নিচের স্থানগুলোতে টিক দিন—পানির মতো ম্যাপটি নিচ থেকে উপরে পূর্ণ হতে থাকবে!
          </p>
        </div>

        {/* View Mode Toggle & Share Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle between Division Map & Detailed Rajshahi Separation Map */}
          <div className="flex items-center bg-stone-200/80 p-1 rounded-2xl border border-stone-300">
            <button
              type="button"
              onClick={() => setMapViewMode('division')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                mapViewMode === 'division'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>সমগ্র বিভাগ (৮ জেলা)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMapViewMode('rajshahi_detailed');
                onSelectDistrict('rajshahi');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                mapViewMode === 'rajshahi_detailed'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ZoomIn className="h-3.5 w-3.5" />
              <span>রাজশাহী জেলা বিস্তারিত</span>
            </button>
          </div>

          {/* Share & Poster Action */}
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

      {/* Central Visual: Interactive Map + Unified District Selector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
        
        {/* Left Side (7 Cols): Dynamic Map (Division 8-Districts or Detailed Rajshahi Separations) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[245/220] max-w-[560px] bg-[#f2eee3] rounded-[28px] p-2 sm:p-4 border-2 border-emerald-900/15 shadow-inner flex items-center justify-center overflow-hidden group">
            
            {mapViewMode === 'rajshahi_detailed' ? (
              // =============================================================
              // DETAILED RAJSHAHI DISTRICT SEPARATION MAP (WITH WATER FILL!)
              // =============================================================
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                {/* Background Detailed Map Image with All 22 Areas Labeled */}
                <img
                  src="/campus/rajshahi-district-detailed-map.jpg"
                  alt="রাজশাহী জেলা বিস্তারিত এলাকা ও সেপারেশন ম্যাপ"
                  className="w-full h-full object-contain filter contrast-105"
                />

                {/* Animated Rising Liquid Water Level for Rajshahi */}
                {rajshahiStats.pct > 0 && (
                  <div
                    className="absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-700 bg-gradient-to-t from-emerald-500/50 via-teal-400/35 to-transparent"
                    style={{ height: `${rajshahiStats.pct}%` }}
                  >
                    <div className="w-full h-2 bg-emerald-300/60 shadow-[0_0_12px_#34d399]" />
                  </div>
                )}

                {/* Badge top-left */}
                <div className="absolute top-2.5 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-400/40 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>রাজশাহী জেলা বিস্তারিত সেপারেশন ভিউ</span>
                </div>

                {/* Switch back to division map button */}
                <button
                  type="button"
                  onClick={() => setMapViewMode('division')}
                  className="absolute bottom-2.5 left-3 bg-white/95 hover:bg-white text-slate-800 font-black text-[10px] px-3 py-1.5 rounded-full border border-stone-300 shadow-md flex items-center gap-1 transition-all"
                >
                  <span>← সমগ্র বিভাগ ম্যাপে ফিরুন</span>
                </button>
              </div>
            ) : (
              // =============================================================
              // UNSEEN BANGLADESH STYLE DIVISION MAP (8 DISTRICTS WITH WATER)
              // =============================================================
              <svg
                viewBox={RAJSHAHI_VIEWBOX}
                className="w-full h-full object-contain select-none"
              >
                <defs>
                  {/* Glowing drop shadow filter for active selected district border */}
                  <filter id="active-district-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#facc15" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#10b981" floodOpacity="0.7" />
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
                          height={waterHeight + 5}
                          style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                      </clipPath>
                    );
                  })}
                </defs>

                {/* 1. Base District Shapes (Dry / Unvisited layer) */}
                {RAJSHAHI_DISTRICT_SVGS.map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  const isHovered = hoveredDistrict === dist.id;
                  const st = districtStats[dist.id] || { pct: 0, visited: 0, total: 0 };

                  return (
                    <g key={`base-${dist.id}`} className="cursor-pointer" onClick={() => onSelectDistrict(dist.id)}>
                      {/* Unvisited base green background */}
                      <path
                        d={dist.d}
                        fill={isSelected ? '#14532d' : isHovered ? '#166534' : '#1f7a44'}
                        stroke="rgba(255, 255, 255, 0.85)"
                        strokeWidth="0.8"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="transition-colors duration-200"
                      />

                      {/* 2. Water-filled Layer (Clipped to visited percentage of THIS district) */}
                      {st.pct > 0 && (
                        <path
                          d={dist.d}
                          fill={isSelected ? '#059669' : '#10b981'}
                          clipPath={`url(#water-clip-${dist.id})`}
                          stroke="none"
                          className="transition-all duration-700"
                          style={{ filter: 'brightness(1.15) saturate(1.2)' }}
                        />
                      )}

                      {/* 3. Highlighted Boundary Stroke (Glows brightly when district is selected) */}
                      {isSelected && (
                        <path
                          d={dist.d}
                          fill="none"
                          stroke="#facc15"
                          strokeWidth="2.4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          filter="url(#active-district-glow)"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}

                {/* 2. District Pins, Ripple Rings & Bengali Typography Labels */}
                {RAJSHAHI_DISTRICT_SVGS.map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  const st = districtStats[dist.id] || { pct: 0, visited: 0, total: 0 };

                  return (
                    <g
                      key={`pin-${dist.id}`}
                      className="cursor-pointer pointer-events-none select-none"
                    >
                      {/* Active Ripple Animation */}
                      {isSelected && (
                        <circle
                          cx={dist.pin.x}
                          cy={dist.pin.y}
                          r="6"
                          fill="none"
                          stroke="#facc15"
                          strokeWidth="1.2"
                          opacity="0.8"
                        />
                      )}

                      {/* Red Circular Location Pin with White Rim */}
                      <circle
                        cx={dist.pin.x}
                        cy={dist.pin.y}
                        r="3.2"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1"
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
                        x={dist.label.x}
                        y={dist.label.y}
                        textAnchor="middle"
                        fill="#ffffff"
                        stroke="#052e16"
                        strokeWidth="2.2"
                        paintOrder="stroke fill"
                        fontSize="6.8"
                        fontWeight="900"
                        className="font-bengali"
                        style={{ letterSpacing: '0.2px' }}
                      >
                        {dist.nameBn}
                      </text>

                      {/* Visited Progress Tag if Visited */}
                      {st.visited > 0 && (
                        <text
                          x={dist.pin.x}
                          y={dist.pin.y + 7.5}
                          textAnchor="middle"
                          fill="#fef08a"
                          stroke="#064e3b"
                          strokeWidth="1.6"
                          paintOrder="stroke fill"
                          fontSize="4.8"
                          fontWeight="900"
                          className="font-mono"
                        >
                          {st.pct}%
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Bottom-right Active District Info Badge on Map */}
            <div className="absolute bottom-2.5 sm:bottom-3.5 right-2.5 sm:right-3.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 flex items-center gap-2 shadow-lg text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bengali font-bold text-amber-300">
                {activeDistrictData.nameBn}: <span className="font-mono text-emerald-300">{activeStats.pct}%</span> পূর্ণ ({activeStats.visited}/{activeStats.total})
              </span>
            </div>

            {/* If in Division mode, show quick zoom to Rajshahi separation banner */}
            {mapViewMode === 'division' && selectedDistrict === 'rajshahi' && (
              <button
                type="button"
                onClick={() => setMapViewMode('rajshahi_detailed')}
                className="absolute top-2.5 left-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-full border border-amber-500 shadow-md flex items-center gap-1.5 transition-all animate-bounce"
              >
                <ZoomIn className="h-3 w-3" />
                <span>রাজশাহী জেলা বিস্তারিত এলাকা দেখুন ➔</span>
              </button>
            )}

            {/* Map Click Instruction Hint */}
            {mapViewMode === 'division' && selectedDistrict !== 'rajshahi' && (
              <div className="absolute top-2.5 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 border border-stone-300 shadow-sm flex items-center gap-1.5">
                <Navigation2 className="h-3 w-3 text-emerald-700" />
                <span>ম্যাপে যেকোনো জেলায় ক্লিক করুন</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (5 Cols): Integrated District Selector & Progress Dashboard */}
        <div className="lg:col-span-5 space-y-3.5">
          
          {/* Active District Spotlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border border-emerald-700/60 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5 font-bengali">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>বর্তমানে নির্বাচিত জেলা</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {activeDistrictData.nameBn}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-lg sm:text-xl font-black text-white font-bengali">
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

            {/* Special shortcut for Rajshahi District Separations */}
            {selectedDistrict === 'rajshahi' && (
              <div className="pt-1 border-t border-emerald-700/50 flex items-center justify-between">
                <span className="text-[11px] text-emerald-200 font-bengali">
                  রাজশাহী জেলার অভ্যন্তরীণ ২২টি অঞ্চল চিহ্নিত ম্যাপ:
                </span>
                <button
                  type="button"
                  onClick={() => setMapViewMode(mapViewMode === 'division' ? 'rajshahi_detailed' : 'division')}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] transition-all flex items-center gap-1"
                >
                  <Layers className="h-3 w-3" />
                  <span>{mapViewMode === 'rajshahi_detailed' ? 'বিভাগীয় ম্যাপ' : 'বিস্তারিত সেপারেশন ম্যাপ'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Unified 8 District Selector Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 font-bengali uppercase tracking-wide">
                বিভাগের ৮ জেলা থেকে নির্বাচন করুন:
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                (ক্লিক করলে ম্যাপ ও স্থান পরিবর্তিত হবে)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {RAJSHAHI_DIVISION_DISTRICTS.map((d, idx) => {
                const isActive = selectedDistrict === d.id;
                const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };

                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onSelectDistrict(d.id);
                      if (d.id !== 'rajshahi' && mapViewMode === 'rajshahi_detailed') {
                        setMapViewMode('division');
                      }
                    }}
                    onMouseEnter={() => setHoveredDistrict(d.id)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1 group ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/40 scale-[1.02] font-bold'
                        : 'bg-white hover:bg-emerald-50/70 text-slate-800 border-stone-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {String(idx + 1).padStart(2, '০')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : st.visited > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                            : 'bg-stone-100 text-slate-600 border border-stone-200'
                        }`}
                      >
                        {st.visited > 0 ? `${st.visited}/${st.total} টি` : `${st.total}টি স্পট`}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-black tracking-tight truncate font-bengali">
                      {d.nameBn}
                    </div>

                    {/* Progress Fill Indicator Line */}
                    <div className={`w-full h-1 rounded-full overflow-hidden mt-0.5 ${isActive ? 'bg-black/30' : 'bg-slate-100'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isActive ? 'bg-amber-300' : 'bg-emerald-600'}`}
                        style={{ width: `${st.pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Division Rank Badge Footer */}
          <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">{rank.badge}</span>
              <div>
                <span className="font-bold text-slate-900 font-bengali block leading-tight">{rank.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{rank.sub}</span>
              </div>
            </div>
            <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              মোট: {divisionPct}%
            </span>
          </div>

        </div>

      </div>

      {/* Share / Poster Modal (WITH FULL MAP PREVIEW!) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h4 className="text-base sm:text-lg font-black text-white font-bengali">
                  রাজশাহী বিভাগ ভ্রমণ সনদ ও পোস্টার
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Poster Canvas Preview (Contains the actual water-filled map!) */}
            <div className="relative w-full aspect-[900/1250] bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Editable Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-300 font-bengali">
                পোস্টারে প্রদর্শিত আপনার নাম:
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
                placeholder="যেমন: সাকিব আল হাসান"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-emerald-500/30 text-white text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPoster}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>পোস্টার ডাউনলোড করুন</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-950" /> : <Sparkles className="h-4 w-4 text-slate-950" />}
                <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
