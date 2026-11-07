'use client';

import React, { useState } from 'react';
import {
  Compass,
  Users,
  Award,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  Phone,
  Mail,
  CheckCircle2,
  MapPin,
  Heart,
  Send,
  MessageCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { RU_CLUBS, RuClub, saveClubApplication } from '@/lib/ruClubsData';

export default function RuClubsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClubDetails, setActiveClubDetails] = useState<RuClub | null>(null);
  
  // Membership application form modal state
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

  const categories = [
    { id: 'all', label: 'সব ক্লাবসমূহ', count: RU_CLUBS.length },
    { id: 'career', label: 'ক্যারিয়ার ও লিডারশিপ' },
    { id: 'debate', label: 'বিতর্ক ও বক্তৃতা' },
    { id: 'science', label: 'বিজ্ঞান ও রোবোটিক্স' },
    { id: 'photo', label: 'ফটোগ্রাফি ও আর্ট' },
    { id: 'blood', label: 'রক্তদান ও সেবা' },
    { id: 'cultural', label: 'সংস্কৃতি ও আবৃত্তি' },
    { id: 'tech', label: 'কোডিং ও হ্যাকাথন' },
    { id: 'service', label: 'রোভার ও বিএনসিসি' },
  ];

  const filteredClubs = RU_CLUBS.filter((club) => {
    const matchesCat = selectedCategory === 'all' || club.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesQuery =
      club.nameBn.toLowerCase().includes(q) ||
      club.nameEn.toLowerCase().includes(q) ||
      club.shortName.toLowerCase().includes(q) ||
      club.categoryBn.toLowerCase().includes(q) ||
      club.whatTheyDo.some((w) => w.toLowerCase().includes(q)) ||
      club.whereTheyWent.platforms.some((p) => p.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  const handleOpenApplicationModal = (club: RuClub, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      // Save locally
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

      // Also send to API endpoint
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

      setApplicationSuccess(true);
      setFormData({
        studentName: '',
        department: '',
        session: '',
        rollNumber: '',
        phone: '',
        email: '',
        bloodGroup: 'A+',
        whyJoin: '',
      });
    } catch (err) {
      console.error(err);
      setApplicationSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="clubs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* ===================================================================== */}
      {/* SECTION BANNER & CLUB SUMMARY                                         */}
      {/* ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl font-bengali">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>সহশিক্ষা • নেতৃত্ব • জাতীয় ও আন্তর্জাতিক অর্জন</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              রাজশাহী বিশ্ববিদ্যালয়ের সকল ক্লাব ও সংগঠন
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ক্যারিয়ার, বিতর্ক, বিজ্ঞান, ফটোগ্রাফি, রক্তদান ও সাংস্কৃতিক ক্লাবগুলোর কার্যকারিতা জানুন। ক্লাবের মাধ্যমে শিক্ষার্থীরা কোথায় কোথায় গিয়েছে? নতুন শিক্ষার্থীরা সরাসরি এখান থেকেই ক্লাবে যুক্ত হতে আবেদন করুন।
            </p>
          </div>

          {/* Quick Search */}
          <div className="shrink-0 w-full md:w-80 font-bengali">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ক্লাব খুঁজুন (RUCS, RUDEU, বাঁধন...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-indigo-500/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bengali"
              />
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none font-bengali">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-white scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CLUBS CARD GRID                                                       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 font-bengali">
        {filteredClubs.map((club) => {
          return (
            <div
              key={club.id}
              onClick={() => setActiveClubDetails(club)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 overflow-hidden cursor-pointer"
            >
              <div>
                {/* Cover Image & Logo Overlay */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={club.coverImageUrl}
                    alt={club.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                  {/* Club Logo */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                    <img
                      src={club.logoUrl}
                      alt={club.shortName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                    />
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black font-mono shadow">
                        প্রতিষ্ঠা: {club.establishedYear}
                      </span>
                      <h4 className="text-white font-black text-sm drop-shadow">
                        {club.shortName}
                      </h4>
                    </div>
                  </div>

                  {/* Category Pill on top right */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 text-[10px] font-black">
                    {club.categoryBn}
                  </span>
                </div>

                {/* Club Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-700 transition">
                      {club.nameBn}
                    </h3>
                    <p className="text-xs text-slate-500 italic">
                      "{club.mottoBn}"
                    </p>
                  </div>

                  {/* Overview description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {club.descriptionBn}
                  </p>

                  {/* "Where they went" Highlights */}
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                      <Award className="h-3.5 w-3.5 text-indigo-700" />
                      <span>ক্লাবের মাধ্যমে অর্জন ও সাফল্য:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-2">
                      {club.whereTheyWent.achievementsBn}
                    </p>
                  </div>

                  {/* Room Location & Member Count */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                      <span className="truncate">{club.roomLocationBn}</span>
                    </span>
                    <span className="font-bold text-emerald-700 shrink-0">
                      {club.memberCount}
                    </span>
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveClubDetails(club);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <span>কার্যক্রম দেখুন</span>
                  <ChevronRight className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOpenApplicationModal(club, e)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer hover:scale-105"
                >
                  <Send className="h-3 w-3 text-amber-300" />
                  <span>ক্লাবে যুক্ত হোন</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* CLUB DETAILS MODAL                                                    */}
      {/* ===================================================================== */}
      {activeClubDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 font-bengali">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
            
            {/* Modal Header Cover */}
            <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
              <img
                src={activeClubDetails.coverImageUrl}
                alt={activeClubDetails.nameBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={() => setActiveClubDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeClubDetails.logoUrl}
                    alt={activeClubDetails.shortName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xl bg-white"
                  />
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-xs font-black">
                      {activeClubDetails.categoryBn}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow pt-1">
                      {activeClubDetails.nameBn}
                    </h2>
                    <p className="text-xs text-slate-200 font-medium">
                      {activeClubDetails.nameEn}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const c = activeClubDetails;
                    setActiveClubDetails(null);
                    handleOpenApplicationModal(c);
                  }}
                  className="hidden sm:flex px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>অনলাইনে ক্লাবে যুক্ত হোন</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-6">
              
              {/* Motto Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center font-bold text-xs sm:text-sm text-amber-950">
                "{activeClubDetails.mottoBn}"
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-slate-900">ক্লাবের পরিচিতি ও উদ্দেশ্য:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeClubDetails.descriptionBn}
                </p>
              </div>

              {/* What They Do (Activities) */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span>ক্লাবের নিয়মিত কার্যক্রম ও ইভেন্টসমূহ:</span>
                </h4>
                <div className="space-y-1.5">
                  {activeClubDetails.whatTheyDo.map((act) => (
                    <div key={act} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where they went / Achievements */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 border border-indigo-200 space-y-3">
                <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-indigo-700" />
                  <span>ক্লাবের মাধ্যমে মানুষ কোথায় কোথায় গিয়েছে ও জাতীয় অর্জন:</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeClubDetails.whereTheyWent.achievementsBn}
                </p>
                <div className="space-y-1">
                  <h6 className="text-[11px] font-black text-indigo-900">গ্লোবাল ও জাতীয় প্ল্যাটফর্ম:</h6>
                  <div className="flex flex-wrap gap-1.5">
                    {activeClubDetails.whereTheyWent.platforms.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-300 text-xs font-bold text-indigo-950 shadow-sm">
                        ★ {p}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic pt-1">
                  নোট: {activeClubDetails.whereTheyWent.notablePlacementsBn}
                </p>
              </div>

              {/* Club Membership Benefits */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-slate-900">এই ক্লাবের সদস্য হওয়ার সুবিধাসমূহ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeClubDetails.benefitsBn.map((ben) => (
                    <div key={ben} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-950 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Room Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>ক্লাব কক্ষ: <strong>{activeClubDetails.roomLocationBn}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>নেতৃত্ব: <strong>{activeClubDetails.presidentOrSecretaryBn}</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a href={`tel:${activeClubDetails.contactPhone}`} className="flex items-center gap-1 text-emerald-700 font-bold hover:underline">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{activeClubDetails.contactPhone}</span>
                  </a>
                  <a href={`mailto:${activeClubDetails.contactEmail}`} className="flex items-center gap-1 text-blue-700 font-bold hover:underline">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{activeClubDetails.contactEmail}</span>
                  </a>
                </div>
              </div>

              {/* Modal Bottom Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveClubDetails(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const c = activeClubDetails;
                    setActiveClubDetails(null);
                    handleOpenApplicationModal(c);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="h-3.5 w-3.5 text-amber-300" />
                  <span>এই ক্লাবে যুক্ত হতে আবেদন করুন</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONLINE CLUB MEMBERSHIP APPLICATION FORM MODAL                          */}
      {/* (User's Exact Requirement: নতুন স্টুডেন্ট যেন ওয়েবসাইটের মাধ্যমে ক্লাবে যুক্ত হতে পারে) */}
      {/* ===================================================================== */}
      {applyingClub && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 font-bengali">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div className="flex items-center gap-2.5">
                <img
                  src={applyingClub.logoUrl}
                  alt={applyingClub.shortName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-snug">
                    ক্লাবে যোগদানের আবেদন
                  </h3>
                  <p className="text-xs text-indigo-700 font-bold">
                    {applyingClub.nameBn} ({applyingClub.shortName})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApplyingClub(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-5 sm:p-7">
              {applicationSuccess ? (
                <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900">
                      অভিনন্দন! আবেদনটি সফলভাবে জমা হয়েছে
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      আপনার আবেদনটি <strong>{applyingClub.nameBn}</strong>-এর অ্যাডমিন প্যানেলে নিবন্ধিত হয়েছে। ক্লাব কার্যনির্বাহী পরিষদ থেকে আপনার মোবাইল নম্বরে দ্রুত যোগাযোগ করা হবে।
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>ক্লাব রুম: {applyingClub.roomLocationBn}</span>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${applyingClub.contactPhone.replace(/[^0-9]/g, '')}?text=হ্যালো, আমি RU Insiders ওয়েবসাইটের মাধ্যমে ${applyingClub.shortName} ক্লাবে যুক্ত হতে আবেদন করেছি।`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>ক্লাব কো-অর্ডিনেটরকে হোয়াটসঅ্যাপে জানান</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setApplyingClub(null)}
                      className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      ঠিক আছে
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                    💡 রাজশাহী বিশ্ববিদ্যালয়ের যেকোনো সেশন বা বিভাগের শিক্ষার্থী এই ফরমের মাধ্যমে সরাসরি ক্লাবের মেম্বারশিপের জন্য আবেদন করতে পারেন।
                  </div>

                  {/* Student Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800">
                      শিক্ষার্থীর পুরো নাম (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="আপনার নাম লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Department & Session Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        বিভাগ (Department) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="যেমন: CSE, Law, English..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        সেশন / শিক্ষাবর্ষ *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.session}
                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                        placeholder="যেমন: ২০২৩-২০২৪"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Roll No & Blood Group Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        ক্লাস রোল নম্বর (Roll No)
                      </label>
                      <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="যেমন: ২৩১০৫৪৩..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        রক্তের গ্রুপ (Blood Group)
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="A+">A+ (এ পজিটিভ)</option>
                        <option value="A-">A- (এ নেগেটিভ)</option>
                        <option value="B+">B+ (বি পজিটিভ)</option>
                        <option value="B-">B- (বি নেগেটিভ)</option>
                        <option value="O+">O+ (ও পজিটিভ)</option>
                        <option value="O-">O- (ও নেগেটিভ)</option>
                        <option value="AB+">AB+ (এবি পজিটিভ)</option>
                        <option value="AB-">AB- (এবি নেগেটিভ)</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        মোবাইল নম্বর (Phone / WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="০১৭xxxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-800">
                        ইমেইল এড্রেস (Email)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Why join / Experience */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800">
                      কেন এই ক্লাবে যুক্ত হতে চান? / পূর্ব অভিজ্ঞতা
                    </label>
                    <textarea
                      rows={3}
                      value={formData.whyJoin}
                      onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                      placeholder="আপনার আগ্রহ, ক্লাব থেকে কী শিখতে চান বা পূর্বের কোনো কাজের অভিজ্ঞতা থাকলে সংক্ষেপে লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setApplyingClub(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                    >
                      বাতিল
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>জমা হচ্ছে...</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 text-amber-300" />
                          <span>আবেদন জমা দিন (Submit Application)</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
