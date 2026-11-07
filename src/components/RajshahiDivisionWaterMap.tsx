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
  Navigation2
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visitedCount = visitedSpotIds.length;
  const divisionPct = Math.min(100, Math.round((visitedCount / totalSpotsCount) * 100));

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

  // Update canvas poster whenever modal opens
  useEffect(() => {
    if (!isShareModalOpen) return;
    drawPoster();
  }, [isShareModalOpen, userName, divisionPct, visitedCount, selectedDistrict]);

  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#062817');
    bgGrad.addColorStop(0.5, '#021c10');
    bgGrad.addColorStop(1, '#010f08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Radial glow
    const rad = ctx.createRadialGradient(W / 2, 450, 50, W / 2, 450, 400);
    rad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // Frame
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // Brand Header
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RU INSIDERS • UNSEEN RAJSHAHI DIVISION', W / 2, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.fillText('রাজশাহী বিভাগ পর্যটন সনদ', W / 2, 160);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('OFFICIAL HERITAGE & TOURISM EXPLORER CITATION', W / 2, 200);

    // Divider
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 225);
    ctx.lineTo(700, 225);
    ctx.stroke();

    // Explorer Name
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('এই গৌরবময় সনদপত্রটি সসম্মানে প্রদান করা হলো:', W / 2, 280);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 44px sans-serif';
    ctx.fillText(userName || 'রাজশাহী অভিযাত্রী', W / 2, 335);

    // Rank Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(W / 2 - 250, 380, 500, 110, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${rank.badge} ${rank.title}`, W / 2, 430);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${rank.sub} • লেভেল ${rank.level}`, W / 2, 465);

    // Progress Bar on Canvas
    const barW = 600;
    const barH = 26;
    const barX = (W - barW) / 2;
    const barY = 530;

    ctx.fillStyle = '#1e293b';
    ctx.roundRect(barX, barY, barW, barH, 13);
    ctx.fill();

    const fillW = Math.max(26, (barW * divisionPct) / 100);
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
    fillGrad.addColorStop(0, '#10b981');
    fillGrad.addColorStop(1, '#34d399');
    ctx.fillStyle = fillGrad;
    ctx.roundRect(barX, barY, fillW, barH, 13);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`ভ্রমণ সম্পন্ন: ${visitedCount} / ${totalSpotsCount} স্থান (${divisionPct}% পূর্ণ)`, W / 2, 595);

    // 8 Districts Breakdown Grid on Poster
    const startY = 650;
    const colW = 180;
    const rowH = 90;
    const cols = 4;
    const gridStartX = (W - (cols * colW + (cols - 1) * 20)) / 2;

    RAJSHAHI_DIVISION_DISTRICTS.forEach((d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = gridStartX + col * (colW + 20);
      const y = startY + row * (rowH + 18);
      const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.roundRect(x, y, colW, rowH, 16);
      ctx.fill();
      ctx.strokeStyle = st.visited > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = st.visited > 0 ? 1.5 : 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.nameBn.replace(/^[০-৯.\s]+/, ''), x + 14, y + 32);

      ctx.fillStyle = st.visited > 0 ? '#34d399' : '#94a3b8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`${st.visited}/${st.total} টি স্থান (${st.pct}%)`, x + 14, y + 62);
    });

    // Verification Seal Bottom
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('★ RU INSIDERS OFFICIAL VERIFIED TRAVEL BADGE ★', W / 2, 1070);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText(`তারিখ: ${new Date().toLocaleDateString('bn-BD')} • মতিহার ক্যাম্পাস ও রাজশাহী বিভাগ`, W / 2, 1105);
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
            যেকোনো জেলায় ক্লিক করুন অথবা নিচের স্থানগুলোতে টিক দিন—পানির মতো ম্যাপটি নিচ থেকে উপরে পূর্ণ হতে থাকবে!
          </p>
        </div>

        {/* Share & Poster Action */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#1f7a44] hover:bg-[#166534] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Share2 className="h-4 w-4" />
          <span>পোস্টার তৈরি ও শেয়ার করুন</span>
          <Sparkles className="h-4 w-4 text-amber-300" />
        </button>
      </div>

      {/* Central Visual: Interactive SVG Vector Map + Unified District Selector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
        
        {/* Left Side (7 Cols): Unseen Bangladesh Style Interactive SVG Map with District Outlines & Smooth Water Fill */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[245/220] max-w-[560px] bg-[#f2eee3] rounded-[28px] p-2 sm:p-4 border-2 border-emerald-900/15 shadow-inner flex items-center justify-center overflow-hidden group">
            
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

            {/* Bottom-right Active District Info Badge on Map */}
            <div className="absolute bottom-2.5 sm:bottom-3.5 right-2.5 sm:right-3.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 flex items-center gap-2 shadow-lg text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bengali font-bold text-amber-300">
                {activeDistrictData.nameBn}: <span className="font-mono text-emerald-300">{activeStats.pct}%</span> পূর্ণ ({activeStats.visited}/{activeStats.total})
              </span>
            </div>

            {/* Map Click Instruction Hint */}
            <div className="absolute top-2.5 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 border border-stone-300 shadow-sm flex items-center gap-1.5">
              <Navigation2 className="h-3 w-3 text-emerald-700" />
              <span>ম্যাপে যেকোনো জেলায় ক্লিক করুন</span>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Integrated District Selector & Progress Dashboard (NO DUPLICATE BOX BELOW!) */}
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
                <span>অবশিষ্ট: {activeStats.total - activeStats.visited} টি</span>
              </div>
            </div>
          </div>

          {/* Unified 8 District Selector Grid (Replaces the duplicate box below!) */}
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
                    onClick={() => onSelectDistrict(d.id)}
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

      {/* Share / Poster Modal */}
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

            {/* Canvas Preview Container */}
            <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner flex items-center justify-center">
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
                <span>ডাউনলোড করুন</span>
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
