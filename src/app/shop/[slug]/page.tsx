'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatBDT } from '@/lib/utils';
import { Product } from '@/lib/types';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Ruler, 
  Loader2
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/logo.png');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            const found = data.products.find((p: Product) => p.slug === resolvedParams.slug);
            if (found) {
              setProduct(found);
              setSelectedColor(found.colors[0]?.name || 'Standard');
              setSelectedSize(found.sizes[0] || 'L');
              setActiveImage(found.images[0] || '/logo.png');
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    const item = {
      id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: activeImage,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    try {
      const current = JSON.parse(localStorage.getItem('ru_cart') || '[]');
      current.push(item);
      localStorage.setItem('ru_cart', JSON.stringify(current));
      window.dispatchEvent(new Event('ru_cart_updated'));
    } catch (e) {
      console.error(e);
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Store Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Images Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-900/60 shadow-2xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-sm text-slate-300 font-bengali">{product.nameBn}</p>
            )}
          </div>

          {/* Price & Stock Display */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-white flex items-baseline gap-2">
                <span>{formatBDT(product.price)}</span>
                {product.regularPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatBDT(product.regularPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="h-3.5 w-3.5" /> In Stock ({product.stock} units available)
              </span>
            </div>

            {product.regularPrice && (
              <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold font-mono">
                SAVE {formatBDT(product.regularPrice - product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bengali">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Color: <strong className="text-amber-400">{selectedColor}</strong>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    selectedColor === c.name
                      ? 'bg-slate-800 border-amber-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Size: <strong className="text-amber-400">{selectedSize}</strong>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Asian Regular Fit
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Quantity</label>
            <div className="flex items-center w-32 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all active:scale-[0.98]"
            >
              {addedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Cart! (কার্টে যুক্ত হয়েছে)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart • {formatBDT(product.price * quantity)}</span>
                </>
              )}
            </button>

            {product.isCustomizable && (
              <Link
                href={`/customize?garment=${product.category === 'jerseys' ? 'jersey' : product.category === 'hoodies' ? 'hoodie' : 'dropshoulder'}&product=${product.id}`}
                className="w-full py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Customize with Name & Number</span>
              </Link>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-400" />
              <span>Campus Spot Pickup at Paris Road or Steadfast Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>100% Quality Checked & Pre-Shrunk Fabric</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
