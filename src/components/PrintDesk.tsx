'use client';

import React, { useState } from 'react';
import { PrintJob } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Phone, 
  Send, 
  Volume2, 
  VolumeX,
  Search,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface PrintDeskProps {
  initialJobs: PrintJob[];
  onJobUpdate?: (updatedJobs: PrintJob[]) => void;
}

export default function PrintDesk({ initialJobs, onJobUpdate }: PrintDeskProps) {
  const [jobs, setJobs] = useState<PrintJob[]>(initialJobs);
  const [filter, setFilter] = useState<'all' | 'queued' | 'printing' | 'ready_for_pickup' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play audio chime when triggered
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not allowed yet without user interaction');
    }
  };

  const updateJobStatus = async (id: string, newStatus: PrintJob['status']) => {
    const updated = jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job));
    setJobs(updated);
    if (onJobUpdate) onJobUpdate(updated);

    try {
      const pin = typeof window !== 'undefined' ? sessionStorage.getItem('ru_admin_pin') || '1953' : '1953';
      await fetch('/api/print-station', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markPaymentStatus = async (id: string, paymentStatus: PrintJob['paymentStatus']) => {
    const updated = jobs.map((job) => (job.id === id ? { ...job, paymentStatus } : job));
    setJobs(updated);
    if (onJobUpdate) onJobUpdate(updated);

    try {
      const pin = typeof window !== 'undefined' ? sessionStorage.getItem('ru_admin_pin') || '1953' : '1953';
      await fetch('/api/print-station', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify({ id, paymentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteJob = async (id: string, token: string) => {
    if (!confirm(`Delete print job ${token}?`)) return;
    const updated = jobs.filter((job) => job.id !== id);
    setJobs(updated);
    if (onJobUpdate) onJobUpdate(updated);

    try {
      const pin = typeof window !== 'undefined' ? sessionStorage.getItem('ru_admin_pin') || '1953' : '1953';
      await fetch(`/api/print-station?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = 
      job.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerPhone.includes(searchQuery) ||
      job.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: PrintJob['status']) => {
    switch (status) {
      case 'queued':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-600 animate-spin" />
            In Queue (অপেক্ষমান)
          </span>
        );
      case 'printing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-300 text-blue-700 text-xs font-semibold flex items-center gap-1">
            <Printer className="h-3 w-3 text-blue-600 animate-pulse" />
            Printing Now (প্রিন্ট হচ্ছে)
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Ready for Pickup (পিকআপ প্রস্তুত)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
            Delivered (গৃহীত)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Console Top Action Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Print Lagbe Desk Operator
                <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  LIVE DESK
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-bengali">
                রাবি ক্যাম্পাসের কম্পিউটার কাউন্টার থেকে ডিরেক্ট প্রিন্ট ও ডাউনলোড কন্ট্রোল
              </p>
            </div>
          </div>
        </div>

        {/* Audible Alert Toggle & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playAlertSound();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            <span>Sound Alert {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-blue-700">
            Pending: {jobs.filter((j) => j.status === 'queued' || j.status === 'printing').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'queued', label: 'Queued' },
            { id: 'printing', label: 'Printing' },
            { id: 'ready_for_pickup', label: 'Ready for Pickup' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Token, Phone or File..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* Queue Job Cards List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 bg-white text-slate-500 text-sm shadow-sm">
            No print jobs found in this view.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all bg-white shadow-sm ${
                job.status === 'queued'
                  ? 'border-amber-300 bg-amber-50/20'
                  : job.status === 'printing'
                  ? 'border-blue-300 bg-blue-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left: Token, File info, Customer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm sm:text-base text-blue-700 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200">
                      {job.token}
                    </span>
                    {getStatusBadge(job.status)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-900">
                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm truncate max-w-xs sm:max-w-md text-slate-900">
                      {job.fileName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({job.pageCount} pages • {job.copies} {job.copies > 1 ? 'copies' : 'copy'} • {job.printType.toUpperCase()} • {job.paperType.replace('_', ' ')})
                    </span>
                  </div>

                  {job.customerNotes && (
                    <div className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <strong>Note:</strong> {job.customerNotes}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="text-slate-900 font-semibold">{job.customerName}</span>
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-mono font-medium"
                    >
                      <Phone className="h-3 w-3" />
                      {job.customerPhone}
                    </a>
                    <span className="text-emerald-700 font-bold font-mono">
                      Total: {formatBDT(job.totalAmount)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      job.paymentStatus === 'paid_cash' || job.paymentStatus === 'paid_bkash'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {job.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                  
                  {/* Direct Print Trigger */}
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Direct</span>
                  </button>

                  {/* Download PDF button */}
                  <a
                    href={`/api/print-station/download?id=${job.id}&name=${encodeURIComponent(job.fileName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </a>

                  {/* WhatsApp Ready Notification Button */}
                  <a
                    href={`https://wa.me/88${job.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `আসসালামু আলাইকুম ${job.customerName}, আপনার ডকুমেন্ট "${job.fileName}" প্রিন্ট হয়ে রেডি আছে। মতিহার প্যারিস রোড RU Insiders কাউন্টার থেকে সংগ্রহ করুন। পিকআপ টোকেন: ${job.token}। ধন্যবাদ!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-colors"
                    title="Send WhatsApp Ready Message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </a>

                  {/* Status Progression Workflow */}
                  {job.status === 'queued' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'printing')}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                    >
                      Start Printing
                    </button>
                  )}

                  {job.status === 'printing' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'ready_for_pickup')}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Mark Ready
                    </button>
                  )}

                  {job.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => {
                        updateJobStatus(job.id, 'completed');
                        markPaymentStatus(job.id, 'paid_cash');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                    >
                      Picked Up & Paid
                    </button>
                  )}

                  <button
                    onClick={() => deleteJob(job.id, job.token)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors"
                    title="Delete Print Job"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
