'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  Globe2,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  X,
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { RU_FACULTIES, RU_DEPARTMENTS, RuDepartment } from '@/lib/ruAcademicData';

export default function CompactFaculties() {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('engineering');
  const [activeDeptModal, setActiveDeptModal] = useState<RuDepartment | null>(null);

  const facultyIcons: Record<string, string> = {
    engineering: '⚙️',
    science: '🔬',
    arts: '📜',
    business: '💼',
    law: '⚖️',
    life_earth: '🧬',
    social_science: '🏛️',
    agriculture: '🌾',
    fine_arts: '🎨',
  };

  const selectedFaculty = RU_FACULTIES.find((f) => f.id === selectedFacultyId) || RU_FACULTIES[0];
  const facultyDepartments = RU_DEPARTMENTS.filter((d) => d.facultyId === selectedFacultyId);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 font-bengali">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        
        {/* Section Header with Direct Link to Dedicated Page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                <GraduationCap className="h-4 w-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                রাজশাহী বিশ্ববিদ্যালয়ের সকল অনুষদ ও ক্যারিয়ার সম্ভাবনা
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              অনুষদের আইকনে ক্লিক করে সংশ্লিষ্ট বিভাগের আসন ও ক্যারিয়ার সম্ভাবনা দেখুন
            </p>
          </div>

          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition shrink-0 group border border-indigo-200"
          >
            <span>আলাদা পেজে সকল বিভাগ দেখুন</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Compact Faculty Icons Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {RU_FACULTIES.map((fac) => {
            const isActive = selectedFacultyId === fac.id;
            const icon = facultyIcons[fac.id] || '🎓';
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => setSelectedFacultyId(fac.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{icon}</span>
                <span>{fac.nameBn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/25 text-white' : 'bg-white text-slate-600'
                }`}>
                  {fac.departmentCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Faculty Departments Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {facultyDepartments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setActiveDeptModal(dept)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    আসন: {dept.seatCount}টি
                  </span>
                </div>
                
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 pt-1.5 line-clamp-1">
                  {dept.nameBn}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {dept.nameEn}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold truncate">
                  <Briefcase className="h-3 w-3 shrink-0" />
                  <span className="truncate">{dept.careerInBangladesh.popularRoles.slice(0, 2).join(', ')}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold truncate">
                  <Globe2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">বিদেশ: {dept.careerAbroad.targetCountries.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-indigo-600 font-bold pt-1">
                <span>ক্যারিয়ার বিবরণ</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <span>{selectedFaculty.nameBn}-এ সর্বমোট আসন: {facultyDepartments.reduce((acc, d) => acc + (d.seatCount || 0), 0)} টি।</span>
          <Link
            href="/academics"
            className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
          >
            সকল ১২টি অনুষদ ও ৫৯টি বিভাগ বিস্তারিত দেখুন →
          </Link>
        </div>

      </div>

      {/* Department Quick Details Modal */}
      {activeDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-bengali">
            
            {/* Header */}
            <div className="px-5 py-3.5 bg-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
                  {activeDeptModal.facultyBn} • কোড: {activeDeptModal.code}
                </span>
                <h3 className="text-base font-black text-white pt-0.5">
                  {activeDeptModal.nameBn} ({activeDeptModal.nameEn})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDeptModal(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Seats Info */}
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <span className="font-bold text-indigo-950">সর্বমোট নির্ধারিত আসন সংখ্যা:</span>
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black font-mono">
                  {activeDeptModal.seatCount} টি সিট
                </span>
              </div>

              {/* Career in Bangladesh */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  <span>বাংলাদেশে ক্যারিয়ার ও চাকরির ক্ষেত্র:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeDeptModal.careerInBangladesh.sectors.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                  <strong>জনপ্রিয় পদবী:</strong> {activeDeptModal.careerInBangladesh.popularRoles.join(', ')}
                </p>
              </div>

              {/* Career Abroad */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  <span>বিদেশে উচ্চশিক্ষা ও আন্তর্জাতিক সুযোগ:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeDeptModal.careerAbroad.targetCountries.map((c) => (
                    <span key={c} className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-medium text-[11px] border border-blue-200">
                      🌍 {c}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                  <strong>উচ্চশিক্ষার ক্ষেত্র:</strong> {activeDeptModal.careerAbroad.studyFields.join(', ')}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/academics"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>বিভাগের অ্যালামনাই ডিরেক্টরি দেখুন</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setActiveDeptModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
