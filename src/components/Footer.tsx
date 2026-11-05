'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Printer, Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-3">
              <AnimatedLogo size={48} speed="slow" withBorder={true} />
              <div>
                <span className="text-base font-black text-slate-900 tracking-tight">RU Insiders</span>
                <p className="text-xs text-blue-600 font-bengali font-semibold">রাজশাহী বিশ্ববিদ্যালয় মার্চেন্ডাইজ</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-bengali">
              মতিহারের সবুজ চত্বর, প্যারিস রোডের স্মৃতি আর রাজশাহী বিশ্ববিদ্যালয়ের অহংকারকে জড়িয়ে আমাদের প্রিমিয়াম হুডি, ড্রপ-শোল্ডার টি-শার্ট, কাস্টম জার্সি এবং দ্রুততম প্রিন্ট সেবা।
            </p>
            <div className="pt-1">
              <a 
                href="https://www.facebook.com/ru.insiders/followers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-all group"
              >
                <Facebook className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Join Our Facebook Community</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-slate-600 hover:text-blue-600 transition-colors font-semibold">
                  Shop All Merch (সকল পণ্য)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Winter Hoodies (শীতের হুডি)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Drop Shoulder & Tees (টি-শার্ট ও ড্রপ শোল্ডার)
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Track Order (অর্ডার ট্র্যাকিং)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin & Operator Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campus Services & Delivery
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span><strong>RU Campus Pickup:</strong> প্যারিস রোড / শহীদ মিনার / লাইব্রেরি পয়েন্ট থেকে সরাসরি সংগ্রহ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span><strong>Steadfast Courier:</strong> রাজশাহী সিটি ও সারা বাংলাদেশের ৬৪ জেলায় ৪৮ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারি।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✔</span>
                <span><strong>Official Campus Merch:</strong> রাজশাহী বিশ্ববিদ্যালয়ের ব্র্যান্ড ভ্যালু ও মতিহারের স্মৃতিবাহী মানসম্মত পোশাক।</span>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campus Hub Location
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span>RU Insiders Hub, Paris Road, University of Rajshahi, Rajshahi-6205</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                <span>+880 1718-000000 (WhatsApp Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>support@ruinsiders.com</span>
              </div>
            </div>
            
            <div className="pt-2 text-[11px] text-slate-400">
              Payment Partners: bKash • Nagad • Rocket • Cash on Delivery
            </div>
          </div>

        </div>

        {/* Dedicated Developer & Architect Credit Section (ওয়েবসাইট ডেভেলপার পরিচিতি ও অপশন) */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700/60">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-inner border border-white/20 shrink-0">
                👨‍💻
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">System Developer & Platform Architect</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-400/30">Verified Creator</span>
                </div>
                <h5 className="text-sm sm:text-base font-black text-white tracking-wide">
                  Designed & Developed by <span className="text-blue-400">Mahim</span>
                </h5>
                <p className="text-[11px] text-slate-300 font-bengali">
                  রাজশাহী বিশ্ববিদ্যালয়ের অফিশিয়াল ই-কমার্স মার্চেন্ডাইজ প্ল্যাটফর্ম ও মতিহার ক্যাম্পাস সিস্টেম
                </p>
              </div>
            </div>

            {/* Developer Contact & Links (এখানে আপনি যা যা দেখাতে চান তা সিলেক্ট করতে পারবেন) */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end text-xs font-semibold">
              <a
                href="https://github.com/kmmahim123-png/RU-Insiders"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://facebook.com/ru.insiders"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Facebook</span>
              </a>
              <a
                href="mailto:developer@ruinsiders.com"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 text-emerald-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Get in Touch</span>
              </a>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10 font-mono">
                RU Edition
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} RU Insiders. Built exclusively for Rajshahi University community.</p>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-600 fill-rose-600 inline" />
            <span>for RUians</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
