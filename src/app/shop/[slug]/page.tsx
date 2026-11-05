'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
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
  Loader2,
  Play,
  Zap
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/mockups/hoodie-front.jpg');
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
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
              setActiveImage(found.images[0] || '/mockups/hoodie-front.jpg');
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
      <div className="min-h-[50vh] flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleColorSelect = (colorName: string, index: number) => {
    setSelectedColor(colorName);
    // Switch image to corresponding color photo slot if available
    if (product.images && product.images[index]) {
      setActiveImage(product.images[index]);
      setActiveMediaType('image');
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('অনুগ্রহ করে একটি সাইজ (যেমন: M, L, XL, XXL) নির্বাচন করুন।');
      return;
    }

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

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('অনুগ্রহ করে একটি সাইজ (যেমন: M, L, XL, XXL) নির্বাচন করুন।');
      return;
    }

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

    // Direct transition to clean checkout page without floating modals
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Store Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Images & Video Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-slate-200 bg-black/5 shadow-md">
            {activeMediaType === 'video' && product.video ? (
              <video
                src={product.video}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover object-center bg-black"
              />
            ) : (
              <img
                src={activeImage}
                alt={product.name}
                onError={() => setActiveImage('/mockups/hoodie-front.jpg')}
                className="w-full h-full object-cover object-center bg-white"
              />
            )}
            
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm z-10">
                {product.badge}
              </span>
            )}

            {product.video && activeMediaType === 'image' && (
              <button
                onClick={() => setActiveMediaType('video')}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-black transition-all z-10"
              >
                <Play className="h-3.5 w-3.5 fill-white text-white" />
                <span>ভিডিও প্লে করুন</span>
              </button>
            )}
          </div>

          {/* Thumbnails (Supports up to 4 Images + Video) */}
          <div className="flex flex-wrap items-center gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveMediaType('image');
                  setActiveImage(img);
                }}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeMediaType === 'image' && activeImage === img
                    ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-500/30'
                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                  className="w-full h-full object-cover bg-white"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white font-mono px-1 rounded">
                  #{idx + 1}
                </span>
              </button>
            ))}

            {/* Video Thumbnail Button */}
            {product.video && (
              <button
                onClick={() => setActiveMediaType('video')}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex flex-col items-center justify-center gap-1 bg-slate-900 text-white transition-all ${
                  activeMediaType === 'video'
                    ? 'border-blue-500 scale-105 shadow-md ring-2 ring-blue-500/30'
                    : 'border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
                </div>
                <span className="text-[10px] font-bold tracking-tight">ভিডিও</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-sm text-slate-600 font-bengali">{product.nameBn}</p>
            )}
          </div>

          {/* Pricing & Stock Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
                <span>{formatBDT(product.price)}</span>
                {product.regularPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatBDT(product.regularPrice)}
                  </span>
                )}
              </div>
              {product.regularPrice && (
                <span className="text-xs text-emerald-600 font-semibold">
                  Save {formatBDT(product.regularPrice - product.price)}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Check className="h-3.5 w-3.5" />
                <span>ইন স্টক ({product.stock})</span>
              </span>
            </div>
          </div>

          {/* Color Selector (Interactive with Photo Switching) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                রং নির্বাচন করুন (Color): <strong className="text-slate-900">{selectedColor}</strong>
              </label>
              <span className="text-[11px] text-blue-600 font-medium">ক্লিক করলে ছবি পরিবর্তন হবে</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => handleColorSelect(c.name, idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    selectedColor === c.name
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
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
              <label className="text-xs font-semibold text-slate-700">
                Size: <strong className="text-slate-900">{selectedSize}</strong>
              </label>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
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
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Quantity</label>
            <div className="flex items-center w-32 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs: Direct Order & Add to Cart */}
          <div className="space-y-3 pt-2">
            {/* Primary Direct Order / Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>সরাসরি অর্ডার করুন (Buy Now) • {formatBDT(product.price * quantity)}</span>
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              {addedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>কার্টে যুক্ত হয়েছে! (Added to Cart)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>কার্টে যোগ করুন (Add to Cart)</span>
                </>
              )}
            </button>

            {product.isCustomizable && (
              <Link
                href={`/customize?garment=${product.category === 'jerseys' ? 'jersey' : product.category === 'hoodies' ? 'hoodie' : 'dropshoulder'}&product=${product.id}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Customize with Name & Number</span>
              </Link>
            )}
          </div>

          {/* Product Description */}
          <div className="pt-4 border-t border-slate-200 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Overview & Fabric</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bengali">
              {product.description}
            </p>
            {product.fabricSpecs && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
                <strong>Fabric Specs:</strong> {product.fabricSpecs}
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Campus Spot Pickup at Paris Road or Steadfast Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Quality Checked & Pre-Shrunk Fabric</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
