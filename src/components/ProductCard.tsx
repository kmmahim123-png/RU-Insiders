'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Play, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(product.images[0] || '/mockups/hoodie-front.jpg');
  const [isHovered, setIsHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const hasPlayableVideo = Boolean(product.video && !videoFailed);
  const displayImage = isHovered && product.images && product.images[1] ? product.images[1] : imageSrc;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      
      {/* Media Container with Badges - Lock to aspect-[4/5] bg-slate-50 */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50 block cursor-pointer">
        {hasPlayableVideo ? (
          <div className="relative w-full h-full">
            <video
              src={product.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onError={() => setVideoFailed(true)}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
              <Play className="h-2.5 w-2.5 fill-white" />
              <span>Video</span>
            </div>
          </div>
        ) : (
          <img
            src={displayImage}
            alt={product.name}
            onError={() => setImageSrc('/mockups/hoodie-front.jpg')}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Regular Price Discount Chip */}
        {!hasPlayableVideo && product.regularPrice && product.regularPrice > product.price && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            SAVE {formatBDT(product.regularPrice - product.price)}
          </div>
        )}

        {/* Color Palette Indicators */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute bottom-2.5 left-2.5 flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm z-10"
        >
          {product.colors.slice(0, 4).map((c, idx) => (
            <button
              key={idx}
              type="button"
              title={c.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.images[idx]) {
                  setImageSrc(product.images[idx]);
                }
              }}
              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner hover:scale-125 transition-transform"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-slate-600 font-bold pr-1">+{product.colors.length - 4}</span>
          )}
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-blue-600 font-bold mb-0.5">
            {product.category.replace('-', ' ')}
          </div>
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.nameBn && (
            <p className="text-[11px] text-slate-500 mt-0.5 font-bengali line-clamp-1">
              {product.nameBn}
            </p>
          )}
        </Link>

        {/* Pricing and Action Links */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Link href={`/shop/${product.slug}`} className="flex flex-col">
            {product.regularPrice && product.regularPrice > product.price ? (
              <div className="flex flex-col">
                {/* 1. Prothom a akdom lal rong a dam kata thakbe */}
                <div className="text-[11px] sm:text-xs text-rose-600 font-bold line-through tracking-tight leading-none mb-0.5">
                  {formatBDT(product.regularPrice)}
                </div>
                {/* 2. Nicha asol price sobuj rong a thakbe */}
                <div className="text-sm sm:text-base font-black text-emerald-600 leading-tight">
                  {formatBDT(product.price)}
                </div>
              </div>
            ) : (
              <div className="text-sm sm:text-base font-black text-emerald-600 leading-tight">
                {formatBDT(product.price)}
              </div>
            )}
            <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
              <Check className="h-3 w-3" />
              <span>ইন স্টক ({product.stock})</span>
            </div>
          </Link>

          {/* Action Buttons: Navigates directly to dedicated Product Detail View */}
          <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
            <Link
              href={`/shop/${product.slug}`}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap"
              title="পণ্যের ছবি, ভিডিও ও সম্পূর্ণ বিবরণ দেখুন"
            >
              <ShoppingBag className="h-3 w-3" />
              <span>অর্ডার / বিবরণ</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
