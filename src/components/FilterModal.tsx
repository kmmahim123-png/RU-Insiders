'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { ProductCategory } from '@/lib/types';
import { formatBDT } from '@/lib/utils';

export interface FilterState {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  onlyCustomizable: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  totalMatches: number;
  categoriesList?: { id: ProductCategory; label: string; bn?: string }[];
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalMatches,
  categoriesList,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  if (!isOpen) return null;

  const defaultCategories: { id: ProductCategory; label: string; bn?: string }[] = [
    { id: 'all', label: 'All Items', bn: 'সব পণ্য' },
    { id: 'hoodies', label: 'Winter Hoodies', bn: 'শীতের হুডি' },
    { id: 'drop-shoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার' },
    { id: 'jerseys', label: 'Custom Jerseys', bn: 'কাস্টম জার্সি' },
    { id: 't-shirts', label: 'T-Shirts (গেঞ্জি)', bn: 'কটন গেঞ্জি' },
    { id: 'accessories', label: 'Accessories', bn: 'এক্সেসরিজ' },
  ];

  const categories = categoriesList && categoriesList.length > 0 ? categoriesList : defaultCategories;

  const pricePresets = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Under ৳500', min: 0, max: 500 },
    { label: '৳500 – ৳1,000', min: 500, max: 1000 },
    { label: '৳1,000 – ৳2,000', min: 1000, max: 2000 },
    { label: 'Above ৳2,000', min: 2000, max: 10000 },
  ];

  const handleReset = () => {
    const defaultState: FilterState = {
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      onlyCustomizable: false,
      sortBy: 'featured',
    };
    setLocalFilters(defaultState);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-250">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Filter Products (পণ্য ফিল্টার)
              </h3>
              <p className="text-xs text-slate-500 font-bengali">
                ক্যাটাগরি এবং মূল্যসীমা পছন্দমতো নির্ধারণ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Category (ক্যাটাগরি)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, category: cat.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    localFilters.category === cat.id
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 font-bengali">{cat.bn}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Price Range (মূল্যসীমা)
              </label>
              <span className="text-xs font-mono font-bold text-blue-600">
                {formatBDT(localFilters.minPrice)} – {localFilters.maxPrice >= 10000 ? '৳10,000+' : formatBDT(localFilters.maxPrice)}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {pricePresets.map((preset, idx) => {
                const isSelected =
                  localFilters.minPrice === preset.min && localFilters.maxPrice === preset.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        minPrice: preset.min,
                        maxPrice: preset.max,
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="block text-slate-500 mb-1">Min Price (৳)</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, minPrice: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <span className="block text-slate-500 mb-1">Max Price (৳)</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, maxPrice: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Customizable Only Toggle */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() =>
                setLocalFilters({
                  ...localFilters,
                  onlyCustomizable: !localFilters.onlyCustomizable,
                })
              }
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                localFilters.onlyCustomizable
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${localFilters.onlyCustomizable ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Customizable Only (কাস্টমাইজযোগ্য)</div>
                  <div className="text-[11px] text-slate-500 font-bengali">নিজের নাম ও নম্বর বসানোর উপযোগী পোশাক</div>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                localFilters.onlyCustomizable ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'
              }`}>
                {localFilters.onlyCustomizable && <Check className="h-3 w-3" />}
              </div>
            </button>
          </div>

          {/* 4. Sort Options */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sort By (সাজানোর ক্রম)
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'price-asc', label: 'Price: Low' },
                { id: 'price-desc', label: 'Price: High' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: s.id as any })}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-all ${
                    localFilters.sortBy === s.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset (মুছে ফেলুন)</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <span>Apply Filters ({totalMatches} Products)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
