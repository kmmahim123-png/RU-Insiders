'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, ShieldCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('ru_cart');
        if (saved) {
          const items = JSON.parse(saved);
          const total = items.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('ru_cart_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('ru_cart_updated', updateCount);
    };
  }, []);

  const navItems = [
    { label: 'হোম', href: '/', icon: Home },
    { label: 'শপ', href: '/shop', icon: ShoppingBag },
    { label: 'কার্ট', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'ট্র্যাক', href: '/track', icon: User },
    { label: 'অ্যাডমিন', href: '/admin', icon: ShieldCheck },
  ];

  // Hide mobile bottom nav on admin routes (checked after all hooks)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-bengali">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
