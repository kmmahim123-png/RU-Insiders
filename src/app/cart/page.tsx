'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Sparkles,
  CreditCard
} from 'lucide-react';
import { CartItem } from '@/lib/types';
import { formatBDT } from '@/lib/utils';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'ru_campus_pickup' | 'rajshahi_city' | 'steadfast_courier'>('ru_campus_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash' | 'nagad'>('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Sync cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ru_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCartItems(updated);
    localStorage.setItem('ru_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('ru_cart_updated'));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('ru_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('ru_cart_updated'));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'ru_campus_pickup' ? 0 : 70;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      alert('অনুগ্রহ করে সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!customerName.trim()) {
      alert('অনুগ্রহ করে আপনার নাম দিন।');
      return;
    }

    if (cartItems.length === 0) {
      alert('আপনার কার্ট খালি!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          deliveryMethod,
          paymentMethod,
          items: cartItems,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      setConfirmedOrder(data.order);
      localStorage.removeItem('ru_cart');
      window.dispatchEvent(new Event('ru_cart_updated'));
    } catch (err: any) {
      alert(err.message || 'Error processing checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-blue-600" />
          <span>Shopping Cart & Checkout</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-bengali">
          অফিশিয়াল রাবি মার্চেন্ডাইজ অর্ডার এবং ডেলিভারি কনফার্মেশন
        </p>
      </div>

      {confirmedOrder ? (
        // ORDER PLACED CONFIRMATION
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-200 bg-white text-center max-w-xl mx-auto space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="text-xs text-slate-600 font-bengali">
              আমরা দ্রুততম সময়ে আপনার পার্সেল প্রস্তুত করছি।
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Order Number:</span>
              <span className="font-mono font-bold text-blue-600">{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Recipient:</span>
              <span className="text-slate-900 font-semibold">{confirmedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Delivery:</span>
              <span className="text-slate-800 capitalize font-medium">{confirmedOrder.deliveryMethod.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
              <span className="text-slate-700">Total Payable:</span>
              <span className="text-emerald-700 font-mono text-sm">{formatBDT(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track?orderNumber=${confirmedOrder.orderNumber}&phone=${confirmedOrder.customerPhone}`}
              className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Track Live Status (অর্ডার ট্র্যাক করুন)</span>
            </Link>

            <Link
              href="/shop"
              className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        // EMPTY CART VIEW
        <div className="glass-panel p-16 rounded-3xl border border-slate-200 bg-white text-center space-y-4 shadow-sm">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Your Cart is Currently Empty</h3>
          <p className="text-xs text-slate-500 font-bengali">
            হুডি, ড্রপ শোল্ডার অথবা কাস্টম জার্সি তৈরি করতে শপ ব্রাউজ করুন।
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99]"
            >
              <span>Browse RU Insiders Shop</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        // CART AND CHECKOUT FORM
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600 shadow-sm">
              <span className="font-semibold text-slate-900">Items in Cart ({cartItems.length})</span>
              <span className="font-mono font-bold text-slate-900">Subtotal: {formatBDT(subtotal)}</span>
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Size: <strong className="text-slate-800 font-semibold">{item.size}</strong></span>
                        <span>•</span>
                        <span>Price: <strong className="text-slate-800">{formatBDT(item.price)}</strong></span>
                      </div>
                      {item.customization?.playerName && (
                        <div className="text-[10px] text-blue-700 font-mono mt-1 font-semibold">
                          Custom: {item.customization.playerName} #{item.customization.playerNumber}
                        </div>
                      )}
                      {item.customization?.customText && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          Text: "{item.customization.customText}"
                        </div>
                      )}
                      {item.customization?.uploadedImage && (
                        <div className="text-[10px] text-indigo-700 font-semibold mt-0.5 flex items-center gap-1">
                          <span>✓ Custom Artwork/Logo Attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout & Delivery Form (Right 5 Cols) */}
          <form onSubmit={handleCheckout} className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Delivery & Contact Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Full Name (আপনার নাম)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahim Hasan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      Mobile Phone (১১ সংখ্যার মোবাইল নম্বর) <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-mono font-bold ${
                      customerPhone.length === 11 && customerPhone.startsWith('01') ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {customerPhone.length}/11
                    </span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="017XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                    className={`w-full px-3 py-2.5 rounded-xl border text-slate-900 font-mono tracking-wide focus:outline-none transition-colors ${
                      customerPhone.length === 11 && customerPhone.startsWith('01')
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                        : customerPhone.length > 0 && !customerPhone.startsWith('01')
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-bengali">
                    {customerPhone.length === 11 && customerPhone.startsWith('01') ? (
                      <span className="text-emerald-700 font-bold">সঠিক ১১ সংখ্যার মোবাইল নম্বর ✓</span>
                    ) : customerPhone.length > 0 && !customerPhone.startsWith('01') ? (
                      <span className="text-rose-600">নম্বরটি অবশ্যই 01 দিয়ে শুরু হতে হবে</span>
                    ) : (
                      <span>১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Delivery Method (ডেলিভারি মাধ্যম)</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('ru_campus_pickup')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        deliveryMethod === 'ru_campus_pickup'
                          ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">RU Campus Spot Pickup</div>
                        <div className="text-[10px] text-slate-500">প্যারিস রোড / শহীদ মিনার থেকে সংগ্রহ</div>
                      </div>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('steadfast_courier')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        deliveryMethod === 'steadfast_courier'
                          ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">Steadfast Courier (৬৪ জেলা)</div>
                        <div className="text-[10px] text-slate-500">হোম ডেলিভারি ক্যাশ অন ডেলিভারি</div>
                      </div>
                      <span className="text-blue-600 font-mono font-bold">৳70</span>
                    </button>
                  </div>
                </div>

                {deliveryMethod !== 'ru_campus_pickup' && (
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Detailed Address (ঠিকানা)</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="জেলা, থানা, বাড়ি/রোড নম্বর..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                )}

                {/* Payment Option */}
                <div className="pt-2">
                  <label className="block text-slate-700 mb-1 font-semibold">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      bKash / Nagad
                    </button>
                  </div>
                </div>

              </div>

              {/* Grand Total Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatBDT(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-xl font-black text-blue-600 font-mono">
                    {formatBDT(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || customerPhone.length !== 11 || !customerPhone.startsWith('01')}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing Order...' : 'Confirm Order • Cash on Delivery'}
              </button>

            </div>
          </form>

        </div>
      )}

    </div>
  );
}
