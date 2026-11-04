'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShoppingBag, Check, Layers, Type, Shield, Palette } from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { CustomizerState } from '@/lib/types';

interface CustomizerProps {
  initialGarment?: 'jersey' | 'dropshoulder' | 'hoodie' | 'tshirt';
  onAddToCart?: (item: any) => void;
}

export default function CustomizerCanvas({ initialGarment = 'jersey', onAddToCart }: CustomizerProps) {
  const [state, setState] = useState<CustomizerState>({
    garmentType: initialGarment,
    color: '#881337', // Default Heritage Maroon
    size: 'L',
    view: 'front',
    playerName: 'RU INSIDER',
    playerNumber: '26',
    chestLogo: 'ru-monogram',
    customText: 'UNIVERSITY OF RAJSHAHI',
    fontStyle: 'sports',
  });

  const [addedSuccess, setAddedSuccess] = useState(false);

  // Pricing Matrix based on Garment & Customizations
  const basePrices: Record<string, number> = {
    jersey: 650,
    dropshoulder: 580,
    hoodie: 1150,
    tshirt: 390,
  };

  const customizationFee = (state.playerName ? 50 : 0) + (state.playerNumber ? 50 : 0);
  const totalPrice = (basePrices[state.garmentType] || 600) + customizationFee;

  const garmentColors = [
    { name: 'Heritage Maroon', hex: '#881337', textColor: '#f8fafc' },
    { name: 'Deep Black', hex: '#18181b', textColor: '#f8fafc' },
    { name: 'Campus Navy', hex: '#1e3a8a', textColor: '#f8fafc' },
    { name: 'Forest Green', hex: '#064e3b', textColor: '#f8fafc' },
    { name: 'Washed Ash', hex: '#64748b', textColor: '#0f172a' },
    { name: 'Royal Crimson', hex: '#9f1239', textColor: '#f8fafc' },
    { name: 'Off White', hex: '#f8fafc', textColor: '#0f172a' },
  ];

  const handleAddCart = () => {
    const customizedItem = {
      id: `custom-${Date.now()}`,
      productId: `custom-${state.garmentType}`,
      name: `Custom ${state.garmentType.toUpperCase()} (${state.playerName || 'RU INSIDER'})`,
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
      size: state.size,
      color: state.color,
      quantity: 1,
      customization: {
        playerName: state.playerName,
        playerNumber: state.playerNumber,
        chestLogo: state.chestLogo,
        garmentType: state.garmentType,
      },
    };

    // Save to localStorage
    try {
      const currentCart = JSON.parse(localStorage.getItem('ru_cart') || '[]');
      currentCart.push(customizedItem);
      localStorage.setItem('ru_cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('ru_cart_updated'));
    } catch (e) {
      console.error(e);
    }

    if (onAddToCart) {
      onAddToCart(customizedItem);
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Visual Canvas Stage (Left 7 Cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full relative glass-card rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[440px] sm:min-h-[540px] border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* View Toggle Bar (Front / Back) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg">
            <button
              onClick={() => setState({ ...state, view: 'front' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                state.view === 'front' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Front View (সামনে)
            </button>
            <button
              onClick={() => setState({ ...state, view: 'back' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                state.view === 'back' 
                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Back View (পেছনে)
            </button>
          </div>

          {/* Badge indicator in top right */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live 2D Mockup
            </span>
          </div>

          {/* SVG Vector Garment Simulation Engine */}
          <div className="relative w-[300px] h-[360px] sm:w-[380px] sm:h-[450px] transition-transform duration-300">
            <svg
              viewBox="0 0 400 460"
              className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Garment Silhouette Path */}
              {state.garmentType === 'hoodie' ? (
                // Hoodie Body with Hood
                <g>
                  {/* Hood shape */}
                  <path
                    d="M 140 70 C 130 15, 270 15, 260 70 C 240 60, 160 60, 140 70 Z"
                    fill={state.color}
                    filter="brightness(0.85)"
                  />
                  {/* Hoodie Silhouette */}
                  <path
                    d="M 120 70 L 40 135 L 75 195 L 115 170 L 115 410 L 285 410 L 285 170 L 325 195 L 360 135 L 280 70 C 250 85, 150 85, 120 70 Z"
                    fill={state.color}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                  />
                  {/* Kangaroo Pocket */}
                  {state.view === 'front' && (
                    <path
                      d="M 145 280 L 175 250 L 225 250 L 255 280 L 255 370 L 145 370 Z"
                      fill={state.color}
                      filter="brightness(0.9)"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                    />
                  )}
                  {/* Drawstrings */}
                  {state.view === 'front' && (
                    <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8">
                      <path d="M 185 85 Q 180 120 182 145" />
                      <path d="M 215 85 Q 220 120 218 145" />
                    </g>
                  )}
                </g>
              ) : (
                // Jersey / Drop-shoulder / T-Shirt
                <g>
                  <path
                    d="M 120 50 L 30 125 L 70 185 L 110 160 L 110 420 L 290 420 L 290 160 L 330 185 L 370 125 L 280 50 C 250 75, 150 75, 120 50 Z"
                    fill={state.color}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="2"
                  />
                  {/* Collar */}
                  <path
                    d="M 145 53 C 170 78, 230 78, 255 53 C 235 68, 165 68, 145 53 Z"
                    fill="#ffffff"
                    opacity={state.garmentType === 'jersey' ? "0.9" : "0.2"}
                  />
                  {/* Jersey Athletic Side Stripes */}
                  {state.garmentType === 'jersey' && (
                    <g fill="#f59e0b" opacity="0.85">
                      <path d="M 112 165 L 112 420 L 122 420 L 122 170 Z" />
                      <path d="M 288 165 L 288 420 L 278 420 L 278 170 Z" />
                    </g>
                  )}
                </g>
              )}

              {/* VIEW: FRONT DESIGN ELEMENTS */}
              {state.view === 'front' && (
                <g>
                  {/* Chest Logo Placement */}
                  {state.chestLogo === 'ru-monogram' && (
                    <g transform="translate(160, 130) scale(0.85)">
                      <circle cx="45" cy="45" r="38" fill="#f59e0b" opacity="0.95" />
                      <circle cx="45" cy="45" r="32" fill="#881337" />
                      <text x="45" y="44" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="serif">
                        RU
                      </text>
                      <text x="45" y="58" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">
                        EST. 1953
                      </text>
                    </g>
                  )}

                  {state.chestLogo === 'shabash-bangladesh' && (
                    <g transform="translate(145, 120)">
                      <rect x="0" y="0" width="110" height="70" rx="8" fill="rgba(0,0,0,0.3)" />
                      <text x="55" y="32" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                        শাবাশ বাংলাদেশ
                      </text>
                      <text x="55" y="52" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600" letterSpacing="1">
                        RAJSHAHI UNIVERSITY
                      </text>
                    </g>
                  )}

                  {state.chestLogo === 'ru-paris-road' && (
                    <g transform="translate(145, 130)">
                      <text x="55" y="25" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" letterSpacing="2">
                        PARIS ROAD
                      </text>
                      <line x1="15" y1="35" x2="95" y2="35" stroke="#f59e0b" strokeWidth="2" />
                      <text x="55" y="50" textAnchor="middle" fill="#f8fafc" fontSize="8" letterSpacing="3">
                        ESTD. 1953
                      </text>
                    </g>
                  )}

                  {/* Front Lower Text (For Drop Shoulder / Casual Tees) */}
                  <text
                    x="200"
                    y={state.garmentType === 'hoodie' ? 240 : 270}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="700"
                    letterSpacing="3"
                    opacity="0.9"
                  >
                    {state.customText}
                  </text>
                </g>
              )}

              {/* VIEW: BACK DESIGN ELEMENTS (Player Name & Number) */}
              {state.view === 'back' && (
                <g>
                  {/* Player Name Arc / Banner */}
                  <text
                    x="200"
                    y="150"
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="24"
                    fontWeight="900"
                    letterSpacing="4"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {state.playerName.toUpperCase() || 'PLAYER NAME'}
                  </text>

                  {/* Player Number Large Display */}
                  <text
                    x="200"
                    y="270"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="100"
                    fontWeight="900"
                    fontFamily="impact, sans-serif"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.9)' }}
                  >
                    {state.playerNumber || '26'}
                  </text>

                  {/* University Sub-banner */}
                  <text
                    x="200"
                    y="330"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="3"
                    opacity="0.85"
                  >
                    RAJSHAHI UNIVERSITY
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Flip Hint */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
            <span>Click Front/Back view to inspect live print on both sides</span>
          </div>

        </div>
      </div>

      {/* Control Studio Configuration (Right 5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Header & Price Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Customizer Studio
              </span>
              <h2 className="text-xl font-bold text-white">
                Personalized RU Apparel
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">
                {formatBDT(totalPrice)}
              </div>
              <span className="text-[11px] text-emerald-400">Includes Custom Printing</span>
            </div>
          </div>
        </div>

        {/* Garment Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-amber-400" />
            <span>Select Apparel Category (পোশাকের ধরন)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'jersey', label: 'Sports Jersey', bn: 'স্পোর্টস জার্সি', price: 650 },
              { id: 'dropshoulder', label: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার', price: 580 },
              { id: 'hoodie', label: 'Winter Hoodie', bn: 'শীতের হুডি', price: 1150 },
              { id: 'tshirt', label: 'Classic Ganji/Tee', bn: 'কটন গেঞ্জি', price: 390 },
            ].map((garment) => (
              <button
                key={garment.id}
                onClick={() => setState({ ...state, garmentType: garment.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  state.garmentType === garment.id
                    ? 'bg-rose-950/60 border-amber-500 text-white shadow-glow'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{garment.label}</div>
                <div className="text-[11px] text-slate-400 font-bengali">{garment.bn}</div>
                <div className="text-xs font-semibold text-amber-400 mt-1">{formatBDT(garment.price)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-amber-400" />
            <span>Choose Color Theme (রং নির্বাচন করুন)</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {garmentColors.map((col) => (
              <button
                key={col.hex}
                onClick={() => setState({ ...state, color: col.hex })}
                title={col.name}
                className={`w-9 h-9 rounded-full border-2 transition-transform ${
                  state.color === col.hex ? 'scale-125 border-amber-400 shadow-glow' : 'border-slate-700 hover:scale-110'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Select Size (সাইজ)
          </label>
          <div className="flex flex-wrap gap-2">
            {['S', 'M', 'L', 'XL', 'XXL', 'Oversized'].map((sz) => (
              <button
                key={sz}
                onClick={() => setState({ ...state, size: sz })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  state.size === sz
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Personalization Inputs: Name & Number */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Type className="h-4 w-4" />
            <span>Back Personalization (জার্সির পেছনের নাম ও নম্বর)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Your Name / Batch</label>
              <input
                type="text"
                maxLength={14}
                value={state.playerName}
                onChange={(e) => setState({ ...state, playerName: e.target.value.toUpperCase() })}
                placeholder="e.g. MAHIM"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Jersey Number</label>
              <input
                type="text"
                maxLength={3}
                value={state.playerNumber}
                onChange={(e) => setState({ ...state, playerNumber: e.target.value })}
                placeholder="e.g. 26"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Chest Emblem Badge Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-rose-400" />
            <span>Chest Emblem / Monogram (বুকের লোগো)</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'ru-monogram', label: 'RU Official Monogram', bn: 'রাবি মনোগ্রাম' },
              { id: 'shabash-bangladesh', label: 'Shabash Bangladesh', bn: 'সাবাশ বাংলাদেশ' },
              { id: 'ru-paris-road', label: 'Paris Road Minimal', bn: 'প্যারিস রোড' },
              { id: 'none', label: 'No Chest Logo', bn: 'লোগো ছাড়া' },
            ].map((emblem) => (
              <button
                key={emblem.id}
                onClick={() => setState({ ...state, chestLogo: emblem.id as any })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  state.chestLogo === emblem.id
                    ? 'bg-rose-900/40 border-rose-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-slate-200 text-xs">{emblem.label}</div>
                <div className="text-[10px] text-slate-400 font-bengali">{emblem.bn}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Add to Cart */}
        <button
          onClick={handleAddCart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all active:scale-[0.98]"
        >
          {addedSuccess ? (
            <>
              <Check className="h-5 w-5 text-emerald-950 animate-bounce" />
              <span>Added to Cart Successfully! (কার্টে যুক্ত হয়েছে)</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 text-slate-950" />
              <span>Order Custom Garment • {formatBDT(totalPrice)}</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
