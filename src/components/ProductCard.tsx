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
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/50">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Customizable
            </span>
          )}
        </div>

        {/* Regular Price Discount Chip */}
        {product.regularPrice && product.regularPrice > product.price && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            SAVE {formatBDT(product.regularPrice - product.price)}
          </div>
        )}

        {/* Color Palette Indicators */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 p-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800">
          {product.colors.slice(0, 4).map((c, idx) => (
            <span
              key={idx}
              title={c.name}
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-slate-300 pr-1">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
            {product.category.replace('-', ' ')}
          </div>
          <h3 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.nameBn && (
            <p className="text-xs text-slate-400 mt-0.5 font-bengali line-clamp-1">
              {product.nameBn}
            </p>
          )}
        </div>

        {/* Pricing and Action Link */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white flex items-baseline gap-1.5">
              <span>{formatBDT(product.price)}</span>
              {product.regularPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formatBDT(product.regularPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>In Stock ({product.stock})</span>
            </div>
          </div>

          {product.isCustomizable ? (
            <Link
              href={`/customize?garment=${product.category === 'jerseys' ? 'jersey' : product.category === 'hoodies' ? 'hoodie' : 'dropshoulder'}&product=${product.id}`}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Customize</span>
            </Link>
          ) : (
            <Link
              href={`/shop/${product.slug}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
