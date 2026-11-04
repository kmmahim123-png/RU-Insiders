import React from 'react';
import Link from 'next/link';
import { Facebook, Printer, Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-amber-400 p-0.5 overflow-hidden shadow-sm shrink-0">
                <img src="/logo.png" alt="RU Insiders Logo" className="w-full h-full rounded-full object-cover" />
              </div>
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
                <Link href="/shop" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Shop All Merch (শপ)
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-amber-700 font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Customizer Studio (জার্সি ও হুডি ডিজাইন)
                </Link>
              </li>
              <li>
                <Link href="/print-station" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Printer className="h-3.5 w-3.5 text-emerald-500" />
                  Print Station (প্রিন্ট লাগবে - PDF Upload)
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Track Order & Print Status (অর্ডার ট্র্যাকিং)
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
                <span><strong>Instant Print Station:</strong> অ্যাসাইনমেন্ট, ল্যাব রিপোর্ট বা প্রেজেন্টেশন সরাসরি ওয়েবসাইট থেকে প্রিন্ট।</span>
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

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
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
