'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Search,
  Sparkles,
  Building,
  GraduationCap,
  X,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { RuAlumnus, RU_DEPARTMENTS, getAllAlumni, saveAlumnus, deleteAlumnus } from '@/lib/ruAcademicData';

export default function AdminAlumniManager() {
  const [alumniList, setAlumniList] = useState<RuAlumnus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumnus, setEditingAlumnus] = useState<RuAlumnus | null>(null);

  const [formData, setFormData] = useState<Partial<RuAlumnus>>({
    name: '',
    departmentId: 'dept-cse',
    departmentBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
    session: '২০১২-২০১৩',
    rollNumber: '',
    currentRole: '',
    currentOrganization: '',
    location: 'ঢাকা, বাংলাদেশ',
    phone: '',
    email: '',
    facebookUrl: '',
    whatsappNumber: '',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    achievementBn: '',
    bioBn: ''
  });

  const loadAlumni = async () => {
    try {
      const local = getAllAlumni();
      setAlumniList(local);

      const res = await fetch('/api/alumni');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.alumni)) {
          setAlumniList(data.alumni);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAlumni();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAlumnus(null);
    setFormData({
      name: '',
      departmentId: RU_DEPARTMENTS[0]?.id || 'dept-cse',
      departmentBn: RU_DEPARTMENTS[0]?.nameBn || 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
      session: '২০১৫-২০১৬',
      rollNumber: '',
      currentRole: '',
      currentOrganization: '',
      location: 'ঢাকা, বাংলাদেশ',
      phone: '',
      email: '',
      facebookUrl: '',
      whatsappNumber: '',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      achievementBn: '',
      bioBn: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (alumnus: RuAlumnus) => {
    setEditingAlumnus(alumnus);
    setFormData(alumnus);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.currentRole?.trim()) {
      alert('অনুগ্রহ করে নাম ও বর্তমান পদবী লিখুন।');
      return;
    }

    const payload: RuAlumnus = {
      id: editingAlumnus ? editingAlumnus.id : `alm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: formData.name!,
      departmentId: formData.departmentId || 'dept-general',
      departmentBn: formData.departmentBn || 'সাধারণ বিভাগ',
      session: formData.session || 'অ্যালামনাই',
      rollNumber: formData.rollNumber || '',
      currentRole: formData.currentRole!,
      currentOrganization: formData.currentOrganization || '',
      location: formData.location || 'বাংলাদেশ',
      phone: formData.phone || '',
      email: formData.email || '',
      facebookUrl: formData.facebookUrl || '',
      whatsappNumber: formData.whatsappNumber || '',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      achievementBn: formData.achievementBn || '',
      bioBn: formData.bioBn || ''
    };

    saveAlumnus(payload);

    try {
      await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {}

    setIsModalOpen(false);
    loadAlumni();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই অ্যালামনাই প্রোফাইলটি মুছে ফেলতে চান?')) return;
    deleteAlumnus(id);
    try {
      await fetch(`/api/alumni?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    loadAlumni();
  };

  const filteredAlumni = alumniList.filter((a) => {
    const matchesDept = selectedDeptFilter === 'all' || a.departmentId === selectedDeptFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesDept;

    const matchesQuery =
      a.name.toLowerCase().includes(q) ||
      a.departmentBn.toLowerCase().includes(q) ||
      a.currentRole.toLowerCase().includes(q) ||
      a.currentOrganization.toLowerCase().includes(q) ||
      a.session.includes(q);

    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-6 font-bengali">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>অ্যালামনাই নেটওয়ার্ক ও ডাটাবেজ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-0.5">
            বিভাগভিত্তিক অ্যালামনাই ডিরেক্টরি ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-500">
            প্রতিটি ডিপার্টমেন্টের প্রতিষ্ঠিত সাবেক শিক্ষার্থীদের নাম, রোল, কর্মক্ষেত্র, মোবাইল, ফেসবুক ও হোয়াটসঅ্যাপ প্রোফাইল যুক্ত ও আপডেট করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন অ্যালামনাই প্রোফাইল যোগ করুন</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, পদবী বা প্রতিষ্ঠান খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none"
        >
          <option value="all">সকল বিভাগ ({alumniList.length} জন)</option>
          {RU_DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.code} - {d.nameBn}
            </option>
          ))}
        </select>
      </div>

      {/* Alumni Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlumni.map((alumnus) => (
          <div
            key={alumnus.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 group"
          >
            <div className="flex items-start gap-3">
              <img
                src={alumnus.imageUrl}
                alt={alumnus.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-sm"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                  {alumnus.departmentBn}
                </span>
                <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {alumnus.name}
                </h4>
                <p className="text-xs font-bold text-slate-700">
                  {alumnus.currentRole}
                </p>
                <p className="text-[11px] text-slate-500">
                  {alumnus.currentOrganization} ({alumnus.location})
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  সেশন: {alumnus.session} {alumnus.rollNumber && `• রোল: ${alumnus.rollNumber}`}
                </p>
              </div>
            </div>

            {alumnus.achievementBn && (
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                "{alumnus.achievementBn}"
              </p>
            )}

            {/* Contact details badge */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              {alumnus.phone && (
                <span className="flex items-center gap-1 text-[11px] text-slate-600 font-mono">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  <span>{alumnus.phone}</span>
                </span>
              )}
              {alumnus.email && (
                <span className="flex items-center gap-1 text-[11px] text-slate-600 font-mono truncate max-w-[150px]">
                  <Mail className="h-3 w-3 text-blue-600" />
                  <span className="truncate">{alumnus.email}</span>
                </span>
              )}
            </div>

            {/* Edit & Delete Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {alumnus.whatsappNumber && (
                  <a
                    href={`https://wa.me/${alumnus.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    title="হোয়াটসঅ্যাপ"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                )}
                {alumnus.facebookUrl && (
                  <a
                    href={alumnus.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    title="ফেসবুক আইডি"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(alumnus)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(alumnus.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Alumnus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
            
            {/* Modal Top */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <h3 className="font-black text-base text-slate-900">
                {editingAlumnus ? 'অ্যালামনাই প্রোফাইল সম্পাদনা' : 'নতুন অ্যালামনাই প্রোফাইল যুক্ত করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-5 sm:p-7 space-y-4">
              
              {/* Name & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">অ্যালামনাইর পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: তানভীর হাসান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">বিভাগ (Department) *</label>
                  <select
                    value={formData.departmentId || ''}
                    onChange={(e) => {
                      const d = RU_DEPARTMENTS.find((dep) => dep.id === e.target.value);
                      setFormData({
                        ...formData,
                        departmentId: e.target.value,
                        departmentBn: d ? d.nameBn : 'সাধারণ বিভাগ'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {RU_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Session & Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">সেশন / শিক্ষাবর্ষ</label>
                  <input
                    type="text"
                    value={formData.session || ''}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="যেমন: ২০১২-২০১৩"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">ক্লাস রোল নম্বর</label>
                  <input
                    type="text"
                    value={formData.rollNumber || ''}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="যেমন: ১৩১০৫৪৩১২০"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Current Role & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">বর্তমান পদবী (Current Role) *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentRole || ''}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    placeholder="যেমন: Senior Software Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">বর্তমান কর্মক্ষেত্র / প্রতিষ্ঠান</label>
                  <input
                    type="text"
                    value={formData.currentOrganization || ''}
                    onChange={(e) => setFormData({ ...formData, currentOrganization: e.target.value })}
                    placeholder="যেমন: Google LLC / Bangladesh Bank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Location & Photo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">কর্মস্থলের অবস্থান (Location)</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="যেমন: ঢাকা, বাংলাদেশ / ক্যালিফোর্নিয়া, যুক্তরাষ্ট্র"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">ছবির লিংক (Image URL)</label>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone, Email, Facebook & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">মোবাইল নম্বর (Phone)</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">হোয়াটসঅ্যাপ নম্বর (WhatsApp)</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+88017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alumni@ru.ac.bd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">ফেসবুক প্রোফাইল লিংক</label>
                  <input
                    type="url"
                    value={formData.facebookUrl || ''}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Achievement note */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800">বিশেষ অর্জন / পরিচিতি নোট</label>
                <textarea
                  rows={2}
                  value={formData.achievementBn || ''}
                  onChange={(e) => setFormData({ ...formData, achievementBn: e.target.value })}
                  placeholder="যেমন: গুগল ক্লাউড প্ল্যাটফর্মের মূল আর্কিটেক্ট টিমে অবদান রেখেছেন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
