'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Camera,
  UploadCloud,
  Trash2,
  ExternalLink,
  Plus,
  RotateCcw,
  Check,
  Sparkles,
  MapPin,
  Compass,
  Landmark,
  Save,
  Edit3,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ALL_MAP_PLACES,
  SimpleMapPlace,
  RAJSHAHI_DIVISION_DISTRICTS,
  DIVISION_ALL_95_SPOTS,
  TouristSpot,
  getStoredTouristSpots,
  saveStoredTouristSpot,
  resetStoredTouristSpots
} from '@/lib/touristSpots';

export default function AdminMapPhotoManager() {
  const [managerMode, setManagerMode] = useState<'tourist_spots' | 'map_places'>('tourist_spots');

  // ================= 1. TOURIST SPOTS (95 SPOTS) STATE =================
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('rajshahi');
  const [allSpots, setAllSpots] = useState<TouristSpot[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string>('');
  const [editingSpot, setEditingSpot] = useState<TouristSpot | null>(null);
  const [isUploadingSpotImg, setIsUploadingSpotImg] = useState<boolean>(false);

  // Load Tourist Spots
  useEffect(() => {
    const list = getStoredTouristSpots();
    setAllSpots(list);
    if (list.length > 0) {
      const firstInDist = list.find((s) => s.districtId === selectedDistrictId) || list[0];
      setSelectedSpotId(firstInDist.id);
      setEditingSpot({ ...firstInDist });
    }
  }, []);

  // When district changes, update selected spot
  useEffect(() => {
    if (allSpots.length === 0) return;
    const firstInDist = allSpots.find((s) => s.districtId === selectedDistrictId);
    if (firstInDist) {
      setSelectedSpotId(firstInDist.id);
      setEditingSpot({ ...firstInDist });
    }
  }, [selectedDistrictId, allSpots]);

  // When spot changes, populate form
  const handleSelectSpot = (id: string) => {
    setSelectedSpotId(id);
    const found = allSpots.find((s) => s.id === id);
    if (found) {
      setEditingSpot({ ...found });
    }
  };

  // ================= 2. MAP PLACES (RU, RCC, RAJSHAHI) STATE =================
  const [region, setRegion] = useState<'ru' | 'rcc' | 'rajshahi'>('ru');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('paris_road');
  const [photoCredit, setPhotoCredit] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [customPhotos, setCustomPhotos] = useState<{ [key: string]: { url: string; credit: string }[] }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load saved photos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('unseen_ru_custom_photos_v1');
      if (saved) {
        setCustomPhotos(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const savePhotosState = (updated: { [key: string]: { url: string; credit: string }[] }) => {
    setCustomPhotos(updated);
    try {
      localStorage.setItem('unseen_ru_custom_photos_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fast client-side image compression for browser localStorage
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new (window as any).Image();
        img.onload = () => {
          const maxDim = 1000;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Handlers for 95 Tourist Spots ---
  const handleSaveTouristSpot = () => {
    if (!editingSpot) return;
    saveStoredTouristSpot(editingSpot);
    const updated = allSpots.map((s) => (s.id === editingSpot.id ? editingSpot : s));
    setAllSpots(updated);
    showToast(`✓ "${editingSpot.nameBn}" তথ্য ও ছবি সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  const handleSpotImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSpot) return;
    setIsUploadingSpotImg(true);
    try {
      const dataUrl = await compressImage(file);
      setEditingSpot({
        ...editingSpot,
        imageUrl: dataUrl
      });
      showToast('✓ নতুন ছবি সিলেক্ট করা হয়েছে! "পরিবর্তন সংরক্ষণ করুন" বাটনে চাপুন।');
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setIsUploadingSpotImg(false);
      e.target.value = '';
    }
  };

  const handleResetTouristSpots = () => {
    if (!confirm('আপনি কি রাজশাহী বিভাগের ৯৫টি দর্শনীয় স্থানের সব পরিবর্তন মুছে ডিফল্টে রিসেট করতে চান?')) return;
    resetStoredTouristSpots();
    setAllSpots(DIVISION_ALL_95_SPOTS);
    const first = DIVISION_ALL_95_SPOTS.find((s) => s.districtId === selectedDistrictId) || DIVISION_ALL_95_SPOTS[0];
    setSelectedSpotId(first.id);
    setEditingSpot({ ...first });
    showToast('✓ সফলভাবে সরকারি ডিফল্ট দর্শনীয় স্থান তালিকায় রিসেট করা হয়েছে।');
  };

  // --- Handlers for Map Places ---
  const currentPlaces: SimpleMapPlace[] = ALL_MAP_PLACES[region] || ALL_MAP_PLACES.ru;

  useEffect(() => {
    if (!currentPlaces.some((p) => p.id === selectedPlaceId)) {
      if (currentPlaces.length > 0) {
        setSelectedPlaceId(currentPlaces[0].id);
      }
    }
  }, [region, currentPlaces, selectedPlaceId]);

  const activePlace = currentPlaces.find((p) => p.id === selectedPlaceId) || currentPlaces[0];
  const placePhotos = customPhotos[selectedPlaceId] || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const credit = photoCredit.trim() ? `📸 ${photoCredit.trim()}` : '📷 অ্যাডমিন গ্যালারি';
    const newItems: { url: string; credit: string }[] = [];

    for (const file of files) {
      try {
        const dataUrl = await compressImage(file);
        newItems.unshift({ url: dataUrl, credit });
      } catch (err) {}
    }

    const updated = {
      ...customPhotos,
      [selectedPlaceId]: [...newItems, ...(customPhotos[selectedPlaceId] || [])]
    };
    savePhotosState(updated);
    setIsUploading(false);
    e.target.value = '';
    showToast('✓ ছবি সফলভাবে আপলোড হয়েছে এবং ম্যাপে যুক্ত হয়েছে!');
  };

  const handleAddUrl = () => {
    if (!photoUrl.trim()) return;
    const credit = photoCredit.trim() ? `📸 ${photoCredit.trim()}` : '📷 ওয়েব গ্যালারি';
    const updated = {
      ...customPhotos,
      [selectedPlaceId]: [{ url: photoUrl.trim(), credit }, ...(customPhotos[selectedPlaceId] || [])]
    };
    savePhotosState(updated);
    setPhotoUrl('');
    showToast('✓ ছবির লিঙ্ক সফলভাবে যুক্ত হয়েছে!');
  };

  const handleDeletePhoto = (index: number) => {
    const list = [...(customPhotos[selectedPlaceId] || [])];
    list.splice(index, 1);
    const updated = { ...customPhotos };
    if (list.length > 0) {
      updated[selectedPlaceId] = list;
    } else {
      delete updated[selectedPlaceId];
    }
    savePhotosState(updated);
    showToast('✓ ছবি মুছে ফেলা হয়েছে।');
  };

  const handleResetToDefault = () => {
    if (!confirm(`আপনি কি "${activePlace?.nameBn}" স্থানের সব আপলোড করা ছবি মুছে ডিফল্ট ছবিতে ফিরে যেতে চান?`)) return;
    const updated = { ...customPhotos };
    delete updated[selectedPlaceId];
    savePhotosState(updated);
    showToast('✓ ডিফল্ট ছবিতে রিসেট করা হয়েছে।');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-xl shadow-inner shrink-0">
            🏛️
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-bengali">
              দর্শনীয় স্থান ও ম্যাপ ফটো কন্ট্রোল প্যানেল
            </h2>
            <p className="text-xs text-slate-500 font-medium font-bengali">
              রাজশাহী বিভাগের ৯৫টি ঐতিহ্যবাহী দর্শনীয় স্থান এবং ইন্টারঅ্যাক্টিভ ম্যাপের ছবি ও তথ্য কাস্টমাইজ করুন
            </p>
          </div>
        </div>

        {/* Manager Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setManagerMode('tourist_spots')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              managerMode === 'tourist_spots'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>ঐতিহ্যবাহী ৯৫টি দর্শনীয় স্থান</span>
          </button>

          <button
            type="button"
            onClick={() => setManagerMode('map_places')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              managerMode === 'map_places'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>রাবি ও ম্যাপ টেরিটরি ফটো</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: 95 OFFICIAL TOURIST SPOTS MANAGER (RAJSHAHI DIVISION 8 DISTRICTS) */}
      {/* ========================================================================= */}
      {managerMode === 'tourist_spots' && (
        <div className="space-y-6">
          
          {/* District Selector Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>জেলা নির্বাচন করুন (রাজশাহী বিভাগের ৮টি জেলা)</span>
              </span>
              <button
                type="button"
                onClick={handleResetTouristSpots}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl transition flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>ডিফল্ট সরকারি তথ্যে রিসেট</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {RAJSHAHI_DIVISION_DISTRICTS.map((dist) => {
                const isActive = selectedDistrictId === dist.id;
                return (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => setSelectedDistrictId(dist.id)}
                    className={`p-2.5 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-md font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold truncate max-w-full">{dist.nameBn}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      {dist.spotCount}টি স্পট
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spot Selector & Edit Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Spot Selector Column (Left) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  {RAJSHAHI_DIVISION_DISTRICTS.find((d) => d.id === selectedDistrictId)?.nameBn} জেলার দর্শনীয় স্থানসমূহ
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-700">
                  {allSpots.filter((s) => s.districtId === selectedDistrictId).length}টি স্পট
                </span>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {allSpots
                  .filter((s) => s.districtId === selectedDistrictId)
                  .map((spot, idx) => {
                    const isSelected = selectedSpotId === spot.id;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => handleSelectSpot(spot.id)}
                        className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-500 border border-slate-200'
                          }`}>
                            {spot.rankNo}
                          </span>
                          <span className="text-xs font-bold truncate">{spot.nameBn}</span>
                        </div>
                        <Edit3 className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Spot Edit Form (Right) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
              {editingSpot ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        স্পট ক্রমিক {editingSpot.rankNo} • {editingSpot.districtBn} জেলা
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 font-bengali">
                        {editingSpot.nameBn}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveTouristSpot}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Spot Name (Bangla) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        দর্শনীয় স্থানের নাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={editingSpot.nameBn}
                        onChange={(e) => setEditingSpot({ ...editingSpot, nameBn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Spot Name (English) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        নাম (English)
                      </label>
                      <input
                        type="text"
                        value={editingSpot.nameEn || ''}
                        onChange={(e) => setEditingSpot({ ...editingSpot, nameEn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Location */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        অবস্থান / ঠিকানা
                      </label>
                      <input
                        type="text"
                        value={editingSpot.locationBn}
                        onChange={(e) => setEditingSpot({ ...editingSpot, locationBn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        ঐতিহাসিক বিবরণ ও আকর্ষণ
                      </label>
                      <textarea
                        rows={3}
                        value={editingSpot.descriptionBn}
                        onChange={(e) => setEditingSpot({ ...editingSpot, descriptionBn: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs leading-relaxed focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Image URL & File Upload */}
                    <div className="md:col-span-2 space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">
                          দর্শনীয় স্থানের ছবি (ইমেজ আপলোড বা ওয়েব লিংক)
                        </label>
                        {isUploadingSpotImg && (
                          <span className="text-[11px] font-bold text-blue-600 animate-pulse">
                            ছবি প্রসেসিং হচ্ছে...
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                          <UploadCloud className="h-4 w-4" />
                          <span>কম্পিউটার থেকে ছবি আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSpotImageUpload}
                            className="hidden"
                          />
                        </label>

                        <span className="text-xs text-slate-400 font-bold">অথবা</span>

                        <input
                          type="url"
                          placeholder="ইমেজ লিংক (https://...)"
                          value={editingSpot.imageUrl}
                          onChange={(e) => setEditingSpot({ ...editingSpot, imageUrl: e.target.value })}
                          className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Card Preview */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      হোমপেজে কার্ডের প্রিভিউ:
                    </span>
                    <div className="max-w-md bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="relative h-44 w-full bg-slate-900">
                        <img
                          src={editingSpot.imageUrl}
                          alt={editingSpot.nameBn}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md text-amber-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <span>ক্রমিক {editingSpot.rankNo}</span>
                          <span className="opacity-75">•</span>
                          <span>{editingSpot.districtBn}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {editingSpot.nameBn}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{editingSpot.locationBn}</span>
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {editingSpot.descriptionBn}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center text-slate-400">
                  বাম থেকে যেকোনো একটি দর্শনীয় স্থান সিলেক্ট করুন।
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: MAP PLACES PHOTO MANAGER (RU, RCC & RAJSHAHI DISTRICT) */}
      {/* ========================================================================= */}
      {managerMode === 'map_places' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Region & Place Select */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Region Switcher */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-700 block">১. ম্যাপ অঞ্চল নির্বাচন করুন:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ru', label: '🎓 রাবি ক্যাম্পাস', count: ALL_MAP_PLACES.ru.length },
                  { id: 'rcc', label: '🏙️ রাজশাহী সিটি', count: ALL_MAP_PLACES.rcc.length },
                  { id: 'rajshahi', label: '🥭 রাজশাহী জেলা', count: ALL_MAP_PLACES.rajshahi.length },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRegion(item.id as any)}
                    className={`p-2.5 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1 ${
                      region === item.id
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      region === item.id ? 'bg-white/20 text-white font-mono' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.count}টি স্থান
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Place Selector List */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">২. স্থান নির্বাচন করুন:</label>
                <span className="text-[11px] font-mono font-bold text-emerald-700">
                  {currentPlaces.length}টি স্থান অন্তর্ভুক্ত
                </span>
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {currentPlaces.map((place) => {
                  const isSelected = selectedPlaceId === place.id;
                  const hasCustomPhotos = !!customPhotos[place.id]?.length;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => setSelectedPlaceId(place.id)}
                      className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold truncate">{place.nameBn}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasCustomPhotos && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            {customPhotos[place.id].length} ছবি
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">#{place.id}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Upload Forms & Gallery Preview */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  নির্বাচিত স্থান
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 font-bengali">
                  {activePlace?.nameBn} ({activePlace?.nameEn})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {placePhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>ডিফল্টে রিসেট</span>
                  </button>
                )}

                <a
                  href={`/map?place=${selectedPlaceId}&region=${region}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#1f7a44] text-xs font-bold flex items-center gap-1 transition"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>ম্যাপে প্রিভিউ ↗</span>
                </a>
              </div>
            </div>

            {/* Photo Credit field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ফটোগ্রাফার ক্রেডিট / ক্যাপশন (ঐচ্ছিক):
              </label>
              <input
                type="text"
                placeholder="যেমন: ছবি - রাফি আহমেদ, ব্যাচ ২০২০"
                value={photoCredit}
                onChange={(e) => setPhotoCredit(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Upload Method 1: Local File Upload */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-blue-600" />
                  <span>কম্পিউটার বা মোবাইল থেকে ছবি আপলোড</span>
                </span>
                {isUploading && (
                  <span className="text-[11px] font-bold text-blue-600 animate-pulse">আপলোড হচ্ছে...</span>
                )}
              </div>
              <p className="text-[11px] text-blue-700">
                ছবি স্বয়ংক্রিয়ভাবে কম্প্রেস হয়ে সেভ হবে যাতে পেজ সুপার-ফাস্ট লোড হয়।
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition">
                <Plus className="h-4 w-4" />
                <span>ফাইল সিলেক্ট করুন</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Method 2: Image URL */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-slate-600" />
                <span>অনলাইন ছবির লিংক পেস্ট করুন</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
                >
                  যোগ করুন
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                এই স্থানের বর্তমান ছবিসমূহ ({placePhotos.length}টি কাস্টম ছবি):
              </span>

              {placePhotos.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                  <Camera className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">এই স্থানে এখনো কোনো কাস্টম ছবি আপলোড করা হয়নি।</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    উপরে ফাইল সিলেক্ট করে বা লিংক দিয়ে ছবি আপলোড করলে অবিলম্বে ম্যাপে তা প্রদর্শিত হবে।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {placePhotos.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm aspect-video flex flex-col justify-end"
                    >
                      <img
                        src={item.url}
                        alt="Place Photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                        <p className="text-[9px] font-medium truncate">{item.credit}</p>
                        <span className="text-[8px] opacity-75">স্লট #{idx + 1}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white shadow-sm opacity-90 group-hover:opacity-100 transition"
                        title="ছবি মুছে ফেলুন"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
