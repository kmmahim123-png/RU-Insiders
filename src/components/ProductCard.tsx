'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Play, ShoppingBag, X, Volume2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(product.images[0] || '/mockups/hoodie-front.jpg');
  const [isHovered, setIsHovered] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = Boolean(product.video && product.video.trim());
  const displayImage = isHovered && product.images && product.images[1] ? product.images[1] : imageSrc;

  // Auto-play muted video smoothly on hover or when visible
  useEffect(() => {
    if (videoRef.current && hasVideo) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, hasVideo]);

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300"
      >
        
        {/* Media Container with Badges - Lock to aspect-[4/5] bg-slate-50 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50 block">
          
          <Link href={`/shop/${product.slug}`} className="block w-full h-full">
            {hasVideo && isHovered ? (
              <video
                ref={videoRef}
                src={product.video}
                poster={product.images[0] || '/mockups/hoodie-front.jpg'}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <img
                src={displayImage}
                alt={product.name}
                onError={() => setImageSrc('/mockups/hoodie-front.jpg')}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
          </Link>
          
          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.badge && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Video Preview Button Overlay */}
          {hasVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVideoModalOpen(true);
              }}
              className="absolute top-2.5 right-2.5 bg-slate-950/80 hover:bg-blue-600 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/20 transition-all z-10 hover:scale-105"
              title="ভিডিও প্লে করুন"
            >
              <Play className="h-3 w-3 fill-white text-white" />
              <span>ভিডিও</span>
            </button>
          )}

          {/* Regular Price Discount Chip (if no video badge in top right) */}
          {!hasVideo && product.regularPrice && product.regularPrice > product.price && (
            <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
              SAVE {formatBDT(product.regularPrice - product.price)}
            </div>
          )}

          {/* Color Palette Indicators */}
          {product.colors && product.colors.length > 0 && (
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
          )}
        </div>

        {/* Product Content Details */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                {product.category.replace(/-/g, ' ')}
              </span>
              {product.isCustomizable && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  Customizable
                </span>
              )}
            </div>

            <Link href={`/shop/${product.slug}`} className="block group-hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                {product.name}
              </h3>
              {product.nameBn && (
                <p className="text-xs text-slate-500 font-bengali line-clamp-1">
                  {product.nameBn}
                </p>
              )}
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">
                {formatBDT(product.price)}
              </span>
              {product.regularPrice && product.regularPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatBDT(product.regularPrice)}
                </span>
              )}
            </div>

            <Link
              href={`/shop/${product.slug}`}
              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white transition-colors shadow-sm"
              title="অর্ডার করুন"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Video Modal Player (Opens on click of video button on homepage/shop) */}
      {videoModalOpen && hasVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col">
            
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-400 fill-blue-400" />
                <span className="text-xs sm:text-sm font-bold truncate max-w-sm sm:max-w-md">
                  {product.name} - প্রোডাক্ট ভিডিও
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={product.video}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                মূল্য: {formatBDT(product.price)}
              </span>
              <Link
                href={`/shop/${product.slug}`}
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>অর্ডার পেজে যান</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
