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
  ChevronLeft,
  ChevronRight,
  Layers,
  ZoomIn,
  Search
} from 'lucide-react';
import { RAJSHAHI_DIVISION_DISTRICTS, TouristSpot } from '@/lib/touristSpots';
import { RAJSHAHI_DISTRICT_SVGS, RAJSHAHI_VIEWBOX, DistrictSvgData } from '@/lib/rajshahiDistrictsSvg';
import { RAJSHAHI_PDF_REGIONS, RAJSHAHI_PDF_MAP_VIEWBOX, RajshahiPdfRegionData } from '@/lib/rajshahiPdfRegions';
import { RU_CAMPUS_PLACES, RU_CAMPUS_VIEWBOX, RuPlaceSvgData } from '@/lib/ruCampusSvg';
import CampusMapExplorer from './CampusMapExplorer';

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

  // 3 Hierarchical Map Modes (Requested Exact Titles):
  // 1. 'division' -> ১. রাজশাহী বিভাগ কতটুকু ঘুরলেন
  // 2. 'rajshahi_district' -> ২. রাজশাহী জেলা কতটুকু ঘুরলেন
  // 3. 'ru_campus' -> ৩. রাজশাহী বিশ্ববিদ্যালয় কতটুকু ঘুরলেন
  const [mapViewMode, setMapViewMode] = useState<'division' | 'rajshahi_district' | 'ru_campus'>('division');

  // Visited state for RU campus 42 places
  const [visitedRuPlaceIds, setVisitedRuPlaceIds] = useState<string[]>([]);

  // Visited state for Rajshahi District 22 regions from the PDF map
  const [visitedPdfRegionIds, setVisitedPdfRegionIds] = useState<string[]>([]);
  const [pdfSearchQuery, setPdfSearchQuery] = useState('');

  // Selection & hover states for Stage 1 (Division)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Selection & hover states for Stage 2 (Rajshahi District PDF map)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>('pdf_ruet');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Selection & hover states for Stage 3 (RU Campus)
  const [selectedRuPlaceId, setSelectedRuPlaceId] = useState<string | null>('shabash_bd');
  const [hoveredRuPlaceId, setHoveredRuPlaceId] = useState<string | null>(null);
  const [ruSearchQuery, setRuSearchQuery] = useState('');
  const [ruSelectedCategory, setRuSelectedCategory] = useState<'all' | 'academic' | 'halls' | 'landmarks' | 'admin_gates'>('all');

  // Right-side list highlight state
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load visited RU campus places and PDF district regions from localStorage
  useEffect(() => {
    try {
      const savedRu = localStorage.getItem('ru_visited_campus_places_v1');
      if (savedRu) {
        setVisitedRuPlaceIds(JSON.parse(savedRu));
      }
      const savedPdf = localStorage.getItem('ru_visited_pdf_regions_v1');
      if (savedPdf) {
        setVisitedPdfRegionIds(JSON.parse(savedPdf));
      }
    } catch (e) {}
  }, []);

  // Listen for trigger from Hero/CampusTourBanner to open RU campus map right here
  useEffect(() => {
    const handleOpenRU = () => {
      onSelectDistrict('rajshahi');
      setMapViewMode('ru_campus');
    };
    window.addEventListener('ru_open_campus_map', handleOpenRU);
    return () => window.removeEventListener('ru_open_campus_map', handleOpenRU);
  }, [onSelectDistrict]);

  // Toggle visited for RU Campus territory
  const toggleVisitedRuPlace = (placeId: string) => {
    const updated = visitedRuPlaceIds.includes(placeId)
      ? visitedRuPlaceIds.filter((id) => id !== placeId)
      : [...visitedRuPlaceIds, placeId];
    setVisitedRuPlaceIds(updated);
    try {
      localStorage.setItem('ru_visited_campus_places_v1', JSON.stringify(updated));
    } catch (e) {}

    // Auto-mark spot-rj-ru as visited if at least one RU place is explored
    if (updated.length > 0 && !visitedSpotIds.includes('spot-rj-ru') && onToggleVisited) {
      onToggleVisited('spot-rj-ru');
    }
  };

  // Toggle visited for Rajshahi District PDF region
  const toggleVisitedPdfRegion = (regionId: string) => {
    const updated = visitedPdfRegionIds.includes(regionId)
      ? visitedPdfRegionIds.filter((id) => id !== regionId)
      : [...visitedPdfRegionIds, regionId];
    setVisitedPdfRegionIds(updated);
    try {
      localStorage.setItem('ru_visited_pdf_regions_v1', JSON.stringify(updated));
    } catch (e) {}

    // If RU zone is marked, also sync spot-rj-ru
    if (regionId === 'pdf_ru' && !visitedSpotIds.includes('spot-rj-ru') && onToggleVisited) {
      onToggleVisited('spot-rj-ru');
    }
  };

  // 1. Division visited percentage & counts
  const visitedDivisionCount = visitedSpotIds.length;
  const divisionPct = Math.min(100, Math.round((visitedDivisionCount / totalSpotsCount) * 100));

  // 2. Rajshahi District 22 regions stats (from user's PDF map)
  const visitedPdfCount = visitedPdfRegionIds.length;
  const pdfDistrictPct = Math.min(100, Math.round((visitedPdfCount / RAJSHAHI_PDF_REGIONS.length) * 100));

  // Filtered 22 PDF regions
  const filteredPdfRegions = useMemo(() => {
    if (!pdfSearchQuery.trim()) return RAJSHAHI_PDF_REGIONS;
    const q = pdfSearchQuery.toLowerCase().trim();
    return RAJSHAHI_PDF_REGIONS.filter(
      (r) => r.nameBn.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q)
    );
  }, [pdfSearchQuery]);

  // Helper to open details modal for PDF region
  const handleOpenPdfRegionDetails = (region: RajshahiPdfRegionData) => {
    if (onOpenSpotDetails) {
      onOpenSpotDetails({
        id: region.id,
        rankNo: region.rankNo,
        nameBn: region.nameBn,
        nameEn: region.nameEn,
        districtBn: 'রাজশাহী জেলা',
        districtId: 'rajshahi',
        locationBn: 'রাজশাহী জেলা ও মহানগর',
        descriptionBn: region.descriptionBn,
        imageUrl: region.imageUrl,
        images: [region.imageUrl],
        tags: ['রাজশাহী জেলা', '২২ অঞ্চল', region.nameBn]
      });
    }
  };

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

  // 2. Rajshahi District stats
  const rajshahiSpots = useMemo(() => allSpots.filter((s) => s.districtId === 'rajshahi'), [allSpots]);
  const activeDistrictData = RAJSHAHI_DIVISION_DISTRICTS.find((d) => d.id === selectedDistrict) || RAJSHAHI_DIVISION_DISTRICTS[0];
  const activeStats = districtStats[selectedDistrict] || { total: activeDistrictData.spotCount, visited: 0, pct: 0 };
  const rajshahiStats = districtStats['rajshahi'] || { total: rajshahiSpots.length || 9, visited: 0, pct: 0 };

  // 3. RU Campus stats
  const visitedRuCount = visitedRuPlaceIds.length;
  const ruPct = Math.min(100, Math.round((visitedRuCount / RU_CAMPUS_PLACES.length) * 100));

  // Spots belonging to the currently selected district
  const activeDistrictSpots = useMemo(() => {
    return allSpots.filter((s) => s.districtId === selectedDistrict);
  }, [allSpots, selectedDistrict]);

  // Filtered RU campus places
  const filteredRuPlaces = useMemo(() => {
    let list = RU_CAMPUS_PLACES;
    if (ruSelectedCategory !== 'all') {
      if (ruSelectedCategory === 'academic') {
        list = list.filter((p) =>
          [
            'agri_faculty',
            'fine_arts',
            'twenty_storied',
            'jc_bose_bldg',
            'qudrat_e_khuda_bldg',
            'fourth_science_bldg',
            'rabindra_bldg',
            'shahidullah_bldg',
            'siraji_bldg',
            'arts_bldg_bba',
            'second_arts_bldg'
          ].includes(p.id)
        );
      } else if (ruSelectedCategory === 'halls') {
        list = list.filter((p) =>
          [
            'rokeya_hall',
            'habibur_hall',
            'ziaur_hall',
            'madar_bux_hall',
            'suhrawardy_hall',
            'shamsuzzoha_hall',
            'rahamatunnesa_hall',
            'taposhi_rabeya_hall',
            'khaleda_zia_hall',
            'sheikh_hasina_hall',
            'fazilatunnesa_hall',
            'mannujan_hall',
            'bangabandhu_hall',
            'motihar_hall',
            'sher_e_bangla_hall',
            'shah_makhdum_hall',
            'nawab_abdul_latif_hall',
            'syed_ameer_ali_hall'
          ].includes(p.id)
        );
      } else if (ruSelectedCategory === 'landmarks') {
        list = list.filter((p) =>
          [
            'botanical_garden',
            'ru_station',
            'boddhobhumi',
            'shabash_bd',
            'swadhinata_chottor',
            'paris_road',
            'central_mosque',
            'central_field'
          ].includes(p.id)
        );
      } else if (ruSelectedCategory === 'admin_gates') {
        list = list.filter((p) =>
          ['charukola_gate', 'central_library', 'admin_building', 'main_gate', 'kazla_gate_binodpur'].includes(p.id)
        );
      }
    }
    if (ruSearchQuery.trim()) {
      const q = ruSearchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.shortBn.toLowerCase().includes(q)
      );
    }
    return list;
  }, [ruSelectedCategory, ruSearchQuery]);

  // When a district pill is clicked
  const handleDistrictTabClick = (distId: string) => {
    onSelectDistrict(distId);
    if (distId === 'rajshahi') {
      setMapViewMode('rajshahi_district');
    } else {
      setMapViewMode('division');
    }
  };

  // Helper to open details modal for RU place
  const handleOpenRuPlaceDetails = (place: RuPlaceSvgData) => {
    if (onOpenSpotDetails) {
      onOpenSpotDetails({
        id: place.id,
        rankNo: place.rankNo,
        nameBn: place.nameBn,
        nameEn: place.nameEn,
        districtBn: 'রাজশাহী বিশ্ববিদ্যালয়',
        districtId: 'rajshahi',
        locationBn: 'মতিহার ক্যাম্পাস, রাজশাহী',
        descriptionBn: place.descriptionBn,
        imageUrl: place.imageUrl,
        images: [place.imageUrl],
        tags: ['রাবি ক্যাম্পাস', '৪২ টেরিটরি', place.shortBn]
      });
    }
  };

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
  }, [isShareModalOpen, userName, divisionPct, rajshahiStats.pct, ruPct, visitedDivisionCount, selectedDistrict, mapViewMode]);

  // =========================================================================
  // POSTER CANVAS DRAWING: VECTOR ACCURACY FOR ALL 3 STAGES!
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
    ctx.fillText('RU INSIDERS • UNSEEN RAJSHAHI EXPLORER', W / 2, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 46px sans-serif';

    const stageTitle =
      mapViewMode === 'ru_campus'
        ? 'রাজশাহী বিশ্ববিদ্যালয় ভ্রমণ সনদ'
        : mapViewMode === 'rajshahi_district'
        ? 'রাজশাহী জেলা ঐতিহ্য ভ্রমণ সনদ'
        : 'রাজশাহী বিভাগ পর্যটন সনদ';

    ctx.fillText(stageTitle, W / 2, 140);

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

    // Map Card Frame
    const mapCardX = 140;
    const mapCardY = 320;
    const mapCardW = 620;
    const mapCardH = 430;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.roundRect(mapCardX, mapCardY, mapCardW, mapCardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (mapViewMode === 'ru_campus') {
      // Draw Complete 42-Place Vector Map of RU Campus
      const viewBoxMinX = 0;
      const viewBoxMinY = 0;
      const viewBoxW = 1200;
      const viewBoxH = 750;

      const scale = Math.min((mapCardW - 40) / viewBoxW, (mapCardH - 40) / viewBoxH);
      const mapOffsetX = mapCardX + (mapCardW - viewBoxW * scale) / 2;
      const mapOffsetY = mapCardY + (mapCardH - viewBoxH * scale) / 2;

      ctx.save();
      ctx.translate(mapOffsetX, mapOffsetY);
      ctx.scale(scale, scale);
      ctx.translate(-viewBoxMinX, -viewBoxMinY);

      RU_CAMPUS_PLACES.forEach((p) => {
        try {
          const path = new Path2D(p.d);
          const isVisited = visitedRuPlaceIds.includes(p.id);

          ctx.fillStyle = '#10522c';
          ctx.fill(path);

          if (isVisited) {
            ctx.save();
            ctx.clip(path);
            ctx.fillStyle = '#059669';
            ctx.fillRect(p.bbox.minX, p.bbox.minY, p.bbox.w, p.bbox.h);
            ctx.restore();
          }

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke(path);

          ctx.fillStyle = isVisited ? '#10b981' : '#ef4444';
          ctx.beginPath();
          ctx.arc(p.center.x, p.center.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } catch (e) {}
      });
      ctx.restore();

    } else if (mapViewMode === 'rajshahi_district') {
      // Draw Exact 22-Region Vector Map of Rajshahi District from the user's PDF
      const viewBoxMinX = 0;
      const viewBoxMinY = 0;
      const viewBoxW = 1920;
      const viewBoxH = 1920;

      const scale = Math.min((mapCardW - 40) / viewBoxW, (mapCardH - 40) / viewBoxH);
      const mapOffsetX = mapCardX + (mapCardW - viewBoxW * scale) / 2;
      const mapOffsetY = mapCardY + (mapCardH - viewBoxH * scale) / 2;

      ctx.save();
      ctx.translate(mapOffsetX, mapOffsetY);
      ctx.scale(scale, scale);
      ctx.translate(-viewBoxMinX, -viewBoxMinY);

      RAJSHAHI_PDF_REGIONS.forEach((reg) => {
        try {
          const path = new Path2D(reg.d);
          const isVisited = visitedPdfRegionIds.includes(reg.id);

          ctx.fillStyle = '#10522c';
          ctx.fill(path);

          if (isVisited || pdfDistrictPct > 0) {
            ctx.save();
            ctx.clip(path);
            const fillPct = isVisited ? 100 : Math.min(pdfDistrictPct, 30);
            const fillH = (reg.bbox.h * fillPct) / 100;
            const fillY = reg.bbox.maxY - fillH;
            ctx.fillStyle = '#059669';
            ctx.fillRect(reg.bbox.minX - 10, fillY, reg.bbox.w + 20, fillH + 10);
            ctx.restore();
          }

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke(path);

          ctx.fillStyle = isVisited ? '#10b981' : '#ef4444';
          ctx.beginPath();
          ctx.arc(reg.center.x, reg.center.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        } catch (e) {}
      });
      ctx.restore();

    } else {
      // Draw Complete 8-District Vector Map of Rajshahi Division
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

          ctx.fillStyle = '#10522c';
          ctx.fill(path);

          if (st.pct > 0) {
            ctx.save();
            ctx.clip(path);
            const waterHeight = (dist.bbox.h * st.pct) / 100;
            const waterY = dist.bbox.maxY - waterHeight;
            ctx.fillStyle = '#059669';
            ctx.fillRect(dist.bbox.minX - 5, waterY, dist.bbox.w + 10, waterHeight + 5);
            ctx.restore();
          }

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.6;
          ctx.stroke(path);

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(dist.pin.x, dist.pin.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        } catch (e) {}
      });
      ctx.restore();
    }

    // Bottom Stats on Citation Poster
    const curPct =
      mapViewMode === 'ru_campus'
        ? ruPct
        : mapViewMode === 'rajshahi_district'
        ? pdfDistrictPct
        : divisionPct;

    const curExplored =
      mapViewMode === 'ru_campus'
        ? `${visitedRuCount} / ${RU_CAMPUS_PLACES.length} টেরিটরি`
        : mapViewMode === 'rajshahi_district'
        ? `${visitedPdfCount} / ${RAJSHAHI_PDF_REGIONS.length} অঞ্চল`
        : `${visitedDivisionCount} / ${totalSpotsCount} টি স্থান`;

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`ভ্রমণ রেকর্ড: ${curPct}% সম্পন্ন (${curExplored})`, W / 2, mapCardY + mapCardH + 50);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('RU Insiders • রাজশাহী বিশ্ববিদ্যালয়ের শিক্ষার্থীদের অফিসিয়াল প্ল্যাটফর্ম', W / 2, H - 75);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#0c2419] p-3 sm:p-6 shadow-2xl border-2 border-emerald-700/60 overflow-hidden space-y-4 text-slate-100">
      
      {/* ===================================================================== */}
      {/* TOP 3 UNIFIED EXPLORATION STAGES (User's Exact Requested Headings)     */}
      {/* ===================================================================== */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-2 sm:p-3 rounded-2xl text-white shadow-xl border border-emerald-700/60">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bengali">
          
          {/* Stage 1: রাজশাহী বিভাগ কতটুকু ঘুরলেন */}
          <button
            type="button"
            onClick={() => setMapViewMode('division')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow ${
              mapViewMode === 'division'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white font-black scale-[1.02]'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
            }`}
          >
            <Compass className="h-4 w-4 shrink-0" />
            <span className="font-bold">১. রাজশাহী বিভাগ কতটুকু ঘুরলেন</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black ${
              mapViewMode === 'division' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-800 text-white'
            }`}>
              {divisionPct}%
            </span>
          </button>

          <ChevronRight className="h-4 w-4 text-emerald-400/80 hidden sm:inline" />

          {/* Stage 2: রাজশাহী জেলা কতটুকু ঘুরলেন */}
          <button
            type="button"
            onClick={() => {
              onSelectDistrict('rajshahi');
              setMapViewMode('rajshahi_district');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow ${
              mapViewMode === 'rajshahi_district'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white font-black scale-[1.02]'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
            }`}
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="font-bold">২. রাজশাহী জেলা কতটুকু ঘুরলেন</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black ${
              mapViewMode === 'rajshahi_district' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-800 text-white'
            }`}>
              {pdfDistrictPct}%
            </span>
          </button>

          <ChevronRight className="h-4 w-4 text-emerald-400/80 hidden sm:inline" />

          {/* Stage 3: রাজশাহী বিশ্ববিদ্যালয় কতটুকু ঘুরলেন */}
          <button
            type="button"
            onClick={() => setMapViewMode('ru_campus')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow ${
              mapViewMode === 'ru_campus'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white font-black scale-[1.02]'
                : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-bold">৩. রাজশাহী বিশ্ববিদ্যালয় কতটুকু ঘুরলেন</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black ${
              mapViewMode === 'ru_campus' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-800 text-white'
            }`}>
              {ruPct}%
            </span>
          </button>
        </div>

        {/* Share Certificate / Poster Button */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
        >
          <Trophy className="h-4 w-4 text-amber-300" />
          <span>ভ্রমণ সনদ ও শেয়ার</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 8-DISTRICTS SELECTOR PILLS (Visible in Stage 1 for instant browsing)   */}
      {/* ===================================================================== */}
      {mapViewMode === 'division' && (
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-200 font-bengali uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-amber-400" />
              <span>বিভাগের ৮টি জেলা থেকে নির্বাচন করুন:</span>
            </span>
            <span className="text-[10px] text-emerald-300/80 font-bold font-bengali">
              (রাজশাহী সিলেক্ট করলে সরাসরি রাজশাহী জেলা ম্যাপে নিয়ে যাবে)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {RAJSHAHI_DIVISION_DISTRICTS.map((d) => {
              const isActive = selectedDistrict === d.id;
              const st = districtStats[d.id] || { total: d.spotCount, visited: 0, pct: 0 };

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictTabClick(d.id)}
                  className={`p-2 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1 group cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-white scale-[1.02]'
                      : 'bg-emerald-950/70 hover:bg-emerald-900 text-white border-emerald-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-black font-bengali truncate ${isActive ? 'text-slate-950' : 'text-emerald-100 group-hover:text-amber-300'}`}>
                      {d.nameBn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className={isActive ? 'text-slate-800' : 'text-emerald-300/80'}>
                      {st.visited}/{st.total}
                    </span>
                    <span className={`font-bold ${isActive ? 'text-slate-950' : st.visited > 0 ? 'text-amber-300' : 'text-emerald-400/60'}`}>
                      {st.pct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 22-REGIONS SELECTOR PILLS (Visible in Stage 2 for instant browsing)    */}
      {/* ===================================================================== */}
      {mapViewMode === 'rajshahi_district' && (
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-200 font-bengali uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>রাজশাহী জেলার ২২টি অঞ্চল থেকে নির্বাচন করুন:</span>
            </span>
            <span className="text-[10px] text-emerald-300/80 font-bold font-bengali">
              (ক্লিক করলে ম্যাপে অঞ্চলটি হাইলাইট ও সিলেক্ট হবে)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {RAJSHAHI_PDF_REGIONS.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              const isVisited = visitedPdfRegionIds.includes(reg.id);

              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    setSelectedRegionId(reg.id);
                    setHighlightedItemId(reg.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left transition-all border whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-white scale-[1.02] font-black'
                      : isVisited
                      ? 'bg-emerald-900/90 text-white border-emerald-500 hover:bg-emerald-800'
                      : 'bg-emerald-950/70 hover:bg-emerald-900 text-white border-emerald-800/80'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-black/30 text-emerald-300'
                    }`}
                  >
                    {reg.rankNo}
                  </span>
                  <span className="text-xs font-bengali font-bold">
                    {reg.nameBn} {isVisited ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 42-CAMPUS PLACES SELECTOR PILLS (Visible in Stage 3)                   */}
      {/* ===================================================================== */}
      {mapViewMode === 'ru_campus' && (
        <div className="relative z-10 space-y-2">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-emerald-200 font-bengali mr-1 flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>রাবি ক্যাম্পাসের ৪২টি স্থান:</span>
              </span>
              {[
                { id: 'all', label: 'সব স্থান', count: 42 },
                { id: 'academic', label: 'একাডেমিক ভবন', count: 11 },
                { id: 'halls', label: 'আবাসিক হল', count: 18 },
                { id: 'landmarks', label: 'ল্যান্ডমার্ক ও চত্বর', count: 8 },
                { id: 'admin_gates', label: 'প্রশাসনিক ও গেট', count: 5 }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setRuSelectedCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bengali transition-all cursor-pointer ${
                    ruSelectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/80'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Direct Link to Standalone Argon Explorer if desired */}
            <a
              href="/unseen-ru.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 underline underline-offset-2 transition font-bengali ml-auto"
            >
              <ExternalLink className="h-3 w-3" />
              <span>জেমিনি আরগন আনসিন ম্যাপ (ফুলস্ক্রিন)</span>
            </a>
          </div>

          {/* Horizontal Scrollable RU Places Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {filteredRuPlaces.map((place) => {
              const isSelected = selectedRuPlaceId === place.id;
              const isVisited = visitedRuPlaceIds.includes(place.id);

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    setSelectedRuPlaceId(place.id);
                    setHighlightedItemId(place.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left transition-all border whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-white scale-[1.02] font-black'
                      : isVisited
                      ? 'bg-emerald-900/90 text-white border-emerald-500 hover:bg-emerald-800'
                      : 'bg-emerald-950/70 hover:bg-emerald-900 text-white border-emerald-800/80'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-black/30 text-emerald-300'
                    }`}
                  >
                    {place.rankNo}
                  </span>
                  <span className="text-xs font-bengali font-bold">
                    {place.shortBn} {isVisited ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIFIED 2-COLUMN MAP & SPOTS SYSTEM FOR ALL 3 STAGES                  */}
      {/* ===================================================================== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Side (6 Cols): Dynamic Vector SVG Map Frame */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[245/220] min-h-[380px] sm:min-h-[500px] bg-[#f2eee3] rounded-[28px] p-2 sm:p-4 border-2 border-emerald-900/15 shadow-inner flex items-center justify-center overflow-hidden group">
            
            {mapViewMode === 'division' && (
              /* ============================================================== */
              /* STAGE 1: RAJSHAHI DIVISION (8 DISTRICTS VECTOR SVG MAP)         */
              /* ============================================================== */
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl select-none">
                <svg
                  viewBox={RAJSHAHI_VIEWBOX}
                  className="w-full h-full object-contain select-none"
                >
                  <defs>
                    <filter id="active-district-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#facc15" floodOpacity="0.95" />
                      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.8" />
                    </filter>

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

                  {/* 8 District Territories */}
                  {RAJSHAHI_DISTRICT_SVGS.map((dist) => {
                    const isSelected = selectedDistrict === dist.id;
                    const isHovered = hoveredDistrict === dist.id;
                    const st = districtStats[dist.id] || { pct: 0, visited: 0, total: 0 };

                    return (
                      <g
                        key={dist.id}
                        onClick={() => {
                          onSelectDistrict(dist.id);
                          if (dist.id === 'rajshahi') {
                            setMapViewMode('rajshahi_district');
                          }
                        }}
                        onMouseEnter={() => setHoveredDistrict(dist.id)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        className="cursor-pointer transition-transform duration-200"
                      >
                        {/* Land Silhouette: Slate for Unvisited, Forest Green for Visited */}
                        <path
                          d={dist.d}
                          fill={
                            st.pct > 0
                              ? (isSelected ? '#0e4a2c' : isHovered ? '#125c37' : '#064e3b')
                              : (isSelected ? '#1e293b' : isHovered ? '#334155' : '#1e293b')
                          }
                          stroke={isSelected ? '#facc15' : st.pct > 0 ? '#34d399' : '#64748b'}
                          strokeWidth={isSelected ? '2.5' : '1.2'}
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

                        {/* District Borders */}
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

                        {/* Ripple Line on water surface */}
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

                        {/* Center Pin */}
                        <circle
                          cx={dist.pin.x}
                          cy={dist.pin.y}
                          r="3.5"
                          fill={isSelected ? '#f59e0b' : st.pct > 0 ? '#10b981' : '#64748b'}
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          className="shadow"
                        />
                        <circle cx={dist.pin.x} cy={dist.pin.y} r="1.1" fill="#ffffff" />

                        {/* Bengali District Name */}
                        <text
                          x={dist.pin.x}
                          y={dist.pin.y - 4.5}
                          textAnchor="middle"
                          fill={isSelected ? '#fde047' : st.pct > 0 ? '#ffffff' : '#cbd5e1'}
                          stroke="#0f172a"
                          strokeWidth="2.5"
                          paintOrder="stroke fill"
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none tracking-tight font-bengali"
                        >
                          {dist.nameBn} {st.pct > 0 ? '✓' : ''}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Bottom Step Forward Action */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDistrict('rajshahi');
                      setMapViewMode('rajshahi_district');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>২. রাজশাহী জেলা কতটুকু ঘুরলেন ➔</span>
                  </button>
                </div>
              </div>
            )}

            {mapViewMode === 'rajshahi_district' && (
              /* ============================================================== */
              /* STAGE 2: RAJSHAHI DISTRICT (22 REGIONS PURE VECTOR SVG MAP)    */
              /* ============================================================== */
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl select-none">
                <svg
                  viewBox="80 120 1770 1660"
                  className="w-full h-full object-contain select-none"
                >
                  <defs>
                    <filter id="active-rajshahi-region-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#facc15" floodOpacity="1" />
                      <feDropShadow dx="0" dy="0" stdDeviation="30" floodColor="#f59e0b" floodOpacity="0.8" />
                    </filter>

                    {RAJSHAHI_PDF_REGIONS.map((reg) => {
                      const isVisited = visitedPdfRegionIds.includes(reg.id);
                      const fillPct = isVisited ? 100 : Math.min(pdfDistrictPct, 20);
                      const waterHeight = (reg.bbox.h * fillPct) / 100;
                      const waterY = reg.bbox.maxY - waterHeight;

                      return (
                        <clipPath key={`clip-pdf-${reg.id}`} id={`water-clip-pdf-${reg.id}`}>
                          <rect
                            x={reg.bbox.minX - 10}
                            y={waterY}
                            width={reg.bbox.w + 20}
                            height={waterHeight + 20}
                            className="transition-all duration-700 ease-out"
                          />
                        </clipPath>
                      );
                    })}
                  </defs>

                  {/* 22 Territories with Pure Vector Fill, Crisp White Boundaries & Gold Selection */}
                  {RAJSHAHI_PDF_REGIONS.map((reg) => {
                    const isSelected = selectedRegionId === reg.id;
                    const isHovered = hoveredRegionId === reg.id;
                    const isVisited = visitedPdfRegionIds.includes(reg.id);

                    return (
                      <g
                        key={reg.id}
                        id={`pdf-map-${reg.id}`}
                        onClick={() => {
                          setSelectedRegionId(reg.id);
                          setHighlightedItemId(reg.id);
                        }}
                        onMouseEnter={() => setHoveredRegionId(reg.id)}
                        onMouseLeave={() => setHoveredRegionId(null)}
                        className="cursor-pointer transition-transform duration-200"
                      >
                        {/* Land Base Silhouette: Slate for Unvisited, Deep Emerald for Visited */}
                        <path
                          d={reg.d}
                          fill={
                            isVisited
                              ? (isSelected ? '#0e4a2c' : isHovered ? '#125c37' : '#064e3b')
                              : (isSelected ? '#1e293b' : isHovered ? '#334155' : '#1e293b')
                          }
                          stroke={isSelected ? '#facc15' : isVisited ? '#34d399' : '#ffffff'}
                          strokeWidth={isSelected ? '5' : '2'}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Liquid Green Water Fill when Visited */}
                        {isVisited && (
                          <path
                            d={reg.d}
                            fill="#059669"
                            opacity="0.9"
                            clipPath={`url(#water-clip-pdf-${reg.id})`}
                            className="transition-all duration-700 ease-out"
                          />
                        )}

                        {/* Crisp Boundary Lines */}
                        <path
                          d={reg.d}
                          fill="none"
                          stroke={isSelected ? '#fbbf24' : isHovered ? '#6ee7b7' : '#ffffff'}
                          strokeWidth={isSelected ? '5.5' : isVisited ? '3' : '1.8'}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Glowing Golden Stroke when Selected */}
                        {isSelected && (
                          <path
                            d={reg.d}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="7"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            filter="url(#active-rajshahi-region-glow)"
                            className="animate-pulse"
                          />
                        )}

                        {/* Center Pin Marker */}
                        <circle
                          cx={reg.center.x}
                          cy={reg.center.y}
                          r={isSelected ? '16' : '12'}
                          fill={isSelected ? '#f59e0b' : isVisited ? '#10b981' : '#64748b'}
                          stroke="#ffffff"
                          strokeWidth="3"
                          className="shadow"
                        />
                        <circle cx={reg.center.x} cy={reg.center.y} r="4" fill="#ffffff" />

                        {/* Region Bengali Name */}
                        <text
                          x={reg.center.x}
                          y={reg.center.y - 18}
                          textAnchor="middle"
                          fill={isSelected ? '#fde047' : isVisited ? '#ffffff' : '#f1f5f9'}
                          stroke="#0f172a"
                          strokeWidth="4"
                          paintOrder="stroke fill"
                          fontSize="22"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none tracking-tight font-bengali"
                        >
                          {reg.nameBn.length > 18 ? reg.nameBn.slice(0, 16) + '...' : reg.nameBn} {isVisited ? '✓' : ''}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Top Active Region Info Pill */}
                <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                  {(() => {
                    const activeReg = RAJSHAHI_PDF_REGIONS.find((r) => r.id === selectedRegionId);
                    return activeReg ? (
                      <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold font-bengali border border-emerald-400/50 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>অঞ্চল: {activeReg.nameBn}</span>
                      </div>
                    ) : null;
                  })()}

                  {/* RU Campus shortcut button if RU is selected */}
                  {selectedRegionId === 'pdf_ru' && (
                    <button
                      type="button"
                      onClick={() => setMapViewMode('ru_campus')}
                      className="pointer-events-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all animate-bounce cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                      <span>৩. রাবি ক্যাম্পাস কতটুকু ঘুরলেন ➔</span>
                    </button>
                  )}
                </div>

                {/* Bottom Step Navigation Buttons */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setMapViewMode('division')}
                    className="bg-white/95 hover:bg-white text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-xl border border-stone-300 shadow-md flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>← ১. রাজশাহী বিভাগ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapViewMode('ru_campus')}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                    <span>৩. রাজশাহী বিশ্ববিদ্যালয় ➔</span>
                  </button>
                </div>
              </div>
            )}

            {mapViewMode === 'ru_campus' && (
              /* ============================================================== */
              /* STAGE 3: RU CAMPUS (42 PLACES PURE VECTOR SVG MAP)             */
              /* ============================================================== */
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl select-none">
                <svg
                  viewBox="50 0 1120 720"
                  className="w-full h-full object-contain select-none"
                >
                  <defs>
                    <filter id="active-ru-place-glow" x="-25%" y="-25%" width="150%" height="150%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#facc15" floodOpacity="1" />
                      <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#f59e0b" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* 42 RU Campus Places with Vector Fill, Borders & Glowing Golden Active Ring */}
                  {RU_CAMPUS_PLACES.map((place) => {
                    const isSelected = selectedRuPlaceId === place.id;
                    const isHovered = hoveredRuPlaceId === place.id;
                    const isVisited = visitedRuPlaceIds.includes(place.id);

                    return (
                      <g
                        key={place.id}
                        id={`ru-place-${place.id}`}
                        onClick={() => {
                          setSelectedRuPlaceId(place.id);
                          setHighlightedItemId(place.id);
                        }}
                        onMouseEnter={() => setHoveredRuPlaceId(place.id)}
                        onMouseLeave={() => setHoveredRuPlaceId(null)}
                        className="cursor-pointer transition-transform duration-200"
                      >
                        {/* Land Silhouette */}
                        <path
                          d={place.d}
                          fill={
                            isVisited
                              ? (isSelected ? '#0e4a2c' : isHovered ? '#125c37' : '#064e3b')
                              : (isSelected ? '#1e293b' : isHovered ? '#334155' : '#1e293b')
                          }
                          stroke={isSelected ? '#facc15' : isVisited ? '#34d399' : '#ffffff'}
                          strokeWidth={isSelected ? '3.5' : '1.2'}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Liquid Green Water fill if visited */}
                        {isVisited && (
                          <path
                            d={place.d}
                            fill="#059669"
                            opacity="0.9"
                            className="transition-all duration-700 ease-out"
                          />
                        )}

                        {/* Crisp White/Gold Boundary */}
                        <path
                          d={place.d}
                          fill="none"
                          stroke={isSelected ? '#fbbf24' : isHovered ? '#6ee7b7' : '#ffffff'}
                          strokeWidth={isSelected ? '3.5' : isVisited ? '2' : '1'}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Glowing Golden Stroke when Selected */}
                        {isSelected && (
                          <path
                            d={place.d}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            filter="url(#active-ru-place-glow)"
                            className="animate-pulse"
                          />
                        )}

                        {/* Center Pin Marker */}
                        <circle
                          cx={place.center.x}
                          cy={place.center.y}
                          r={isSelected ? '6' : '4.5'}
                          fill={isSelected ? '#f59e0b' : isVisited ? '#10b981' : '#64748b'}
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          className="shadow"
                        />
                        <circle cx={place.center.x} cy={place.center.y} r="1.5" fill="#ffffff" />

                        {/* Bengali Place Name */}
                        <text
                          x={place.center.x}
                          y={place.center.y - 7}
                          textAnchor="middle"
                          fill={isSelected ? '#fde047' : isVisited ? '#ffffff' : '#cbd5e1'}
                          stroke="#0f172a"
                          strokeWidth="2.5"
                          paintOrder="stroke fill"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none tracking-tight font-bengali"
                        >
                          {place.shortBn} {isVisited ? '✓' : ''}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Top Active Spot Info Pill */}
                <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                  {(() => {
                    const activePlace = RU_CAMPUS_PLACES.find((p) => p.id === selectedRuPlaceId);
                    return activePlace ? (
                      <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold font-bengali border border-emerald-400/50 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>টেরিটরি: {activePlace.nameBn}</span>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Bottom Step Navigation Buttons */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDistrict('rajshahi');
                      setMapViewMode('rajshahi_district');
                    }}
                    className="bg-white/95 hover:bg-white text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-xl border border-stone-300 shadow-md flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>← ২. রাজশাহী জেলা</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapViewMode('division')}
                    className="bg-emerald-950/90 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-700/60 shadow-md flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>১. রাজশাহী বিভাগ ➔</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* In-Place Quick Action Card directly under the Map for all 3 Stages */}
          {mapViewMode === 'division' && (
            <div className="w-full mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-2.5 font-bengali">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {activeDistrictData.nameBn} ({activeStats.visited}/{activeStats.total} স্থান ঘোরা শেষ)
                  </h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  {activeDistrictData.nameEn} District
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectDistrict('rajshahi');
                  setMapViewMode('rajshahi_district');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
              >
                <span>২. রাজশাহী জেলা ➔</span>
              </button>
            </div>
          )}

          {mapViewMode === 'rajshahi_district' && selectedRegionId && (
            <div className="w-full mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-2.5 font-bengali animate-in fade-in slide-in-from-top-1 duration-200">
              {(() => {
                const activeReg = RAJSHAHI_PDF_REGIONS.find((r) => r.id === selectedRegionId);
                if (!activeReg) return null;
                const isVis = visitedPdfRegionIds.includes(activeReg.id);
                return (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isVis ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {activeReg.nameBn}
                        </h4>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{activeReg.nameEn}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleVisitedPdfRegion(activeReg.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                          isVis
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isVis ? '✓ ঘোরা শেষ' : 'ঘুরেছি (টিক দিন)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPdfRegionDetails(activeReg)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-300" />
                        <span>ছবি</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {mapViewMode === 'ru_campus' && selectedRuPlaceId && (
            <div className="w-full mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-2.5 font-bengali animate-in fade-in slide-in-from-top-1 duration-200">
              {(() => {
                const activePlace = RU_CAMPUS_PLACES.find((p) => p.id === selectedRuPlaceId);
                if (!activePlace) return null;
                const isVis = visitedRuPlaceIds.includes(activePlace.id);
                return (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isVis ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {activePlace.nameBn}
                        </h4>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{activePlace.nameEn} • মতিহার ক্যাম্পাস</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleVisitedRuPlace(activePlace.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                          isVis
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isVis ? '✓ ঘোরা শেষ' : 'ঘুরেছি (টিক দিন)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenRuPlaceDetails(activePlace)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-300" />
                        <span>ছবি</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* Right Side (6 Cols): UNIFIED SPOTLIGHT HEADER & VERTICAL LIST         */}
        {/* ===================================================================== */}
        <div className="lg:col-span-6 space-y-3.5">
          
          {/* Spotlight Header Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border border-emerald-700/60 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5 font-bengali">
                {mapViewMode === 'ru_campus' ? (
                  <Sparkles className="h-4 w-4 text-amber-400" />
                ) : mapViewMode === 'rajshahi_district' ? (
                  <MapPin className="h-4 w-4 text-amber-400" />
                ) : (
                  <Compass className="h-4 w-4 text-amber-400" />
                )}
                <span>
                  {mapViewMode === 'ru_campus'
                    ? 'রাজশাহী বিশ্ববিদ্যালয় ক্যাম্পাস পর্যটন মানচিত্র'
                    : mapViewMode === 'rajshahi_district'
                    ? 'রাজশাহী জেলা পর্যটন মানচিত্র'
                    : `বর্তমানে নির্বাচিত: ${activeDistrictData.nameBn}`}
                </span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black font-bengali">
                {mapViewMode === 'ru_campus'
                  ? `${RU_CAMPUS_PLACES.length}টি স্থান`
                  : mapViewMode === 'rajshahi_district'
                  ? `${RAJSHAHI_PDF_REGIONS.length}টি অঞ্চল`
                  : `${activeDistrictSpots.length}টি দর্শনীয় স্থান`}
              </span>
            </div>

            {/* Main Title & Percentage */}
            <div className="flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-black text-white font-bengali tracking-tight">
                {mapViewMode === 'ru_campus'
                  ? '৩. রাজশাহী বিশ্ববিদ্যালয় কতটুকু ঘুরলেন'
                  : mapViewMode === 'rajshahi_district'
                  ? '২. রাজশাহী জেলা কতটুকু ঘুরলেন'
                  : '১. রাজশাহী বিভাগ কতটুকু ঘুরলেন'}
              </div>
              <div className="text-sm font-mono font-bold text-amber-300">
                {mapViewMode === 'ru_campus'
                  ? `${visitedRuCount} / ${RU_CAMPUS_PLACES.length} সম্পন্ন`
                  : mapViewMode === 'rajshahi_district'
                  ? `${visitedPdfCount} / ${RAJSHAHI_PDF_REGIONS.length} সম্পন্ন`
                  : `${activeStats.visited} / ${activeStats.total} সম্পন্ন`}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      mapViewMode === 'ru_campus'
                        ? ruPct
                        : mapViewMode === 'rajshahi_district'
                        ? pdfDistrictPct
                        : activeStats.pct
                    }%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-emerald-200 font-mono">
                <span>
                  ভ্রমণ পূর্ণতা:{' '}
                  {mapViewMode === 'ru_campus'
                    ? `${ruPct}%`
                    : mapViewMode === 'rajshahi_district'
                    ? `${pdfDistrictPct}%`
                    : `${activeStats.pct}%`}
                </span>
                <span>
                  অবশিষ্ট:{' '}
                  {mapViewMode === 'ru_campus'
                    ? `${RU_CAMPUS_PLACES.length - visitedRuCount} স্থান`
                    : mapViewMode === 'rajshahi_district'
                    ? `${RAJSHAHI_PDF_REGIONS.length - visitedPdfCount} অঞ্চল`
                    : `${activeStats.total - activeStats.visited} স্থান`}
                </span>
              </div>
            </div>

            {/* Search filter for Stage 2 PDF regions or Stage 3 RU Places */}
            {mapViewMode === 'rajshahi_district' && (
              <div className="pt-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-300" />
                  <input
                    type="text"
                    value={pdfSearchQuery}
                    onChange={(e) => setPdfSearchQuery(e.target.value)}
                    placeholder="রাজশাহী জেলার অঞ্চল খুঁজুন (রুয়েট, রাবি, মেডিকেল, টি-বাঁধ...)"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/30 border border-emerald-500/30 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-amber-400 font-bengali"
                  />
                </div>
              </div>
            )}

            {mapViewMode === 'ru_campus' && (
              <div className="pt-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-300" />
                  <input
                    type="text"
                    value={ruSearchQuery}
                    onChange={(e) => setRuSearchQuery(e.target.value)}
                    placeholder="রাবি ক্যাম্পাস ভবন, চত্বর বা হল খুঁজুন (প্যারিস রোড, সাবাশ বাংলাদেশ, জোহা হল...)"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/30 border border-emerald-500/30 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-1 focus:ring-amber-400 font-bengali"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* VERTICAL SPOTS LIST FOR STAGE 1, 2, AND 3                          */}
          {/* ================================================================= */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* STAGE 3: RU CAMPUS 42 PLACES LIST */}
            {mapViewMode === 'ru_campus' && (
              filteredRuPlaces.map((place) => {
                const isVisited = visitedRuPlaceIds.includes(place.id);
                const isHighlighted = highlightedItemId === place.id || selectedRuPlaceId === place.id;

                return (
                  <div
                    key={place.id}
                    id={place.id}
                    onMouseEnter={() => setHoveredRuPlaceId(place.id)}
                    onMouseLeave={() => setHoveredRuPlaceId(null)}
                    onClick={() => {
                      setSelectedRuPlaceId(place.id);
                      setHighlightedItemId(place.id);
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-white text-slate-900 border transition-all duration-200 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between group shadow-sm hover:shadow-md cursor-pointer ${
                      isHighlighted
                        ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/40 shadow-md scale-[1.01]'
                        : isVisited
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200/90 hover:border-emerald-400/80'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRuPlaceDetails(place);
                      }}
                      className="relative w-full sm:w-28 h-28 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer shadow-inner"
                    >
                      <img
                        src={place.imageUrl}
                        alt={place.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] font-bengali shadow">
                          {place.rankNo}
                        </span>
                      </div>
                      {isVisited && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-600 text-white shadow">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRuPlaceDetails(place);
                        }}
                        className="text-xs sm:text-sm font-black text-slate-900 font-bengali line-clamp-1 group-hover:text-emerald-700 cursor-pointer"
                      >
                        {place.nameBn}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bengali">
                        <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                        <span className="truncate">{place.nameEn} • মতিহার ক্যাম্পাস</span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-bengali line-clamp-2 leading-relaxed">
                        {place.descriptionBn}
                      </p>

                      {/* Action Row */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleVisitedRuPlace(place.id)}
                          className={`py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all font-bengali cursor-pointer ${
                            isVisited
                              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isVisited ? '✓ ঘোরা সম্পন্ন' : 'আমি এই জায়গা ঘুরেছি (টিক দিন)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenRuPlaceDetails(place)}
                          className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow transition font-bengali cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-300" />
                          <span>বিস্তারিত ও ছবি দেখুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* STAGE 2: RAJSHAHI DISTRICT EXACT 22 REGIONS FROM PDF MAP */}
            {mapViewMode === 'rajshahi_district' && (
              filteredPdfRegions.map((reg) => {
                const isVisited = visitedPdfRegionIds.includes(reg.id);
                const isHighlighted = highlightedItemId === reg.id || selectedRegionId === reg.id;

                return (
                  <div
                    key={reg.id}
                    id={reg.id}
                    onMouseEnter={() => setHoveredRegionId(reg.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => {
                      setSelectedRegionId(reg.id);
                      setHighlightedItemId(reg.id);
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-white text-slate-900 border transition-all duration-200 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between group shadow-sm hover:shadow-md cursor-pointer ${
                      isHighlighted
                        ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/40 shadow-md scale-[1.01]'
                        : isVisited
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200/90 hover:border-emerald-400/80'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPdfRegionDetails(reg);
                      }}
                      className="relative w-full sm:w-28 h-28 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer shadow-inner"
                    >
                      <img
                        src={reg.imageUrl}
                        alt={reg.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] font-bengali shadow">
                          {reg.rankNo}
                        </span>
                      </div>
                      {isVisited && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-600 text-white shadow">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPdfRegionDetails(reg);
                        }}
                        className="text-xs sm:text-sm font-black text-slate-900 font-bengali line-clamp-1 group-hover:text-emerald-700 cursor-pointer"
                      >
                        {reg.nameBn}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bengali">
                        <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                        <span className="truncate">{reg.nameEn}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-bengali line-clamp-2 leading-relaxed">
                        {reg.descriptionBn}
                      </p>

                      {/* Action Row */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleVisitedPdfRegion(reg.id)}
                          className={`py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all font-bengali cursor-pointer ${
                            isVisited
                              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isVisited ? '✓ ঘোরা সম্পন্ন' : 'আমি এই অঞ্চল ঘুরেছি (টিক দিন)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenPdfRegionDetails(reg)}
                          className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow transition font-bengali cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-300" />
                          <span>বিস্তারিত ও ছবি দেখুন</span>
                        </button>

                        {/* Special shortcut for RU Campus on Item #02 */}
                        {reg.id === 'pdf_ru' && (
                          <button
                            type="button"
                            onClick={() => setMapViewMode('ru_campus')}
                            className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1.5 shadow transition font-bengali cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                            <span>৩. রাবি ক্যাম্পাস ম্যাপ (৪২ স্পট) ➔</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* STAGE 1: DIVISION SELECTED DISTRICT SPOTS LIST */}
            {mapViewMode === 'division' && (
              activeDistrictSpots.map((spot) => {
                const isVisited = visitedSpotIds.includes(spot.id);
                const spotImages =
                  Array.isArray(spot.images) && spot.images.length > 0
                    ? spot.images
                    : spot.imageUrl
                    ? [spot.imageUrl]
                    : [];

                return (
                  <div
                    key={spot.id}
                    id={spot.id}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-white text-slate-900 border transition-all duration-200 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between group shadow-sm hover:shadow-md ${
                      isVisited
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200/90 hover:border-emerald-400/80'
                    }`}
                  >
                    {/* Thumbnail */}
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

                    {/* Info */}
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
                          className={`py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all font-bengali cursor-pointer ${
                            isVisited
                              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isVisited ? '✓ ঘোরা সম্পন্ন' : 'আমি এই জায়গা ঘুরেছি (টিক দিন)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenSpotDetails && onOpenSpotDetails(spot)}
                          className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow transition font-bengali cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-300" />
                          <span>বিস্তারিত ও ছবি দেখুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* SHARE / POSTER CITATION MODAL                                         */}
      {/* ===================================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg text-white font-bengali">
                  অফিসিয়াল ভ্রমণ সনদপত্র ও শেয়ার
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Name Input */}
            <div className="space-y-1 font-bengali">
              <label className="text-xs text-emerald-300 font-bold">
                সনদপত্রে আপনার নাম:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('ru_explorer_user_name', e.target.value);
                  }
                }}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Live Canvas Poster Preview */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full max-h-[360px] object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 font-bengali">
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = `RU-Explorer-Citation-${userName || 'Member'}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
              >
                <Trophy className="h-4 w-4" />
                <span>সনদপত্র ডাউনলোড করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span>{copiedLink ? '✓ লিংক কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
