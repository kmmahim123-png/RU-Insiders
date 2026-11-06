'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';

interface TopStoryHighlightsProps {
  products: Product[];
  showViewAllButton?: boolean;
  title?: string;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
  containerClassName?: string;
  cardClassName?: string;
}

export default function TopStoryHighlights({
  products,
  showViewAllButton = true,
  title = 'কালেকশন',
  headerRight,
  children,
  containerClassName,
  cardClassName,
}: TopStoryHighlightsProps) {
  // Select products marked as story highlights or featured, falling back to top products if none marked
  const highlightProducts = React.useMemo(() => {
    const explicitlyMarked = products.filter((p) => p.isStoryHighlight === true);
    if (explicitlyMarked.length > 0) return explicitlyMarked;
    const featured = products.filter((p) => p.featured);
    if (featured.length > 0) return featured;
    return products.slice(0, 8);
  }, [products]);

  if (!products || products.length === 0) return null;

  return (
    <section className={containerClassName || "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"}>
      <div className={cardClassName || "bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-sm space-y-3"}>
        
        {/* Header: "কালেকশন" + Custom Actions or View All */}
        <div className="flex items-center justify-between px-1 gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-bengali">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {headerRight}

            {showViewAllButton && (
              <Link
                href="/shop"
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center gap-1.5 group"
              >
                <span>সবগুলো পণ্য একসাথে দেখুন</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {children}

        {/* Horizontal Scrolling Circles with Story-Ring Glow */}
        <div className="flex items-start gap-3 sm:gap-5 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
          {highlightProducts.map((product) => {
            const thumbnail = product.images?.[0] || '/mockups/hoodie-front.jpg';
            const shortName = product.nameBn || product.name;
            const displayTitle = shortName.length > 16 ? shortName.slice(0, 15) + '…' : shortName;

            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group flex flex-col items-center gap-1.5 shrink-0 focus:outline-none"
                title={product.nameBn || product.name}
              >
                {/* Glowing Story Gradient Ring */}
                <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-600 group-hover:scale-105 group-active:scale-95 transition-transform duration-300 shadow-md">
                  <div className="p-[2px] bg-white rounded-full">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100">
                      <Image
                        src={thumbnail}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Title & Price Underneath */}
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 text-center max-w-[76px] sm:max-w-[84px] truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {displayTitle}
                </span>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                  {formatBDT(product.price)}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
