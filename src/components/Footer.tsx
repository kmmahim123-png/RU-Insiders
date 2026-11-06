'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Facebook,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  ExternalLink,
  Github,
  Globe,
  Code,
  User,
  GraduationCap,
  Sparkles,
  X,
  Check,
  Layers,
  Award
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Footer() {
  const pathname = usePathname();
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const developerProjects = [
    {
      name: 'RU Insiders',
      url: 'https://ruinsiders.vercel.app',
      tag: 'E-Commerce & Interactive Map',
      desc: 'রাজশাহী বিশ্ববিদ্যালয়ের অফিশিয়াল ই-কমার্স প্ল্যাটফর্ম ও আনসিন ইন্টারঅ্যাক্টিভ টেরিটরি ম্যাপ।'
    },
    {
      name: 'Delta Hospital 2',
      url: 'https://delta-hospital2.vercel.app',
      tag: 'Hospital & Healthcare ERP',
      desc: 'হাসপাতাল ব্যবস্থাপনা, ডক্টর শিডিউলিং ও পেশেন্ট ম্যানেজমেন্ট প্ল্যাটফর্ম।'
    },
    {
      name: 'Parent Controlled Kids App',
      url: 'https://kids-learning-suite.vercel.app',
      tag: 'Child Education & Security',
      desc: 'প্যারেন্টাল কন্ট্রোল সমন্বিত শিশুদের আধুনিক শিক্ষণ ও বিনোদনমূলক ওয়েব অ্যাপ।'
    },
    {
      name: 'Finding Elephant Goldfish',
      url: 'https://finding-elephant.vercel.app',
      tag: 'Interactive Web Experience',
      desc: 'অ্যাকোয়ারিয়াম ও গোল্ডফিশ কালচার নিয়ে ইন্টারেক্টিভ ভিজ্যুয়াল প্ল্যাটফর্ম।'
    },
    {
      name: 'Web Traffic & SEO Analytics Suite',
      url: 'https://web-traffic-analytics.vercel.app',
      tag: 'SEO & Real-time Analytics',
      desc: 'ওয়েবসাইট ট্রাফিক পর্যবেক্ষণ, সার্চ ইঞ্জিন র্যাংকিং ও পারফরম্যান্স এনালাইসিস টুল।'
    }
  ];

  const handleCopyPortfolio = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('https://kmmahim.site');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

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
              মতিহারের সবুজ চত্বর, প্যারিস রোডের স্মৃতি আর রাজশাহী বিশ্ববিদ্যালয়ের অহংকারকে জড়িয়ে আমাদের প্রিমিয়াম হুডি, ড্রপ-শোল্ডার টি-শার্ট, কাস্টম জার্সি এবং দ্রুততম ডেলিভারি সেবা।
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
                <Link href="/map" className="text-emerald-700 hover:text-emerald-800 transition-colors font-bold flex items-center gap-1">
                  <span>🗺️ Interactive Campus Map</span>
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

        {/* Dedicated Developer & Architect Credit Section */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-700/80">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center font-black text-white text-2xl shadow-lg border-2 border-white/20 shrink-0">
                  <img
                    src="/developer/mahim.jpg"
                    alt="K M Mahim"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse"></span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">System Developer & Platform Architect</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    Rajshahi University
                  </span>
                </div>
                <h5 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Designed & Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">K M MAHIM</span>
                </h5>
                <p className="text-xs text-slate-300 font-bengali">
                  রাজশাহী বিশ্ববিদ্যালয়ের অফিশিয়াল ই-কমার্স প্ল্যাটফর্ম, আনসিন টেরিটরি ম্যাপ এবং সেন্ট্রাল সিস্টেম আর্কিটেকচার
                </p>
              </div>
            </div>

            {/* Interactive Developer Showcase Trigger Button */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-end">
              <button
                type="button"
                onClick={() => setIsDevModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>ডেভেলপার পরিচিতি ও প্রজেক্টসমূহ</span>
              </button>

              <a
                href="https://github.com/kmmahim123-png"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>

              <a
                href="https://kmmahim.site"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Globe className="h-4 w-4 text-teal-400" />
                <span>Portfolio</span>
              </a>
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

      {/* Developer Profile Modal */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90dvh] flex flex-col shadow-2xl text-white overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base">
                  👨‍💻
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">ডেভেলপার প্রোফাইল ও পরিচিতি</h3>
                  <p className="text-[11px] text-slate-400">Developer Profile & Production Portfolio</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDevModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-700/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-xl border-2 border-white/20 shrink-0">
                  <img
                    src="/developer/mahim.jpg"
                    alt="K M Mahim"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <h4 className="text-lg sm:text-xl font-black text-white">K M MAHIM</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      RUian
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-0.5">
                    <p className="flex items-center gap-1.5 justify-center sm:justify-start text-amber-300 font-semibold">
                      <GraduationCap className="h-4 w-4" />
                      <span>রাজশাহী বিশ্ববিদ্যালয় (University of Rajshahi)</span>
                    </p>
                    <p className="font-mono text-slate-400">
                      Student Roll: <span className="text-white font-bold">261129107</span>
                    </p>
                    <p className="text-slate-300">
                      Designation: <span className="text-blue-400 font-semibold">Full-Stack Engineer & System Architect</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <a
                      href="https://kmmahim.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>kmmahim.site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <a
                      href="https://github.com/kmmahim123-png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>@kmmahim123-png</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyPortfolio}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Layers className="h-3.5 w-3.5" />}
                      <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Projects Showcase List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span>Featured Production Deployments</span>
                  </h5>
                  <span className="text-[11px] font-mono text-slate-500">Live on Vercel & Web</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {developerProjects.map((proj, idx) => (
                    <a
                      key={idx}
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            {proj.name}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/50 inline-block">
                          {proj.tag}
                        </span>
                        <p className="text-[11px] text-slate-300 pt-1 line-clamp-2 leading-relaxed">
                          {proj.desc}
                        </p>
                      </div>

                      <div className="pt-2 text-[10px] font-mono text-slate-400 truncate">
                        {proj.url.replace(/^https?:\/\//, '')}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">Developer Credit System • University of Rajshahi</span>
              <button
                type="button"
                onClick={() => setIsDevModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
