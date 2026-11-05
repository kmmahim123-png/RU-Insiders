'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import Link from 'next/link';

interface DirectOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  initialSize?: string;
  initialColor?: string;
}

export default function DirectOrderModal({
  product,
  isOpen,
  onClose,
  initialSize,
  initialColor,
}: DirectOrderModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || '');
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || '');
  const [quantity, setQuantity] = useState<number>(1);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'ru_campus_pickup' | 'rajshahi_city' | 'steadfast_courier'>('ru_campus_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash' | 'nagad'>('cash_on_delivery');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Initialize size and color when product opens
  React.useEffect(() => {
    if (product) {
      setSelectedSize(initialSize || product.sizes?.[0] || 'L');
      setSelectedColor(initialColor || product.colors?.[0]?.name || 'Royal Blue');
      setQuantity(1);
      setError(null);
      setConfirmedOrder(null);
    }
  }, [product, initialSize, initialColor, isOpen]);

  // Bangladeshi 11-digit phone number validation
  const phoneValidation = useMemo(() => {
    const clean = customerPhone.replace(/[^0-9]/g, '');
    const is11Digits = clean.length === 11;
    const startsWith01 = clean.startsWith('01');
    const isValid = is11Digits && startsWith01;

    let message = '';
    if (clean.length === 0) {
      message = '১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
    } else if (!startsWith01) {
      message = 'নম্বরটি অবশ্যই 01 দিয়ে শুরু হতে হবে';
    } else if (clean.length < 11) {
      message = `আরও ${11 - clean.length} টি সংখ্যা প্রয়োজন (${clean.length}/11)`;
    } else if (clean.length === 11) {
      message = 'সঠিক ১১ সংখ্যার মোবাইল নম্বর ✓';
    }

    return { clean, is11Digits, startsWith01, isValid, message };
  }, [customerPhone]);

  if (!isOpen || !product) return null;

  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const deliveryFee = deliveryMethod === 'ru_campus_pickup' ? 0 : 70;
  const grandTotal = subtotal + deliveryFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 11 digits
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setCustomerPhone(val);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('আপনার পুরো নাম লিখুন।');
      return;
    }

    if (!phoneValidation.isValid) {
      setError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (deliveryMethod !== 'ru_campus_pickup' && !customerAddress.trim()) {
      setError('ডেলিভারির সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setLoading(true);

    try {
      const orderItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/logo.png',
        size: selectedSize,
        color: selectedColor,
        quantity,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: phoneValidation.clean,
          customerAddress: customerAddress.trim() || 'RU Campus Delivery Point',
          deliveryMethod,
          paymentMethod,
          items: [orderItem],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }

      setConfirmedOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'অর্ডার করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-6 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
              <ShoppingBag className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                সরাসরি অর্ডার করুন (Instant Buy)
              </h3>
              <p className="text-[11px] text-blue-100 font-bengali">
                কার্ট ছাড়াই মাত্র ১ মিনিটে অর্ডার কনফার্ম করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Confirmed View */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                Order Placed Successfully!
              </span>
              <h4 className="text-2xl font-black text-slate-900">
                ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে!
              </h4>
              <p className="text-xs text-slate-600 font-bengali max-w-md mx-auto">
                আপনার অর্ডারের কনফার্মেশন কোড: <strong className="font-mono text-blue-700 text-sm">{confirmedOrder.orderNumber}</strong>। 
                আমাদের টিম শীঘ্রই আপনার নম্বরে কল অথবা SMS দিয়ে নিশ্চিত করবে।
              </p>
            </div>

            {/* Quick Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">{product.name}</span>
                <span className="text-slate-600">{quantity} টি</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>সাইজ ও কালার:</span>
                <span className="font-semibold text-slate-800">{selectedSize} • {selectedColor}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>গ্রাহকের নাম:</span>
                <span className="font-semibold text-slate-800">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>মোবাইল নম্বর:</span>
                <span className="font-mono font-semibold text-slate-800">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                <span>মোট প্রদেয় টাকা:</span>
                <span className="text-blue-700">{formatBDT(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/track?orderNumber=${confirmedOrder.orderNumber}&phone=${confirmedOrder.customerPhone}`}
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>অর্ডার ট্র্যাক করুন (Track Order)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                আরো কেনাকাটা করুন
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Selected Product Banner */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={product.images[0] || '/logo.png'}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-blue-600">
                  {product.category.replace('-', ' ')}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {product.name}
                </h4>
                <div className="text-sm font-black text-blue-700 mt-0.5">
                  {formatBDT(product.price)}
                </div>
              </div>
            </div>

            {/* Size & Color Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Size */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">সাইজ নির্বাচন করুন</label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === s
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-slate-700 mb-1.5 font-bold">কালার: {selectedColor}</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === c.name
                            ? 'border-blue-600 scale-110 shadow-md ring-2 ring-blue-600/30'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">অর্ডারের পরিমাণ (Quantity):</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-black flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="font-black text-slate-900 text-sm font-mono w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-black flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-600" />
                <span>আপনার তথ্য ও ডেলিভারি লোকেশন</span>
              </h5>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মাহিম হাসান"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* STRICT 11 DIGIT BANGLADESHI MOBILE NUMBER */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <span>মোবাইল নম্বর (১১ সংখ্যা) <span className="text-rose-500">*</span></span>
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    phoneValidation.isValid ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {customerPhone.length}/11
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="017XXXXXXXX"
                    value={customerPhone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-sm tracking-wide focus:outline-none transition-all ${
                      customerPhone.length === 11 && phoneValidation.isValid
                        ? 'border-emerald-500 focus:border-emerald-600 focus:bg-white bg-emerald-50/20'
                        : customerPhone.length > 0 && !phoneValidation.startsWith01
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                  {phoneValidation.isValid && (
                    <div className="absolute right-3 top-3 text-emerald-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-[11px] font-bengali ${
                    phoneValidation.isValid 
                      ? 'text-emerald-700 font-semibold' 
                      : customerPhone.length > 0 && !phoneValidation.startsWith01
                      ? 'text-rose-600 font-semibold'
                      : 'text-slate-500'
                  }`}>
                    {phoneValidation.message}
                  </span>
                </div>
              </div>

              {/* Delivery Option */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">ডেলিভারি মাধ্যম</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('ru_campus_pickup')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'ru_campus_pickup'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>ক্যাম্পাস স্পট পিকআপ</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ফ্রি (৳০)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                      শাবাশ বাংলাদেশ / প্যারিস রোড
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('steadfast_courier')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'steadfast_courier'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>স্টেডফাস্ট কুরিয়ার</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        +৳৭০
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                      রাজশাহী শহর ও সারাদেশে হোম ডেলিভারি
                    </p>
                  </button>
                </div>
              </div>

              {/* Address (if courier or city) */}
              {deliveryMethod !== 'ru_campus_pickup' && (
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">
                    ডেলিভারির সম্পূর্ণ ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="হলের নাম ও রুম নং অথবা বাসা নং, রোড নং, এলাকা..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">পেমেন্ট পদ্ধতি</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ক্যাশ অন ডেলিভারি
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    বিকাশ (bKash)
                  </button>
                </div>
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Total Price Summary Box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>পণ্যের মূল্য ({quantity} টি):</span>
                <span className="font-bold text-slate-900">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? 'ফ্রি (৳০)' : formatBDT(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-blue-200/80">
                <span>সর্বমোট বিল (Total):</span>
                <span className="text-blue-700 text-base">{formatBDT(grandTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={loading || !phoneValidation.isValid}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>অর্ডার নিশ্চিত করুন (Confirm Order) • {formatBDT(grandTotal)}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center font-bengali">
                🔒 ১০০% নিরাপদ চেকআউট • প্রোডাক্ট হাতে পেয়ে মূল্য পরিশোধের সুবিধা
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

