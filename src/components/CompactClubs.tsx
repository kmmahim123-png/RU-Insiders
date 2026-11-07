'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  Loader2
} from 'lucide-react';
import { RU_CLUBS, RuClub, saveClubApplication } from '@/lib/ruClubsData';

export default function CompactClubs() {
  const [selectedCategory, setSelectedCategory] = useState<string>('career');
  const [applyingClub, setApplyingClub] = useState<RuClub | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    department: '',
    session: '',
    rollNumber: '',
    phone: '',
    email: '',
    bloodGroup: 'A+',
    whyJoin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('ru_user_session');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          if (u.name || u.email) {
            setIsLoggedInUser(true);
            setFormData((prev) => ({
              ...prev,
              studentName: prev.studentName || u.name || '',
              email: prev.email || u.email || '',
            }));
            return;
          }
        }
        setIsLoggedInUser(false);
      } catch (e) {}
    };

    checkUser();
    window.addEventListener('ru_auth_changed', checkUser);
    return () => window.removeEventListener('ru_auth_changed', checkUser);
  }, []);

  const clubCategories = [
    { id: 'career', label: 'ক্যারিয়ার ও লিডারশিপ', icon: '🏆' },
    { id: 'debate', label: 'বিতর্ক ও যুক্তি', icon: '🗣️' },
    { id: 'science', label: 'বিজ্ঞান ও রোবোটিক্স', icon: '🤖' },
    { id: 'photo', label: 'ফটোগ্রাফি ও আর্ট', icon: '📸' },
    { id: 'blood', label: 'রক্তদান ও সেবা', icon: '🩸' },
    { id: 'tech', label: 'কোডিং ও হ্যাকাথন', icon: '💻' },
    { id: 'cultural', label: 'নাটক ও সংস্কৃতি', icon: '🎭' },
    { id: 'service', label: 'রোভার ও বিএনসিসি', icon: '🎖️' },
  ];

  const categoryClubs = RU_CLUBS.filter((c) => c.category === selectedCategory);
  const displayClubs = categoryClubs.length > 0 ? categoryClubs : RU_CLUBS.slice(0, 3);

  const handleOpenApplicationModal = (club: RuClub) => {
    setApplyingClub(club);
    setApplicationSuccess(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingClub) return;

    if (!formData.studentName.trim() || !formData.phone.trim()) {
      alert('অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      saveClubApplication({
        clubId: applyingClub.id,
        clubNameBn: applyingClub.nameBn,
        studentName: formData.studentName,
        department: formData.department,
        session: formData.session,
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        whyJoin: formData.whyJoin,
      });

      try {
        await fetch('/api/club-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clubId: applyingClub.id,
            clubNameBn: applyingClub.nameBn,
            studentName: formData.studentName,
            department: formData.department,
            session: formData.session,
            rollNumber: formData.rollNumber,
            phone: formData.phone,
            email: formData.email,
            bloodGroup: formData.bloodGroup,
            whyJoin: formData.whyJoin,
          }),
        });
      } catch (e) {}

      setApplicationSuccess(true);
    } catch {
      alert('আবেদন জমা দিতে সমস্যা হয়েছে।');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 font-bengali">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        
        {/* Section Header with Direct Link to Dedicated Page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-4 w-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                রাজশাহী বিশ্ববিদ্যালয়ের সকল ক্লাব ও সংগঠন
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              আইকন নির্বাচন করে ক্লাবের কার্যক্রম দেখুন ও অনলাইনে মেম্বারশিপের আবেদন করুন
            </p>
          </div>

          <Link
            href="/clubs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition shrink-0 group border border-emerald-200"
          >
            <span>আলাদা পেজে সকল ক্লাব ও আবেদন দেখুন</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Compact Category Icons Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {clubCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = RU_CLUBS.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/25 text-white' : 'bg-white text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Clubs Compact Cards (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {displayClubs.map((club) => (
            <div
              key={club.id}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
                    {club.shortName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    প্রতিষ্ঠা: {club.establishedYear}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 pt-2 leading-snug">
                  {club.nameBn}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                  {club.descriptionBn}
                </p>
              </div>

              {/* Achievements & Alumni */}
              <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold truncate">
                  <Award className="h-3 w-3 shrink-0" />
                  <span className="truncate">{club.whereTheyWent.platforms.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              {/* Apply / Details Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenApplicationModal(club)}
                  className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition"
                >
                  <Send className="h-3 w-3" />
                  <span>সদস্য হতে আবেদন</span>
                </button>
                <Link
                  href="/clubs"
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                >
                  বিস্তারিত
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <span>রাজশাহী বিশ্ববিদ্যালয়ে ২৫টিরও বেশি সক্রিয় কো-কারিকুলার ক্লাব রয়েছে।</span>
          <Link
            href="/clubs"
            className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
          >
            সকল ক্লাবের তালিকা ও আবেদন পোর্টাল দেখুন →
          </Link>
        </div>

      </div>

      {/* Online Club Membership Application Modal */}
      {applyingClub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-bengali">
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                  অনলাইন মেম্বারশিপ আবেদন
                </span>
                <h3 className="text-base font-black text-white pt-0.5">
                  {applyingClub.nameBn} ({applyingClub.shortName})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyingClub(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {applicationSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    আবেদন সফলভাবে জমা হয়েছে!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    ধন্যবাদ, {formData.studentName}! আপনার আবেদন {applyingClub.shortName} ক্লাবের অ্যাডমিনের কাছে সংরক্ষিত হয়েছে।
                  </p>
                  <button
                    type="button"
                    onClick={() => setApplyingClub(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  
                  {isLoggedInUser && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Google অ্যাকাউন্ট থেকে নাম ও ইমেইল যুক্ত করা হয়েছে।</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">শিক্ষার্থীর নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="আপনার পূর্ণ নাম লিখুন..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিভাগ (Dept) *</label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="যেমন: CSE, Law..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সেশন *</label>
                      <input
                        type="text"
                        required
                        value={formData.session}
                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                        placeholder="২০২৩-২০২৪"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="০১৭xxxxxxxx"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">কেন যুক্ত হতে চান?</label>
                    <textarea
                      rows={2}
                      value={formData.whyJoin}
                      onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                      placeholder="ক্লাবে যুক্ত হওয়ার উদ্দেশ্য বা আগ্রহ..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 text-amber-300" />
                    )}
                    <span>আবেদন জমা দিন</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
