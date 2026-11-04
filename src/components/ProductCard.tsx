'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100/60">
        <img
          src={product.images[0] || '/logo.png'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-amber-500/40">
              <Sparkles className="h-3 w-3" />
              কাস্টমাইজেবল
            </span>
          )}
        </div>

        {/* Regular Price Discount Chip */}
        {product.regularPrice && product.regularPrice > product.price && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            SAVE {formatBDT(product.regularPrice - product.price)}
          </div>
        )}

        {/* Color Palette Indicators */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
          {product.colors.slice(0, 4).map((c, idx) => (
            <span
              key={idx}
              title={c.name}
              className="w-3 h-3 rounded-full border border-slate-300 shadow-inner"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-slate-600 font-bold pr-1">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
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
        </div>

        {/* Pricing and Action Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 flex items-baseline gap-1.5">
              <span>{formatBDT(product.price)}</span>
              {product.regularPrice && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatBDT(product.regularPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <Check className="h-3 w-3" />
              <span>ইন স্টক ({product.stock})</span>
            </div>
          </div>

          {product.isCustomizable ? (
            <Link
              href={`/customize?garment=${product.category === 'jerseys' ? 'jersey' : product.category === 'hoodies' ? 'hoodie' : 'dropshoulder'}&product=${product.id}`}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition-all whitespace-nowrap"
            >
              <Sparkles className="h-3 w-3" />
              <span>বানাও</span>
            </Link>
          ) : (
            <Link
              href={`/shop/${product.slug}`}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition-colors"
              aria-label="View Details"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
