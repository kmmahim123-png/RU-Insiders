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
    if (!customerName || !customerPhone) {
      alert('অনুগ্রহ করে নাম এবং মোবাইল নম্বর দিন।');
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
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-amber-400" />
          <span>Shopping Cart & Checkout</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-bengali">
          অফিশিয়াল রাবি মার্চেন্ডাইজ অর্ডার এবং ডেলিভারি কনফার্মেশন
        </p>
      </div>

      {confirmedOrder ? (
        // ORDER PLACED CONFIRMATION
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="text-xs text-slate-300 font-bengali">
              আমরা দ্রুততম সময়ে আপনার পার্সেল প্রস্তুত করছি।
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Order Number:</span>
              <span className="font-mono font-bold text-amber-400">{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient:</span>
              <span className="text-white font-medium">{confirmedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery:</span>
              <span className="text-white capitalize">{confirmedOrder.deliveryMethod.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
              <span className="text-slate-300">Total Payable:</span>
              <span className="text-emerald-400 font-mono text-sm">{formatBDT(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track?orderNumber=${confirmedOrder.orderNumber}&phone=${confirmedOrder.customerPhone}`}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow"
            >
              <span>Track Live Status (অর্ডার ট্র্যাক করুন)</span>
            </Link>

            <Link
              href="/shop"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        // EMPTY CART VIEW
        <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center space-y-4">
          <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Your Cart is Currently Empty</h3>
          <p className="text-xs text-slate-500 font-bengali">
            হুডি, ড্রপ শোল্ডার অথবা কাস্টম জার্সি তৈরি করতে শপ ব্রাউজ করুন।
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
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
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Items in Cart ({cartItems.length})</span>
              <span className="font-mono">Subtotal: {formatBDT(subtotal)}</span>
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{item.name}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Size: <strong className="text-slate-200">{item.size}</strong></span>
                        <span>•</span>
                        <span>Price: {formatBDT(item.price)}</span>
                      </div>
                      {item.customization?.playerName && (
                        <div className="text-[10px] text-amber-400 font-mono mt-1">
                          Custom: {item.customization.playerName} #{item.customization.playerNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
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
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Delivery & Contact Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name (আপনার নাম)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahim Hasan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone (মোবাইল নম্বর)</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Delivery Method (ডেলিভারি মাধ্যম)</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('ru_campus_pickup')}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        deliveryMethod === 'ru_campus_pickup'
                          ? 'bg-rose-950/60 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">RU Campus Spot Pickup</div>
                        <div className="text-[10px] text-slate-400">প্যারিস রোড / শহীদ মিনার থেকে সংগ্রহ</div>
                      </div>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('steadfast_courier')}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        deliveryMethod === 'steadfast_courier'
                          ? 'bg-rose-950/60 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">Steadfast Courier (৬৪ জেলা)</div>
                        <div className="text-[10px] text-slate-400">হোম ডেলিভারি ক্যাশ অন ডেলিভারি</div>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">৳70</span>
                    </button>
                  </div>
                </div>

                {deliveryMethod !== 'ru_campus_pickup' && (
                  <div>
                    <label className="block text-slate-400 mb-1">Detailed Address (ঠিকানা)</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="জেলা, থানা, বাড়ি/রোড নম্বর..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Payment Option */}
                <div className="pt-2">
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-slate-800 border-amber-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-950/60 border-pink-500 text-pink-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      bKash / Nagad
                    </button>
                  </div>
                </div>

              </div>

              {/* Grand Total Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Charge:</span>
                  <span className="font-mono text-white">{formatBDT(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {formatBDT(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all active:scale-[0.98] disabled:opacity-50"
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
