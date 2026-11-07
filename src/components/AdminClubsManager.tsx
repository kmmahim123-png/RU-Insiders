'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageCircle,
  Filter,
  Search,
  Download,
  Clock,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';
import { RU_CLUBS, ClubMembershipApplication, getClubApplications } from '@/lib/ruClubsData';

export default function AdminClubsManager() {
  const [applications, setApplications] = useState<ClubMembershipApplication[]>([]);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      // First load local
      const local = getClubApplications();
      if (local && local.length > 0) {
        setApplications(local);
      }

      // Try fetching from API
      const res = await fetch('/api/club-applications');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications)) {
          // Merge or set
          setApplications(data.applications);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/club-applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesClub = selectedClubFilter === 'all' || app.clubId === selectedClubFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesClub && matchesStatus;

    const matchesQuery =
      app.studentName.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.clubNameBn.toLowerCase().includes(q);

    return matchesClub && matchesStatus && matchesQuery;
  });

  const exportCSV = () => {
    const headers = ['আইডি,শিক্ষার্থীর নাম,বিভাগ,সেশন,রোল,ক্লাব,ফোন,ইমেইল,রক্তের গ্রুপ,আবেদনের তারিখ,স্ট্যাটাস\n'];
    const rows = filteredApps.map((a) =>
      `"${a.id}","${a.studentName}","${a.department}","${a.session}","${a.rollNumber}","${a.clubNameBn}","${a.phone}","${a.email}","${a.bloodGroup}","${a.appliedAt}","${a.status}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RU_Club_Applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-bengali">
      
      {/* Top Banner & Summary Cards */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>রাবি ক্লাব মেম্বারশিপ এডমিন পোর্টাল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-0.5">
            শিক্ষার্থীদের ক্লাব যোগদানের আবেদন তালিকা
          </h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের মাধ্যমে শিক্ষার্থীদের জমা দেওয়া ক্লাবের আবেদনগুলো দেখুন, হোয়াটসঅ্যাপ বা ফোনে যোগাযোগ করুন ও অনুমোদন দিন।
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>সিএসভি এক্সপোর্ট (CSV Export)</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500">মোট আবেদন</span>
          <p className="text-2xl font-black text-slate-900">{applications.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-700">অপেক্ষমাণ (Pending)</span>
          <p className="text-2xl font-black text-amber-950">
            {applications.filter((a) => a.status === 'pending').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-700">অনুমোদিত (Approved)</span>
          <p className="text-2xl font-black text-emerald-950">
            {applications.filter((a) => a.status === 'approved').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-rose-700">বাতিল (Rejected)</span>
          <p className="text-2xl font-black text-rose-950">
            {applications.filter((a) => a.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ফোন বা বিভাগ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Club filter & status filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedClubFilter}
            onChange={(e) => setSelectedClubFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">সব ক্লাব ({RU_CLUBS.length}টি)</option>
            {RU_CLUBS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName} - {c.nameBn}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="pending">অপেক্ষমাণ (Pending)</option>
            <option value="approved">অনুমোদিত (Approved)</option>
            <option value="rejected">বাতিল (Rejected)</option>
          </select>
        </div>

      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-2">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">কোনো আবেদন পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400">ফিল্টার বা সার্চ পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-indigo-400 transition"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-black">
                    {app.clubNameBn}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status === 'approved' ? '✓ অনুমোদিত' : app.status === 'rejected' ? '✕ বাতিল' : '⏳ অপেক্ষমাণ'}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono">
                    তারিখ: {app.appliedAt}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {app.studentName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    বিভাগ: <strong>{app.department}</strong> • সেশন: {app.session} {app.rollNumber && `• রোল: ${app.rollNumber}`} • রক্তের গ্রুপ: <strong className="text-rose-600">{app.bloodGroup}</strong>
                  </p>
                </div>

                {app.whyJoin && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                    "{app.whyJoin}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                
                {/* Phone Call Button */}
                <a
                  href={`tel:${app.phone}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition"
                  title={`কল করুন: ${app.phone}`}
                >
                  <Phone className="h-3.5 w-3.5 text-slate-700" />
                  <span>{app.phone}</span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=হ্যালো ${app.studentName}, আমরা ${app.clubNameBn} থেকে যোগাযোগ করছি আপনার ক্লাব আবেদনের প্রেক্ষিতে।`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>হোয়াটসঅ্যাপ</span>
                </a>

                {/* Status toggles */}
                {app.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(app.id, 'approved')}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs transition"
                  >
                    অনুমোদন করুন
                  </button>
                )}

                {app.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs transition"
                  >
                    বাতিল
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
