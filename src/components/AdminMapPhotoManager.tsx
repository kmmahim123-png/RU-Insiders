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
  Compass
} from 'lucide-react';
import { ALL_MAP_PLACES, SimpleMapPlace } from '@/lib/touristSpots';

export default function AdminMapPhotoManager() {
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
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get places for current region
  const currentPlaces: SimpleMapPlace[] = ALL_MAP_PLACES[region] || ALL_MAP_PLACES.ru;

  // Ensure selected place belongs to region
  useEffect(() => {
    if (!currentPlaces.some((p) => p.id === selectedPlaceId)) {
      if (currentPlaces.length > 0) {
        setSelectedPlaceId(currentPlaces[0].id);
      }
    }
  }, [region, currentPlaces, selectedPlaceId]);

  const activePlace = currentPlaces.find((p) => p.id === selectedPlaceId) || currentPlaces[0];
  const placePhotos = customPhotos[selectedPlaceId] || [];

  // Canvas image compression for fast storage
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
    const updated = { ...customPhotos };
    delete updated[selectedPlaceId];
    savePhotosState(updated);
    showToast('✓ এই স্থানের ছবি ডিফল্ট সেটিংসে রিসেট করা হয়েছে।');
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            <span>ম্যাপ ও ল্যান্ডমার্ক ফটো ম্যানেজার (Map Photo Hub)</span>
          </h2>
          <p className="text-xs text-slate-500 font-bengali mt-0.5">
            রাবি ক্যাম্পাস, রাজশাহী সিটি ও জেলার যেকোনো স্থানের ছবি আপলোড বা পরিবর্তন করুন। পরিবর্তিত ছবি স্বয়ংক্রিয়ভাবে ইন্টারঅ্যাক্টিভ ম্যাপে দেখা যাবে।
          </p>
        </div>

        {toastMessage && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-sm animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Region Selector Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">১. ম্যাপ অঞ্চল নির্বাচন করুন:</label>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ru', label: '🎓 রাবি ক্যাম্পাস (৪২টি অঞ্চল)', count: ALL_MAP_PLACES.ru.length },
            { id: 'rcc', label: '🏙️ রাজশাহী সিটি কর্পোরেশন (২৪টি ওয়ার্ড)', count: ALL_MAP_PLACES.rcc.length },
            { id: 'rajshahi', label: '🥭 রাজশাহী জেলা ও ৯ উপজেলা (২৭টি অঞ্চল)', count: ALL_MAP_PLACES.rajshahi.length },
          ].map((r) => {
            const isActive = region === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1f7a44] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Selector & Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Select Place + Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              ২. কোন স্থানের ছবি যুক্ত বা পরিবর্তন করতে চান?
            </label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
            >
              {currentPlaces.map((p) => {
                const customCount = customPhotos[p.id]?.length || 0;
                return (
                  <option key={p.id} value={p.id}>
                    {p.nameBn} ({p.nameEn}) {customCount > 0 ? `[📸 ${customCount}টি আপলোড]` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              ৩. ফটোগ্রাফারের নাম বা ছবির ক্যাপশন (ঐচ্ছিক):
            </label>
            <input
              type="text"
              placeholder="যেমন: সাজিদ মাহমুদ (ভিজিটর ছবি) বা বর্ষায় প্যারিস রোড"
              value={photoCredit}
              onChange={(e) => setPhotoCredit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Upload Button */}
          <div className="pt-1">
            <label className="block text-emerald-950 font-bold mb-1.5">
              ৪. কম্পিউটার বা মোবাইল থেকে ছবি আপলোড করুন:
            </label>
            <label className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition shadow-xs">
              <UploadCloud className="h-6 w-6 text-[#1f7a44]" />
              <span className="text-center">ডিভাইস থেকে এক বা একাধিক ছবি সিলেক্ট করুন</span>
              <span className="text-[10px] text-emerald-700 font-normal">
                স্বয়ংক্রিয়ভাবে অপটিমাইজ হয়ে সরাসরি ম্যাপে সেভ হবে
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Or Image URL */}
          <div className="pt-1 space-y-1">
            <label className="block text-slate-700 font-bold">অথবা ছবির অনলাইন লিংক (Image URL) দিন:</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/... বা অন্য লিংক"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3.5 py-2 rounded-xl bg-[#1f7a44] hover:bg-[#166534] text-white font-bold text-xs shadow-sm transition"
              >
                যুক্ত করুন
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Grid: Active Photos (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{activePlace?.nameBn || 'নির্বাচিত স্থান'}</span>
                <span className="text-xs text-slate-400 font-normal">({activePlace?.nameEn})</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-bengali">
                গেটের অবস্থান: {activePlace?.gate || 'ক্যাম্পাস'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {placePhotos.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                  title="ডিফল্ট ছবিতে রিসেট করুন"
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
                title="সরাসরি ম্যাপে এই স্থানের প্রিভিউ দেখুন"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>ম্যাপে প্রিভিউ ↗</span>
              </a>
            </div>
          </div>

          {/* Photos Grid */}
          {placePhotos.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <Camera className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">এই স্থানে এখনো কোনো কাস্টম ছবি আপলোড করা হয়নি।</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                বামে ফাইল সিলেক্ট করে বা লিংক দিয়ে ছবি আপলোড করলে এখানে প্রিভিউ আসবে এবং ম্যাপে তা অবিলম্বে দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
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
  );
}
