'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ShoppingBag, 
  Check, 
  Layers, 
  Type, 
  Shield, 
  Palette, 
  UploadCloud, 
  Trash2, 
  MoveVertical, 
  ZoomIn, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { CustomizerState } from '@/lib/types';

interface CustomizerProps {
  initialGarment?: 'jersey' | 'dropshoulder' | 'hoodie' | 'tshirt';
  onAddToCart?: (item: any) => void;
}

export default function CustomizerCanvas({ initialGarment = 'hoodie', onAddToCart }: CustomizerProps) {
  const [state, setState] = useState<CustomizerState>({
    garmentType: initialGarment,
    color: '#1d4ed8', // Default RU Royal Blue
    size: 'L',
    view: 'front',
    playerName: 'RU INSIDER',
    playerNumber: '26',
    chestLogo: 'ru-monogram',
    customText: 'UNIVERSITY OF RAJSHAHI',
    textColor: '#ffffff',
    textSize: 16,
    textPosition: 'center',
    uploadedImage: undefined,
    uploadedImageScale: 1,
    uploadedImagePosition: { x: 0, y: 0 },
    fontStyle: 'sports',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrices: Record<string, number> = {
    jersey: 650,
    dropshoulder: 580,
    hoodie: 1150,
    tshirt: 390,
  };

  const customizationFee = 
    (state.customText ? 50 : 0) + 
    (state.uploadedImage ? 70 : 0) + 
    (state.playerName ? 50 : 0) + 
    (state.playerNumber ? 50 : 0);

  const totalPrice = (basePrices[state.garmentType] || 600) + customizationFee;

  const garmentColors = [
    { name: 'Royal Blue', hex: '#1d4ed8' },
    { name: 'Heritage Maroon', hex: '#881337' },
    { name: 'Stealth Black', hex: '#18181b' },
    { name: 'Campus Navy', hex: '#1e3a8a' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Forest Green', hex: '#064e3b' },
    { name: 'Slate Grey', hex: '#64748b' },
    { name: 'Pure White', hex: '#ffffff' },
  ];

  const textColors = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Golden Yellow', hex: '#facc15' },
    { name: 'Pitch Black', hex: '#0f172a' },
    { name: 'Crimson Red', hex: '#ef4444' },
    { name: 'Sky Blue', hex: '#38bdf8' },
  ];

  // Garment mockup images
  const mockupImages: Record<string, string> = {
    hoodie: '/mockups/hoodie-front.jpg',
    tshirt: '/mockups/t-shirt-front.jpg',
    dropshoulder: '/mockups/drop-shoulder-front.jpg',
    jersey: '/mockups/jersey-front.jpg',
  };

  const currentMockup = mockupImages[state.garmentType] || '/mockups/hoodie-front.jpg';

  // Handle direct file upload for custom PNG/artwork
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Local instant preview via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setState((prev) => ({
        ...prev,
        uploadedImage: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Also upload to /api/upload for persistent server storage
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setState((prev) => ({
          ...prev,
          uploadedImage: data.url,
        }));
      }
    } catch (err) {
      console.error('Failed to upload image to server:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeUploadedImage = () => {
    setState((prev) => ({
      ...prev,
      uploadedImage: undefined,
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCart = () => {
    const customizedItem = {
      id: `custom-${Date.now()}`,
      productId: `custom-${state.garmentType}`,
      name: `Custom ${state.garmentType.toUpperCase()} (${state.customText || state.playerName || 'RU Insiders'})`,
      price: totalPrice,
      image: state.uploadedImage || currentMockup,
      size: state.size,
      color: state.color,
      quantity: 1,
      customization: {
        playerName: state.playerName,
        playerNumber: state.playerNumber,
        chestLogo: state.chestLogo,
        garmentType: state.garmentType,
        customText: state.customText,
        textColor: state.textColor,
        uploadedImage: state.uploadedImage,
        view: state.view,
      },
    };

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
      
      {/* Visual Canvas Stage (Left 7 Cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full relative bg-white rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center min-h-[460px] sm:min-h-[580px] border border-slate-200 overflow-hidden shadow-md">
          
          {/* View Toggle Bar (Front / Back) */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
            <button
              onClick={() => setState({ ...state, view: 'front' })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                state.view === 'front' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Front (সামনে)
            </button>
            <button
              onClick={() => setState({ ...state, view: 'back' })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                state.view === 'back' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Back (পেছনে)
            </button>
          </div>

          {/* Badge indicator in top right */}
          <div className="absolute top-4 right-4 z-30">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Realistic Studio Mockup
            </span>
          </div>

          {/* 2D APPAREL MOCKUP CONTAINER - ONLY GARMENT CHANGES COLOR */}
          <div className="relative w-[300px] h-[370px] sm:w-[420px] sm:h-[510px] flex items-center justify-center select-none">
            
            {/* SVG Vector Garment Simulation Layer (Canvas remains clean white; color applies strictly to garment path) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                viewBox="0 0 400 460"
                className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-colors duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Garment Silhouette Path */}
                {state.garmentType === 'hoodie' ? (
                  <g>
                    {/* Hood shape */}
                    <path
                      d="M 140 70 C 130 15, 270 15, 260 70 C 240 60, 160 60, 140 70 Z"
                      fill={state.color}
                      filter="brightness(0.85)"
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="1.5"
                    />
                    {/* Hoodie Silhouette */}
                    <path
                      d="M 120 70 L 40 135 L 75 195 L 115 170 L 115 410 L 285 410 L 285 170 L 325 195 L 360 135 L 280 70 C 250 85, 150 85, 120 70 Z"
                      fill={state.color}
                      stroke="rgba(0,0,0,0.18)"
                      strokeWidth="2"
                    />
                    {/* Kangaroo Pocket */}
                    {state.view === 'front' && (
                      <path
                        d="M 145 280 L 175 250 L 225 250 L 255 280 L 255 370 L 145 370 Z"
                        fill={state.color}
                        filter="brightness(0.92)"
                        stroke="rgba(0,0,0,0.12)"
                        strokeWidth="2"
                      />
                    )}
                    {/* Drawstrings */}
                    {state.view === 'front' && (
                      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.95">
                        <path d="M 185 85 Q 180 120 182 145" />
                        <path d="M 215 85 Q 220 120 218 145" />
                      </g>
                    )}
                  </g>
                ) : state.garmentType === 'dropshoulder' ? (
                  <g>
                    {/* Drop shoulder silhouette */}
                    <path
                      d="M 125 55 L 15 140 L 55 200 L 105 170 L 105 425 L 295 425 L 295 170 L 345 200 L 385 140 L 275 55 C 245 80, 155 80, 125 55 Z"
                      fill={state.color}
                      stroke="rgba(0,0,0,0.18)"
                      strokeWidth="2"
                    />
                    {/* Drop shoulder seam lines */}
                    <path d="M 75 105 L 60 180" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
                    <path d="M 325 105 L 340 180" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
                    {/* Crew Collar */}
                    <path
                      d="M 145 58 C 170 82, 230 82, 255 58 C 235 72, 165 72, 145 58 Z"
                      fill="#ffffff"
                      opacity="0.3"
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : state.garmentType === 'jersey' ? (
                  <g>
                    {/* Jersey Silhouette */}
                    <path
                      d="M 120 50 L 30 125 L 70 185 L 110 160 L 110 420 L 290 420 L 290 160 L 330 185 L 370 125 L 280 50 C 250 75, 150 75, 120 50 Z"
                      fill={state.color}
                      stroke="rgba(0,0,0,0.18)"
                      strokeWidth="2"
                    />
                    {/* Contrast Collar */}
                    <path
                      d="M 145 53 C 170 78, 230 78, 255 53 C 235 68, 165 68, 145 53 Z"
                      fill="#ffffff"
                      opacity="0.95"
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="1.5"
                    />
                    {/* Jersey Gold Stripes */}
                    <g fill="#facc15" opacity="0.95">
                      <path d="M 112 165 L 112 420 L 122 420 L 122 170 Z" />
                      <path d="M 288 165 L 288 420 L 278 420 L 278 170 Z" />
                    </g>
                  </g>
                ) : (
                  <g>
                    {/* Classic Ganji / T-Shirt Silhouette */}
                    <path
                      d="M 120 50 L 35 120 L 75 180 L 112 160 L 112 420 L 288 420 L 288 160 L 325 180 L 365 120 L 280 50 C 250 72, 150 72, 120 50 Z"
                      fill={state.color}
                      stroke="rgba(0,0,0,0.18)"
                      strokeWidth="2"
                    />
                    {/* Ribbed Collar */}
                    <path
                      d="M 145 53 C 170 75, 230 75, 255 53 C 235 65, 165 65, 145 53 Z"
                      fill="#ffffff"
                      opacity="0.25"
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="1.5"
                    />
                    {/* Sleeve Seams */}
                    <path d="M 75 180 L 112 160" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
                    <path d="M 325 180 L 288 160" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
                  </g>
                )}
              </svg>
            </div>

            {/* FRONT VIEW DESIGN LAYER */}
            {state.view === 'front' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
                
                {/* Upper Chest RU Logo (if enabled) */}
                {state.chestLogo === 'ru-monogram' && (
                  <div className="absolute top-[28%] sm:top-[26%] flex items-center justify-center transition-all">
                    <img
                      src="/logo.png"
                      alt="RU Logo"
                      className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                )}

                {state.chestLogo === 'shabash-bangladesh' && (
                  <div className="absolute top-[28%] sm:top-[26%] px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-center drop-shadow-md">
                    <div className="text-yellow-400 font-bold text-[11px] sm:text-xs">শাবাশ বাংলাদেশ</div>
                    <div className="text-white text-[8px] sm:text-[9px] font-semibold tracking-wider">RAJSHAHI UNIVERSITY</div>
                  </div>
                )}

                {state.chestLogo === 'ru-paris-road' && (
                  <div className="absolute top-[28%] sm:top-[26%] text-center drop-shadow-md">
                    <div className="text-white font-black tracking-widest text-xs sm:text-sm">PARIS ROAD</div>
                    <div className="h-0.5 w-16 bg-yellow-400 mx-auto my-0.5"></div>
                    <div className="text-slate-100 text-[8px] tracking-widest">ESTD. 1953</div>
                  </div>
                )}

                {/* USER UPLOADED PNG IMAGE / DESIGN ON MOCKUP */}
                {state.uploadedImage && (
                  <div 
                    className="absolute z-25 flex items-center justify-center transition-all duration-200"
                    style={{
                      top: state.textPosition === 'chest' ? '46%' : '38%',
                      transform: `scale(${state.uploadedImageScale || 1}) translate(${state.uploadedImagePosition?.x || 0}px, ${state.uploadedImagePosition?.y || 0}px)`,
                    }}
                  >
                    <img
                      src={state.uploadedImage}
                      alt="Custom design"
                      className="max-w-[120px] max-h-[120px] sm:max-w-[170px] sm:max-h-[170px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                    />
                  </div>
                )}

                {/* CUSTOM TYPOGRAPHY TEXT ON MOCKUP */}
                {state.customText && (
                  <div
                    className="absolute z-25 text-center font-bold tracking-wider transition-all duration-200 max-w-[220px] sm:max-w-[280px]"
                    style={{
                      top: state.textPosition === 'chest' 
                        ? '32%' 
                        : state.uploadedImage 
                        ? '62%' 
                        : '48%',
                      color: state.textColor,
                      fontSize: `${state.textSize}px`,
                      fontFamily: state.fontStyle === 'sports' ? 'sans-serif' : state.fontStyle === 'serif' ? 'serif' : 'monospace',
                      textShadow: state.textColor === '#ffffff' ? '0 2px 6px rgba(0,0,0,0.7)' : '0 1px 3px rgba(255,255,255,0.4)',
                    }}
                  >
                    {state.customText}
                  </div>
                )}

              </div>
            )}

            {/* BACK VIEW DESIGN LAYER */}
            {state.view === 'back' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
                
                {/* Back Player Name */}
                {state.playerName && (
                  <div 
                    className="absolute top-[28%] text-center uppercase font-black tracking-widest text-lg sm:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                    style={{ color: state.textColor }}
                  >
                    {state.playerName}
                  </div>
                )}

                {/* Back Player Number */}
                {state.playerNumber && (
                  <div 
                    className="absolute top-[42%] text-center font-black text-6xl sm:text-8xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-mono"
                    style={{ color: state.textColor }}
                  >
                    {state.playerNumber}
                  </div>
                )}

                {/* Subtitle RU Emblem on back */}
                <div className="absolute bottom-[20%] text-[10px] text-white/80 font-bold uppercase tracking-widest drop-shadow">
                  RU INSIDERS • RAJSHAHI
                </div>

              </div>
            )}

          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              💡 আপনি যা দেখছেন, ঠিক সেভাবেই সরাসরি ফেব্রিকে প্রিন্ট ও এমব্রয়ডারি হবে।
            </span>
          </div>

        </div>
      </div>

      {/* Configuration & Customization Controls (Right 5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Garment Selector & Pricing Header */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                CUSTOM APPAREL STUDIO
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Personalized RU Apparel
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-blue-600 font-mono">
                {formatBDT(totalPrice)}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">কাস্টম প্রিন্টিং সহ</span>
            </div>
          </div>

          {/* Garment Type Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">পোশাকের ধরন নির্বাচন করুন:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'hoodie', name: 'Winter Hoodie', bn: 'শীতের হুডি', price: 1150 },
                { id: 'tshirt', name: 'Classic Ganji/Tee', bn: 'কটন গেঞ্জি', price: 390 },
                { id: 'dropshoulder', name: 'Drop Shoulder', bn: 'ড্রপ শোল্ডার', price: 580 },
                { id: 'jersey', name: 'Sports Jersey', bn: 'স্পোর্টস জার্সি', price: 650 },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setState({ ...state, garmentType: g.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    state.garmentType === g.id
                      ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{g.name}</div>
                  <div className="text-[10px] text-slate-500">{g.bn}</div>
                  <div className="font-mono font-bold text-blue-600 text-[11px] mt-0.5">৳{g.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>ফেব্রিকের রং নির্বাচন করুন:</span>
              <span className="text-blue-600 font-semibold">{garmentColors.find(c => c.hex === state.color)?.name}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {garmentColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setState({ ...state, color: c.hex })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    state.color === c.hex ? 'border-blue-600 scale-110 shadow-md ring-2 ring-blue-300' : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Sizing Picker */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700">সাইজ নির্বাচন করুন:</label>
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {['M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setState({ ...state, size: sz })}
                  className={`py-2 rounded-xl border transition-all ${
                    state.size === sz
                      ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CUSTOM ARTWORK / PNG UPLOAD ACCORDION (USER REQUESTED) */}
        <div className="glass-panel p-5 rounded-3xl border border-blue-200 bg-blue-50/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-blue-600" />
              <span>নিজের ডিজাইন / PNG ছবি বসান (Upload Artwork)</span>
            </h3>
            {state.uploadedImage && (
              <button
                onClick={removeUploadedImage}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="h-3 w-3" /> রিমুভ
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-600 font-bengali">
            মোবাইল বা ল্যাপটপ থেকে আপনার ডিপার্টমেন্টের লোগো, ব্যাচ ডিজাইন বা যেকোনো PNG আর্টওয়ার্ক আপলোড করুন। এটি সরাসরি মকআপের উপর বসে যাবে!
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!state.uploadedImage ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-600 bg-white text-slate-700 flex flex-col items-center justify-center gap-2 text-xs transition-all shadow-sm"
            >
              {uploadingImage ? (
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>ছবি আপলোড হচ্ছে...</span>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-slate-900">গ্যালারি / পিসি থেকে PNG বা ছবি নির্বাচন করুন</div>
                  <div className="text-[10px] text-slate-400">PNG, JPG, SVG • Transparent PNG সবচেয়ে সুন্দর দেখায়</div>
                </>
              )}
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={state.uploadedImage}
                  alt="Thumb"
                  className="w-14 h-14 rounded-xl object-contain border border-slate-200 bg-slate-50 p-1"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">ডিজাইন যুক্ত করা হয়েছে!</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">মকআপের উপর লাইভ দেখতে পাচ্ছেন</div>
                </div>
              </div>

              {/* Artwork Size Scale Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>ছবির সাইজ (Scale):</span>
                  <span>{Math.round((state.uploadedImageScale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={state.uploadedImageScale || 1}
                  onChange={(e) => setState({ ...state, uploadedImageScale: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* CUSTOM TEXT & TYPOGRAPHY CARD */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Type className="h-4 w-4 text-blue-600" />
            <span>পোশাকের লেখা ও ডিপার্টমেন্টের নাম (Custom Text)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">
                সামনের লেখা (Custom Slogan/Dept):
              </label>
              <input
                type="text"
                placeholder="যেমন: DEPARTMENT OF CSE বা RU INSIDERS"
                value={state.customText}
                onChange={(e) => setState({ ...state, customText: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Text Color Picker */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">লেখার রং (Text Color):</label>
              <div className="flex items-center gap-2">
                {textColors.map((tc) => (
                  <button
                    key={tc.name}
                    type="button"
                    onClick={() => setState({ ...state, textColor: tc.hex })}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                      state.textColor === tc.hex
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 border border-slate-300"
                      style={{ backgroundColor: tc.hex }}
                    />
                    <span>{tc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Back View: Player Name & Number */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-slate-700 font-bold">পেছনের নাম ও নম্বর (Back Name & Number):</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="নাম (e.g. MAHIM)"
                    value={state.playerName}
                    onChange={(e) => setState({ ...state, playerName: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="নম্বর (e.g. 07)"
                    value={state.playerNumber}
                    onChange={(e) => setState({ ...state, playerNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Official Logo Choice */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-semibold mb-1">অফিশিয়াল লোগো ব্যাজ:</label>
              <select
                value={state.chestLogo}
                onChange={(e) => setState({ ...state, chestLogo: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="ru-monogram">রাবি অফিশিয়াল লোগো (RU Official Crest)</option>
                <option value="shabash-bangladesh">শাবাশ বাংলাদেশ ব্যাজ</option>
                <option value="ru-paris-road">প্যারিস রোড - ১৯৫৩ সিগনেচার</option>
                <option value="none">কোনো লোগো নয় (শুধুমাত্র আমার ছবি/ডিজাইন)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Action Button: Add to Cart & Checkout */}
        <div className="space-y-3">
          <button
            onClick={handleAddCart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            {addedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added to Cart! (কার্টে যুক্ত হয়েছে)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Confirm Custom Design & Order • {formatBDT(totalPrice)}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 font-bengali">
            অর্ডার করার পর আমাদের প্রোডাকশন টিম আপনার ডিজাইন অনুযায়ী পোশাক তৈরি করে ক্যাম্পাসে বা কুরিয়ারে পৌঁছে দেবে।
          </p>
        </div>

      </div>

    </div>
  );
}
