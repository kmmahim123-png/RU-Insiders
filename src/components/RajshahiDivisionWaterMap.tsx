'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Download,
  CheckCircle2,
  Trophy,
  Sparkles,
  MapPin,
  X,
  Compass,
  Copy,
  Check,
} from 'lucide-react';
import { RAJSHAHI_DIVISION_DISTRICTS } from '@/lib/touristSpots';

interface RajshahiDivisionWaterMapProps {
  visitedSpotIds: string[];
  totalSpotsCount?: number;
  onSelectDistrict?: (districtId: string) => void;
}

export default function RajshahiDivisionWaterMap({
  visitedSpotIds,
  totalSpotsCount = 95,
  onSelectDistrict,
}: RajshahiDivisionWaterMapProps) {
  const [userName, setUserName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visitedCount = visitedSpotIds.length;
  const pct = Math.min(100, Math.round((visitedCount / totalSpotsCount) * 100));

  // Determine explorer rank based on water percentage
  const getExplorerRank = (percentage: number) => {
    if (percentage === 0) return { title: 'শুরুর অভিযাত্রী', sub: 'New Explorer', level: 0, badge: '🌱' };
    if (percentage <= 15) return { title: 'পদ্মা ও মতিহার পদযাত্রী', sub: 'Padma Wanderer', level: 1, badge: '🌊' };
    if (percentage <= 35) return { title: 'বরেন্দ্র ও মহাস্থান বিজয়ী', sub: 'Heritage Explorer', level: 2, badge: '🏛️' };
    if (percentage <= 65) return { title: 'চলনবিল ও উত্তরবঙ্গ অভিযাত্রী', sub: 'Division Adventurer', level: 3, badge: '🛶' };
    if (percentage < 100) return { title: 'রাজশাহী মাস্টার ট্রাভেলার', sub: 'Master Traveller', level: 4, badge: '⭐' };
    return { title: 'রাজশাহী বিভাগীয় পর্যটন সুলতান', sub: 'Grand Sultan of Rajshahi', level: 5, badge: '👑' };
  };

  const rank = getExplorerRank(pct);

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
  }, [isShareModalOpen, userName, pct, visitedCount]);

  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;

    // 1. Royal Dark Emerald & Slate Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#062817');
    bgGrad.addColorStop(0.5, '#021c10');
    bgGrad.addColorStop(1, '#010f08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Radial Glow
    const rad = ctx.createRadialGradient(W / 2, 450, 50, W / 2, 450, 400);
    rad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // 2. Gold Outer Border Frame
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // Decorative Corner Accents
    const corners = [
      [40, 40],
      [W - 40, 40],
      [40, H - 40],
      [W - 40, H - 40],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Header Badges
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(W / 2 - 190, 65, 380, 40, 20);
    ctx.fill();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RU INSIDERS • অফিশিয়াল ট্র্যাভেল ট্র্যাকার', W / 2, 91);

    // 4. Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.fillText('রাজশাহী বিভাগ পর্যটন সনদ', W / 2, 160);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '500 18px "Hind Siliguri", sans-serif';
    ctx.fillText('৮ জেলার ৯৫টি দর্শনীয় স্থান ভ্রমণ প্রগ্রেস ও অর্জন', W / 2, 195);

    // 5. Explorer User Name
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
    ctx.fillText(userName.trim() || 'রাজশাহী অভিযাত্রী', W / 2, 245);

    // 6. Draw the Water Fill Map
    const mapImg = new Image();
    mapImg.crossOrigin = 'anonymous';
    mapImg.src = '/campus/rajshahi-division-map-transparent.png';
    mapImg.onload = () => {
      const mapW = 600;
      const mapH = 435;
      const mapX = (W - mapW) / 2;
      const mapY = 280;

      // Draw faint dry background outline
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.drawImage(mapImg, mapX, mapY, mapW, mapH);
      ctx.restore();

      // Clip for water fill level (rising from bottom)
      const waterHeight = (mapH * pct) / 100;
      const waterTopY = mapY + mapH - waterHeight;

      if (waterHeight > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(mapX, waterTopY, mapW, waterHeight);
        ctx.clip();

        // Draw filled vibrant map
        ctx.drawImage(mapImg, mapX, mapY, mapW, mapH);

        // Water surface line
        if (pct < 100) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(mapX, waterTopY);
          ctx.lineTo(mapX + mapW, waterTopY);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Draw percentage pill over map
      ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 120, 740, 240, 52, 26);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
      ctx.fillText(`${pct}% সম্পন্ন`, W / 2, 775);

      // 7. Stats Box: Visited Count & Rank
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(100, 820, W - 200, 150, 24);
      ctx.fill();
      ctx.stroke();

      // Visited places stats
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 20px "Hind Siliguri", sans-serif';
      ctx.fillText(`মোট দর্শনীয় স্থান ভ্রমণ: ${visitedCount} / ${totalSpotsCount} টি`, W / 2, 865);

      // Rank Title
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`${rank.badge} পদবী: ${rank.title}`, W / 2, 915);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 15px "Hind Siliguri", sans-serif';
      ctx.fillText(rank.sub, W / 2, 942);

      // 8. Footer & Branding
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
      ctx.fillText('RU Insiders • মতিহার ক্যাম্পাস ও রাজশাহী বিভাগ পর্যটন প্ল্যাটফর্ম', W / 2, 1070);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText('ruinsiders.vercel.app/map • ' + new Date().toLocaleDateString('bn-BD'), W / 2, 1100);
    };
  };

  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ru-insiders-rajshahi-poster-${pct}pct.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shareText = `আমি রাজশাহী বিভাগের ${visitedCount}টি দর্শনীয় স্থান ঘুরে ${pct}% ভ্রমণ সম্পন্ন করেছি! আমার পদবী: ${rank.title}। আপনি রাজশাহী বিভাগের কয়টি জায়গা ঘুরেছেন? দেখে নিন: https://ruinsiders.vercel.app/map`;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `rajshahi-travel-${pct}pct.png`, { type: 'image/png' });
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
              url: 'https://ruinsiders.vercel.app/map',
            });
          }
        });
        return;
      } catch (e) {
        console.warn('Share dismissed or failed:', e);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {}
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-emerald-800/40 space-y-4 sm:space-y-6 relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              রাজশাহী বিভাগ ওয়াটার-ফিল ম্যাপ ট্র্যাকার
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white font-bengali tracking-tight flex items-center gap-2">
            <span>আপনার ভ্রমণ প্রগ্রেস:</span>
            <span className="text-emerald-400 font-mono">{pct}%</span>
          </h3>
          <p className="text-xs text-slate-300 font-bengali">
            যেকোনো দর্শনীয় স্থানে ক্লিক করে টিক দিন—পানির মতো ম্যাপটি নিচ থেকে উপরে পূর্ণ হতে থাকবে!
          </p>
        </div>

        {/* Share & Download Action Button */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Share2 className="h-4 w-4" />
          <span>পোস্টার তৈরি ও শেয়ার করুন</span>
          <Sparkles className="h-4 w-4 text-amber-300" />
        </button>
      </div>

      {/* Central Visual: Water-Fill Map & Live Stats */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left (7 Cols): SVG Pixel-Perfect Water Filling Map */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[500px] aspect-[1472/1068] bg-slate-950/60 rounded-3xl p-3 sm:p-5 border border-emerald-900/50 shadow-inner flex items-center justify-center overflow-hidden">
            
            {/* SVG Water-Fill Silhouette */}
            <svg
              viewBox="0 0 1472 1068"
              className="w-full h-full object-contain select-none"
            >
              <defs>
                {/* Mathematical Water Level Clip Rectangle */}
                <clipPath id="rajshahi-water-level-clip">
                  <rect
                    x="0"
                    y={1068 - (1068 * pct) / 100}
                    width="1472"
                    height={(1068 * pct) / 100}
                  />
                </clipPath>
              </defs>

              {/* Layer 1: Dry / Unvisited Outline (Dim Gray Silhouette) */}
              <image
                href="/campus/rajshahi-division-map-transparent.webp"
                x="0"
                y="0"
                width="1472"
                height="1068"
                opacity="0.22"
                style={{ filter: 'grayscale(1) brightness(1.2)' }}
              />

              {/* Layer 2: Water-Filled Vibrant Emerald Region */}
              <g clipPath="url(#rajshahi-water-level-clip)">
                <image
                  href="/campus/rajshahi-division-map-transparent.webp"
                  x="0"
                  y="0"
                  width="1472"
                  height="1068"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))' }}
                />

                {/* Animated Liquid Wave Crest Line */}
                {pct > 0 && pct < 100 && (
                  <line
                    x1="0"
                    y1={1068 - (1068 * pct) / 100}
                    x2="1472"
                    y2={1068 - (1068 * pct) / 100}
                    stroke="#6ee7b7"
                    strokeWidth="8"
                    strokeDasharray="14 8"
                    opacity="0.9"
                  />
                )}
              </g>
            </svg>

            {/* Water Percentage Center Floating Badge */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-black text-emerald-300">{pct}% পূর্ণ</span>
            </div>

            {/* Empty State Hint if 0% */}
            {pct === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/40 backdrop-blur-[1px] rounded-3xl">
                <Compass className="h-8 w-8 text-emerald-400 animate-spin mb-2" style={{ animationDuration: '8s' }} />
                <p className="text-xs sm:text-sm font-bold text-white font-bengali">
                  নিচের দর্শনীয় স্থানগুলো ভ্রমণ করে টিক চিহ্ন দিন
                </p>
                <p className="text-[11px] text-emerald-300 font-bengali">
                  আপনার ভ্রমণের সাথে সাথে এই ম্যাপটি পানির মতো সবুজ রঙে ভরে উঠবে!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right (5 Cols): Live Rank & District Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Rank Badge Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>আপনার বর্তমান পদবী</span>
              </span>
              <span className="text-lg">{rank.badge}</span>
            </div>

            <div className="space-y-0.5">
              <div className="text-base sm:text-lg font-black text-amber-300 font-bengali">
                {rank.title}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {rank.sub} (লেভেল {rank.level})
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bengali text-slate-300">
              <span>মোট ঘোরা হয়েছে:</span>
              <span className="font-mono font-bold text-emerald-400">{visitedCount} / {totalSpotsCount} টি স্থান</span>
            </div>
          </div>

          {/* Liquid Progress Bar with Milestone Dots */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bengali text-slate-300">
              <span>ভ্রমণ পূর্ণতার মাত্রা</span>
              <span className="font-mono font-bold text-emerald-300">{pct}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 border border-white/10 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700 relative"
                style={{ width: `${pct}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick District Selector Buttons */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              বিভাগের ৮ জেলা থেকে স্পট নির্বাচন করুন:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {RAJSHAHI_DIVISION_DISTRICTS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDistrict?.(d.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/50 text-[11px] font-bold text-slate-200 transition-all flex items-center justify-between"
                >
                  <span>{d.nameBn}</span>
                  <span className="text-[10px] text-slate-400">{d.spotCount}টি</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Share / Poster Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
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

            {/* User Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 font-bengali">
                পোস্টারে আপনার নাম লিখুন:
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
                placeholder="যেমন: মোঃ মাহিম হাসান"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            {/* Live Canvas Preview */}
            <div className="w-full flex justify-center bg-black/40 rounded-2xl p-2 border border-white/5 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[340px] sm:max-w-[420px] h-auto rounded-xl shadow-lg border border-emerald-900/60"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadPoster}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>পোস্টার ডাউনলোড (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-300" /> : <Share2 className="h-4 w-4" />}
                <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
