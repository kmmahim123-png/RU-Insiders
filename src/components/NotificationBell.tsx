'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import {
  INITIAL_NOTIFICATIONS,
  NewsNotificationItem,
  isBrowserNotificationSupported,
  getNotificationPermission,
  requestBrowserNotificationPermission
} from '@/lib/notifications';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NewsNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(2);
  const [browserPermission, setBrowserPermission] = useState<string>('default');
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [customSubStatus, setCustomSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const perm = getNotificationPermission();
      setBrowserPermission(perm);
      const isPushActive = localStorage.getItem('ru_push_notifications_enabled') === 'true';
      if (isPushActive && perm === 'granted') {
        setBrowserPermission('granted');
      }
    }
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleRequestPush = async () => {
    setIsSubscribingPush(true);
    const perm = await requestBrowserNotificationPermission();
    setBrowserPermission(perm);
    setIsSubscribingPush(false);
    if (perm === 'granted') {
      setStatusMessage('✓ ব্রাউজার পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে!');
      setCustomSubStatus('success');
      setTimeout(() => setCustomSubStatus('idle'), 4000);
    } else if (perm === 'denied') {
      setStatusMessage('আপনার ব্রাউজার সেটিংসে নোটিফিকেশন ব্লক করা রয়েছে। দয়া করে সাইট সেটিংসে অনুমতি দিন।');
      setCustomSubStatus('error');
    }
  };

  const handleCustomSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setCustomSubStatus('loading');
    try {
      const isEmail = emailOrPhone.includes('@');
      const payload: any = {
        name: userName.trim() || 'সম্মানিত পাঠক',
        source: 'bell_dropdown_form',
      };
      if (isEmail) payload.email = emailOrPhone.trim();
      else payload.phone = emailOrPhone.trim();

      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCustomSubStatus('success');
        setStatusMessage('✓ ধন্যবাদ! আপনার নোটিফিকেশন সাবস্ক্রিপশন সফল হয়েছে।');
        setEmailOrPhone('');
        setUserName('');
        setTimeout(() => setCustomSubStatus('idle'), 4000);
      } else {
        setCustomSubStatus('error');
        setStatusMessage('সাবস্ক্রিপশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch {
      setCustomSubStatus('error');
      setStatusMessage('নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।');
    }
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 transition-all duration-200 group"
        aria-label="Campus News Notifications"
        title="ক্যাম্পাস নোটিফিকেশন"
      >
        <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-white/10">
                <Bell className="h-4 w-4 text-amber-300" />
              </span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm font-bengali">ক্যাম্পাস নোটিফিকেশন</h4>
                <p className="text-[10px] text-blue-200 font-bengali">ব্রেকিং নিউজ, গল্প ও ঘোষণা</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Push Permission Banner */}
          <div className="p-3 bg-blue-50/70 border-b border-blue-100">
            {browserPermission === 'granted' ? (
              <div className="flex items-center justify-between text-xs font-bengali text-emerald-800">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ব্রাউজার পুশ নোটিফিকেশন চালু আছে
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  সক্রিয়
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-bengali">
                    নতুন নিউজ সবার আগে পেতে চান?
                  </span>
                  <button
                    onClick={handleRequestPush}
                    disabled={isSubscribingPush}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold font-bengali flex items-center gap-1 shadow-sm transition disabled:opacity-60"
                  >
                    {isSubscribingPush ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Bell className="h-3 w-3 text-amber-300" />
                    )}
                    <span>নোটিফিকেশন অন করুন</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-bengali">
                  যেকোনো ব্রেকিং নিউজ প্রকাশিত হলেই সরাসরি ব্রাউজার নোটিফিকেশন পাবেন।
                </p>
              </div>
            )}
          </div>

          {/* Notifications Feed */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
            {notifications.map((item) => (
              <Link
                key={item.id}
                href={item.link || '/#inside-ru'}
                onClick={() => setIsOpen(false)}
                className={`block p-3 hover:bg-slate-50 transition rounded-xl group ${
                  item.isNew ? 'bg-amber-50/40' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bengali">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bengali shrink-0">
                    {item.time}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-800 font-bengali pt-1.5 group-hover:text-blue-700 leading-snug">
                  {item.title}
                </h5>
                <p className="text-[11px] text-slate-500 font-bengali pt-1 line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>

          {/* Email / WhatsApp Subscription Box */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 font-bengali block">
                📧 ইমেইল বা হোয়াটসঅ্যাপে নিউজ পেতে সাইন-আপ করুন:
              </span>

              {customSubStatus === 'success' ? (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-bengali flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleCustomSubscribe} className="space-y-1.5 font-bengali">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="আপনার নাম (ঐচ্ছিক)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="ইমেইল বা মোবাইল নাম্বার"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                    <button
                      type="submit"
                      disabled={customSubStatus === 'loading'}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition shrink-0 disabled:opacity-60"
                    >
                      {customSubStatus === 'loading' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5 text-amber-400" />
                      )}
                      <span>সাবস্ক্রাইব</span>
                    </button>
                  </div>
                  {customSubStatus === 'error' && (
                    <p className="text-[10px] text-red-600 font-bengali">{statusMessage}</p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] font-bengali text-slate-500">
            <Link
              href="/#inside-ru"
              onClick={() => setIsOpen(false)}
              className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>সকল ডেইলি নিউজ ও গল্প পড়ুন</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <span className="text-[10px] text-slate-400">RU Insiders Alerts</span>
          </div>

        </div>
      )}
    </div>
  );
}
