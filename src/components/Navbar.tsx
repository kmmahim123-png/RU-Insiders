'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Printer, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  Facebook, 
  ShieldCheck, 
  Truck,
  Heart
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem('ru_cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          const totalQty = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('ru_cart_updated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('ru_cart_updated', updateCartCount);
    };
  }, []);

  const navLinks = [
    { label: 'Shop Merch', href: '/shop', bn: 'শপ' },
    { 
      label: 'Custom Studio', 
      href: '/customize', 
      bn: 'জার্সি ও হুডি কাস্টমাইজ', 
      highlight: true, 
      icon: Sparkles 
    },
    { 
      label: 'Print Station', 
      href: '/print-station', 
      bn: 'প্রিন্ট লাগবে', 
      badge: 'PDF Print', 
      icon: Printer 
    },
    { label: 'Track Order', href: '/track', bn: 'ট্র্যাকিং' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-xs py-1.5 px-4 text-center border-b border-rose-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-300">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            RU Insiders Official Store • মতিহার ক্যাম্পাস ও সারা বাংলাদেশে ক্যাশ অন ডেলিভারি
          </span>
          <span className="sm:hidden text-[11px] truncate mx-auto">
            RU Insiders • মতিহার ক্যাম্পাস ও সারা দেশে ক্যাশ অন ডেলিভারি
          </span>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <a 
              href="https://www.facebook.com/ru.insiders/followers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Facebook className="h-3.5 w-3.5 text-blue-400" />
              <span>Facebook Page (Followers)</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/admin" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-900 shadow-glow border-2 border-amber-400/80 p-0.5 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="RU Insiders Official Logo"
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-black text-[9px] px-1 rounded-full uppercase border border-slate-950">
                RU
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                RU Insiders
                <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-1.5 py-0.5 rounded-full font-bold hidden sm:inline-block">
                  অফিশিয়াল
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-bengali">
                রাজশাহী বিশ্ববিদ্যালয় স্টোর ও প্রিন্ট স্টেশন
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? 'bg-rose-900/40 text-amber-400 border border-rose-700/50' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  } ${link.highlight ? 'bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-300 hover:border-amber-400' : ''}`}
                >
                  {Icon && <Icon className={`h-4 w-4 ${link.highlight ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Cart & Mobile Burger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all duration-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-rose-900/40 text-amber-400 border border-rose-700/50' 
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="h-4 w-4 text-amber-400" />}
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-500 font-bengali">({link.bn})</span>
                </div>
                {link.badge && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <a
              href="https://www.facebook.com/ru.insiders/followers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-slate-300 hover:text-white bg-blue-950/30 border border-blue-900/40"
            >
              <Facebook className="h-4 w-4 text-blue-400" />
              <span>Visit RU Insiders Facebook Community</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-amber-300 hover:text-amber-200 bg-amber-950/20 border border-amber-900/40"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Admin & Operator Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
