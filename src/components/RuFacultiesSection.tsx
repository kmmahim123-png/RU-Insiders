'use client';

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Briefcase,
  Globe2,
  Users,
  Search,
  BookOpen,
  Building,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  X,
  Award,
  Sparkles,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Share2
} from 'lucide-react';
import {
  RU_FACULTIES,
  RU_DEPARTMENTS,
  RuDepartment,
  RuAlumnus,
  getAllAlumni
} from '@/lib/ruAcademicData';

interface RuFacultiesSectionProps {
  hideHeroBanner?: boolean;
}

export default function RuFacultiesSection({ hideHeroBanner = false }: RuFacultiesSectionProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDepartment, setActiveDepartment] = useState<RuDepartment | null>(null);

  const allLiveAlumni = useMemo(() => {
    return getAllAlumni();
  }, []);

  const filteredDepartments = useMemo(() => {
    return RU_DEPARTMENTS.filter((dept) => {
      const matchesFaculty = selectedFacultyId === 'all' || dept.facultyId === selectedFacultyId;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesFaculty;

      const matchesQuery =
        dept.nameBn.toLowerCase().includes(q) ||
        dept.nameEn.toLowerCase().includes(q) ||
        dept.code.toLowerCase().includes(q) ||
        dept.facultyBn.toLowerCase().includes(q) ||
        dept.careerInBangladesh.sectors.some((s) => s.toLowerCase().includes(q)) ||
        dept.careerInBangladesh.popularRoles.some((r) => r.toLowerCase().includes(q)) ||
        dept.careerAbroad.targetCountries.some((c) => c.toLowerCase().includes(q));

      return matchesFaculty && matchesQuery;
    });
  }, [selectedFacultyId, searchQuery]);

  return (
    <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* ===================================================================== */}
      {/* SECTION CONTROLS (OR HERO BANNER IF NOT HIDDEN)                       */}
      {/* ===================================================================== */}
      {hideHeroBanner ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3 font-bengali">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিভাগ বা ক্যারিয়ার খুঁজুন (CSE, Law, Finance...)"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bengali"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">
              মোট {filteredDepartments.length}টি বিভাগ প্রদর্শিত হচ্ছে
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none font-bengali">
            <button
              type="button"
              onClick={() => setSelectedFacultyId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                selectedFacultyId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              সব অনুষদ ({RU_DEPARTMENTS.length})
            </button>

            {RU_FACULTIES.map((fac) => {
              const count = RU_DEPARTMENTS.filter((d) => d.facultyId === fac.id).length;
              const isActive = selectedFacultyId === fac.id;
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setSelectedFacultyId(fac.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{fac.nameBn}</span>
                  {count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl font-bengali">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <GraduationCap className="h-4 w-4 text-amber-400" />
                <span>১২টি অনুষদ • ৫৯টি বিভাগ ও ইনস্টিটিউট • আসন ও ক্যারিয়ার গাইড</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                রাজশাহী বিশ্ববিদ্যালয়ের সকল বিভাগ ও ক্যারিয়ার সম্ভাবনা
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                কোন বিভাগে কত আসন? পড়ার পর বাংলাদেশে ও বিদেশে কী কী হওয়া যায়? কোন সেক্টরে চাকরির সুযোগ? প্রতিটি বিভাগের আসন সংখ্যা, ক্যারিয়ার ক্ষেত্র ও প্রতিষ্ঠিত অ্যালামনাইদের বিস্তারিত তথ্য জানুন।
              </p>
            </div>

            {/* Quick Search */}
            <div className="shrink-0 w-full md:w-80 font-bengali">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="বিভাগ, ক্যারিয়ার বা বিষয় খুঁজুন (CSE, Law, ব্যাংক...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-emerald-500/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bengali"
                />
              </div>
            </div>
          </div>

          {/* Faculties Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none font-bengali">
            <button
              type="button"
              onClick={() => setSelectedFacultyId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                selectedFacultyId === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-white scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              সব অনুষদ ({RU_DEPARTMENTS.length})
            </button>

            {RU_FACULTIES.map((fac) => {
              const count = RU_DEPARTMENTS.filter((d) => d.facultyId === fac.id).length;
              const isActive = selectedFacultyId === fac.id;
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setSelectedFacultyId(fac.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-white scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  <span>{fac.nameBn}</span>
                  {count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-black/30 text-emerald-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DEPARTMENTS CARD GRID                                                 */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 font-bengali">
        {filteredDepartments.map((dept) => {
          const deptAlumni = allLiveAlumni.filter((a) => a.departmentId === dept.id);

          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Faculty & Seat Count Header Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                    <Building className="h-3 w-3 text-emerald-600" />
                    <span>{dept.facultyBn}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black font-mono shadow-sm">
                    আসন: {dept.seatCount} টি
                  </span>
                </div>

                {/* Department Name */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {dept.nameBn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {dept.nameEn} ({dept.code})
                  </p>
                </div>

                {/* Overview preview */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dept.overviewBn}
                </p>

                {/* Career in Bangladesh Preview */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>দেশে ক্যারিয়ার ও কর্মক্ষেত্র:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dept.careerInBangladesh.sectors.slice(0, 3).map((sec) => (
                      <span key={sec} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                        {sec}
                      </span>
                    ))}
                    {dept.careerInBangladesh.sectors.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-bold">
                        +{dept.careerInBangladesh.sectors.length - 3} আরও
                      </span>
                    )}
                  </div>
                </div>

                {/* Career Abroad Preview */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-black text-blue-950">
                    <Globe2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>বিদেশে উচ্চশিক্ষা ও গ্লোবাল জবস:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dept.careerAbroad.targetCountries.slice(0, 3).map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-900">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Alumni count badge */}
                {deptAlumni.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{deptAlumni.length} জন প্রতিষ্ঠিত অ্যালামনাই প্রোফাইল সংরক্ষিত</span>
                  </div>
                )}

              </div>

              {/* Card Footer Action */}
              <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  প্রতিষ্ঠা: {dept.establishedYear}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveDepartment(dept)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>বিস্তারিত ও অ্যালামনাই দেখুন</span>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-300" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* DEPARTMENT & ALUMNI EXPANDED DRAWER / MODAL                           */}
      {/* ===================================================================== */}
      {activeDepartment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col font-bengali">
            
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-6 pb-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                  {activeDepartment.facultyBn}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  আসন: {activeDepartment.seatCount} টি
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveDepartment(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-6">
              
              {/* Department Title & Degree */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900">
                  {activeDepartment.nameBn}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {activeDepartment.nameEn} ({activeDepartment.code}) • ডিগ্রি: {activeDepartment.degreeOfferedBn}
                </p>
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>অবস্থান: {activeDepartment.locationBuildingBn}</span>
                </p>
              </div>

              {/* Overview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeDepartment.overviewBn}
              </div>

              {/* Career Breakdown Grid (In Bangladesh vs Abroad) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Career in Bangladesh */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                    <Briefcase className="h-4 w-4 text-emerald-700" />
                    <span>বাংলাদেশে ক্যারিয়ার ও কর্মসংস্থান</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeDepartment.careerInBangladesh.descriptionBn}
                  </p>
                  
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-slate-700">প্রধান কর্মক্ষেত্রসমূহ:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDepartment.careerInBangladesh.sectors.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-xs font-bold text-emerald-900">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <h5 className="text-[11px] font-black text-slate-700">জনপ্রিয় পদবী ও ভূমিকা:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDepartment.careerInBangladesh.popularRoles.map((r) => (
                        <span key={r} className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Career Abroad */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-950 font-black text-sm">
                    <Globe2 className="h-4 w-4 text-blue-700" />
                    <span>বিদেশে উচ্চশিক্ষা ও আন্তর্জাতিক ক্যারিয়ার</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeDepartment.careerAbroad.descriptionBn}
                  </p>

                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-slate-700">শীর্ষ গন্তব্য ও দেশ:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDepartment.careerAbroad.targetCountries.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-xs font-bold text-blue-900">
                          ★ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <h5 className="text-[11px] font-black text-slate-700">উচ্চশিক্ষার স্পেশালাইজেশন:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDepartment.careerAbroad.studyFields.map((f) => (
                        <span key={f} className="px-2.5 py-1 rounded-lg bg-blue-700 text-white text-xs font-bold">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Department Alumni Directory Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-700" />
                    <h4 className="text-lg font-black text-slate-900">
                      প্রতিষ্ঠিত অ্যালামনাই ডিরেক্টরি ({activeDepartment.nameBn})
                    </h4>
                  </div>
                </div>

                {allLiveAlumni.filter((a) => a.departmentId === activeDepartment.id).length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    এই বিভাগের নতুন অ্যালামনাই প্রোফাইল যুক্ত হচ্ছে। অ্যাডমিন প্যানেল থেকে আপনি সরাসরি নতুন অ্যালামনাই যুক্ত করতে পারবেন।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allLiveAlumni
                      .filter((a) => a.departmentId === activeDepartment.id)
                      .map((alumnus) => (
                        <div
                          key={alumnus.id}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between gap-3 group hover:border-emerald-500/80 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={alumnus.imageUrl}
                              alt={alumnus.name}
                              className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow border border-slate-200"
                            />
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h5 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition">
                                {alumnus.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-mono">
                                সেশন: {alumnus.session} {alumnus.rollNumber && `• রোল: ${alumnus.rollNumber}`}
                              </p>
                              <p className="text-xs font-bold text-emerald-800 line-clamp-1">
                                {alumnus.currentRole}
                              </p>
                              <p className="text-[11px] text-slate-600 line-clamp-1">
                                {alumnus.currentOrganization} ({alumnus.location})
                              </p>
                            </div>
                          </div>

                          {alumnus.achievementBn && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                              "{alumnus.achievementBn}"
                            </p>
                          )}

                          {/* Contact Row */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {alumnus.phone && (
                                <a
                                  href={`tel:${alumnus.phone}`}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                  title={`কল করুন: ${alumnus.phone}`}
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {alumnus.email && (
                                <a
                                  href={`mailto:${alumnus.email}`}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                  title={`ইমেইল: ${alumnus.email}`}
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {alumnus.facebookUrl && (
                                <a
                                  href={alumnus.facebookUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                                  title="ফেসবুক প্রোফাইল"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>

                            {alumnus.whatsappNumber && (
                              <a
                                href={`https://wa.me/${alumnus.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>হোয়াটসঅ্যাপ</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Bottom Close */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveDepartment(null)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
