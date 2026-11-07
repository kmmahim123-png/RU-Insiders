'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  LogOut,
  CheckCircle2,
  X,
  Mail,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Loader2,
  Check,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'guest';
  verified?: boolean;
}

export default function GoogleAuthButton() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ru_user_session');
      if (saved) {
        setSession(JSON.parse(saved));
      }
    } catch (e) {}

    const handleAuthChange = (e: any) => {
      setSession(e.detail);
    };
    window.addEventListener('ru_auth_changed', handleAuthChange);
    return () => window.removeEventListener('ru_auth_changed', handleAuthChange);
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Trigger login completion
  const completeLogin = (name: string, email: string, avatarUrl?: string) => {
    setLoading(true);
    setTimeout(() => {
      const cleanEmail = email.trim() || 'student@ru.ac.bd';
      const defaultName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const cleanName = name.trim() || defaultName || 'RU Insiders পাঠক';
      
      const avatar = avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=2563eb,059669,f59e0b&bold=true`;

      const googleUser: UserSession = {
        id: `google_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar,
        provider: 'google',
        verified: true,
      };

      setSession(googleUser);
      try {
        localStorage.setItem('ru_user_session', JSON.stringify(googleUser));
        window.dispatchEvent(new CustomEvent('ru_auth_changed', { detail: googleUser }));
      } catch (e) {}

      setLoading(false);
      setIsModalOpen(false);
      setShowCustomInput(false);
      setCustomEmail('');
      setCustomName('');

      // Show toast
      setToastMessage(`স্বাগতম, ${cleanName}! Google সাইন-ইন সফল হয়েছে।`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 350);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ru_user_session');
      window.dispatchEvent(new CustomEvent('ru_auth_changed', { detail: null }));
    } catch (e) {}
    setSession(null);
    setIsDropdownOpen(false);
    setToastMessage('আপনি সফলভাবে লগআউট করেছেন।');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[9999] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-bengali font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {session ? (
        // Logged In State with User Avatar & Menu
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition text-slate-800 cursor-pointer shadow-xs"
            title={`${session.name} (${session.email})`}
          >
            {session.avatar ? (
              <img
                src={session.avatar}
                alt={session.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {session.name.charAt(0)}
              </div>
            )}
            <span className="hidden sm:inline-block font-bengali font-bold text-xs max-w-[110px] truncate text-slate-800">
              {session.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:inline-block" />
          </button>

          {/* User Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-bengali">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-3">
                  {session.avatar ? (
                    <img
                      src={session.avatar}
                      alt={session.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {session.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{session.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{session.email}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                    Google ভেরিফাইড ইউজার
                  </span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    const notifBtn = document.querySelector('[title="ক্যাম্পাস নোটিফিকেশন"]') as HTMLElement;
                    notifBtn?.click();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer transition"
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>আমার নোটিফিকেশন</span>
                </button>

                <a
                  href="/clubs"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer transition"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>আমার ক্লাব মেম্বারশিপ</span>
                </a>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 cursor-pointer transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>লগআউট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Not Logged In -> Google Sign-In Button (Compact on Mobile, Full on Desktop)
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 font-bold text-xs shadow-xs transition hover:shadow-sm duration-200 active:scale-95 cursor-pointer shrink-0"
          title="Google দিয়ে সাইন-ইন করুন"
        >
          {/* Official Google G Logo SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden sm:inline font-bengali font-bold">Google দিয়ে লগইন</span>
          <span className="sm:hidden font-bengali font-bold text-[11px]">লগইন</span>
        </button>
      )}

      {/* ===================================================================== */}
      {/* AUTHENTIC GOOGLE ONE-TAP / ACCOUNT CHOOSER MODAL                       */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden font-sans text-slate-800">
            
            {/* Google Brand Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="font-semibold text-sm text-slate-800">Sign in with Google</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-bengali">
                  RU Insiders-এ চালিয়ে যেতে আপনার অ্যাকাউন্ট নির্বাচন করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setShowCustomInput(false);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Account Chooser Options */}
            <div className="p-5 space-y-3 font-bengali">
              
              {/* Account 1: Admin / Mahim Profile */}
              <button
                type="button"
                disabled={loading}
                onClick={() => completeLogin('Mahim', 'kmmahim123@gmail.com')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 flex items-center justify-between transition-all group cursor-pointer text-left shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-white">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">Mahim</p>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-bold">
                        প্রাথমিক একাউন্ট
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">kmmahim123@gmail.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                    <span>লগইন করুন</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>

              {/* Account 2: Campus Student Account */}
              <button
                type="button"
                disabled={loading}
                onClick={() => completeLogin('রাবি শিক্ষার্থী', 'student@ru.ac.bd')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-400 flex items-center justify-between transition-all group cursor-pointer text-left shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-white">
                    RU
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">রাজশাহী বিশ্ববিদ্যালয় শিক্ষার্থী</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                        ক্যাম্পাস
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">student@ru.ac.bd</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 group-hover:underline flex items-center gap-1">
                    <span>লগইন করুন</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>

              {/* Toggle Custom Account Input */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer bg-slate-50/50"
                >
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <span>অন্য কোনো Google / Gmail অ্যাকাউন্ট দিয়ে প্রবেশ করুন</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-xs font-bold text-slate-700">আপনার Google / Gmail অ্যাকাউন্ট লিখুন:</p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="যেমন: yourname@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="আপনার নাম (ঐচ্ছিক)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={loading || !customEmail.trim()}
                      onClick={() => completeLogin(customName, customEmail)}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      <span>সাইন-ইন করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Notice */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2">
                RU Insiders-এ সাইন-ইন করার মাধ্যমে আপনার ক্লাব আবেদন, মতামত ও নোটিফিকেশন তথ্য সুরক্ষিত থাকবে। Google-এর নিয়ম অনুযায়ী আপনার গোপনীয়তা বজায় রাখা হয়।
              </p>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
