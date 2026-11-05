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
  Compass
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
    { label: 'Shop All Merch', href: '/shop', bn: 'সব পণ্য', icon: ShoppingBag },
    { label: 'Campus Map', href: '/#campus-map', bn: 'মতিহার ম্যাপ', icon: Compass },
    { label: 'Track Order', href: '/track', bn: 'অর্ডার ট্র্যাকিং', icon: Truck },
    { label: 'Admin Portal', href: '/admin', bn: 'অ্যাডমিন প্যানেল', icon: ShieldCheck },
  ];

  // If on admin routes, hide consumer navbar to avoid duplicate header bars (checked after all hooks)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-xs py-1.5 px-4 text-center text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-200 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            RU Insiders Official Store • মতিহার ক্যাম্পাস ও সারা বাংলাদেশে ক্যাশ অন ডেলিভারি
          </span>
          <span className="sm:hidden text-[11px] truncate mx-auto font-medium">
            RU Insiders • মতিহার ক্যাম্পাস ও সারা দেশে ক্যাশ অন ডেলিভারি
          </span>
          <div className="hidden md:flex items-center gap-4 text-slate-400 text-xs">
            <a 
              href="https://www.facebook.com/ru.insiders/followers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Facebook className="h-3.5 w-3.5 text-blue-400" />
              <span>Facebook Community</span>
            </a>
            <span className="text-slate-700">|</span>
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
            <div className="group-hover:scale-105 transition-transform duration-300 shrink-0">
              <AnimatedLogo size={52} speed="normal" withBorder={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                RU Insiders
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-bold hidden sm:inline-block">
                  অফিশিয়াল
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-bengali font-medium">
                রাজশাহী বিশ্ববিদ্যালয় অফিসিয়াল মার্চেন্ডাইজ স্টোর
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
                  className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 text-slate-500" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Cart & Mobile Burger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 transition-all duration-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-400 font-bengali">({link.bn})</span>
                </div>
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href="https://www.facebook.com/ru.insiders/followers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-blue-700 hover:bg-blue-50 bg-blue-50/50 border border-blue-200 font-medium"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>Visit RU Insiders Facebook Community</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-amber-900 hover:bg-amber-100 bg-amber-50 border border-amber-200 font-medium"
            >
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>Admin & Operator Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
