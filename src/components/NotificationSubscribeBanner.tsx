'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Sparkles, Send, Loader2 } from 'lucide-react';
import {
  isBrowserNotificationSupported,
  getNotificationPermission,
  requestBrowserNotificationPermission,
} from '@/lib/notifications';

export default function NotificationSubscribeBanner() {
  const [permission, setPermission] = useState<string>('default');
  const [loading, setLoading] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const perm = getNotificationPermission();
      setPermission(perm);
      if (localStorage.getItem('ru_push_notifications_enabled') === 'true' && perm === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  const handleEnablePush = async () => {
    setLoading(true);
    const perm = await requestBrowserNotificationPermission();
    setPermission(perm);
    setLoading(false);
    if (perm === 'granted') {
      setIsSubscribed(true);
      setMessage('✓ ব্রাউজার পুশ নোটিফিকেশন সফলভাবে সক্রিয় হয়েছে!');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setLoading(true);
    try {
      const isEmail = emailOrPhone.includes('@');
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isEmail ? 'email' : 'phone']: emailOrPhone.trim(),
          source: 'home_page_banner',
        }),
      });
      if (res.ok) {
        setIsSubscribed(true);
        setMessage('✓ আপনাকে ধন্যবাদ! নতুন খবর প্রকাশিত হলেই নোটিফিকেশন পাবেন।');
        setEmailOrPhone('');
      }
    } catch {
      setMessage('সাবস্ক্রিপশন ব্যর্থ হয়েছে।');
    }
    setLoading(false);
  };

  if (isSubscribed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs font-bold font-bengali shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{message || 'আপনার নিউজ নোটিফিকেশন সার্ভিস সক্রিয় রয়েছে। যেকোনো ব্রেকিং আপডেট সরাসরি পাবেন।'}</span>
          </div>
          <span className="text-[10px] bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded-full font-bold shrink-0">
            নোটিফিকেশন সক্রিয়
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border border-blue-800/60 flex flex-col md:flex-row items-center justify-between gap-4 font-bengali">
        
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-white/10 shrink-0 hidden sm:block">
            <Bell className="h-6 w-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                লাইভ আপডেট
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                রাবির ব্রেকিং নিউজ ও গল্পের নোটিফিকেশন চালু করুন
              </h3>
            </div>
            <p className="text-xs text-blue-200 pt-1 max-w-xl">
              বিশ্ববিদ্যালয়ের যেকোনো ব্রেকিং নিউজ, সাহিত্য ও সাহিত্যিকের গল্প প্রকাশিত হওয়া মাত্রই সরাসরি নোটিফিকেশন পেতে সাইন-আপ করুন।
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0">
          {/* Quick One-Tap Push Button */}
          {permission !== 'granted' && (
            <button
              type="button"
              onClick={handleEnablePush}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              ) : (
                <Bell className="h-4 w-4 text-slate-950" />
              )}
              <span>১ ক্লিকে ব্রাউজার নোটিফিকেশন অন</span>
            </button>
          )}

          {/* Email / WhatsApp Form */}
          <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="ইমেইল বা মোবাইল"
              className="w-full sm:w-44 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white placeholder-blue-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition"
            >
              <Send className="h-3.5 w-3.5 text-amber-300" />
              <span>সাবস্ক্রাইব</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
