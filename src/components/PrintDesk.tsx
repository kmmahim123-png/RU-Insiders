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
  ExternalLink
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

  const updateJobStatus = (id: string, newStatus: PrintJob['status']) => {
    const updated = jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job));
    setJobs(updated);
    if (onJobUpdate) onJobUpdate(updated);
  };

  const markPaymentStatus = (id: string, paymentStatus: PrintJob['paymentStatus']) => {
    const updated = jobs.map((job) => (job.id === id ? { ...job, paymentStatus } : job));
    setJobs(updated);
    if (onJobUpdate) onJobUpdate(updated);
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
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3 animate-spin" />
            In Queue (অপেক্ষমান)
          </span>
        );
      case 'printing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1">
            <Printer className="h-3 w-3 animate-pulse" />
            Printing Now (প্রিন্ট হচ্ছে)
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Ready for Pickup (পিকআপ প্রস্তুত)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
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
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Print Lagbe Desk Operator
                <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono">
                  LIVE DESK
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-bengali">
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
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
            <span>Sound Alert {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search Token, Phone or File..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Queue Job Cards List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-500 text-sm">
            No print jobs found in this view.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all ${
                job.status === 'queued'
                  ? 'border-amber-500/40 bg-slate-900/80'
                  : job.status === 'printing'
                  ? 'border-blue-500/40 bg-slate-900/60'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left: Token, File info, Customer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm sm:text-base text-amber-400 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-amber-500/30">
                      {job.token}
                    </span>
                    {getStatusBadge(job.status)}
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-200">
                    <FileText className="h-4 w-4 text-rose-400 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                      {job.fileName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({job.pageCount} pages • {job.copies} {job.copies > 1 ? 'copies' : 'copy'} • {job.printType.toUpperCase()} • {job.paperType.replace('_', ' ')})
                    </span>
                  </div>

                  {job.customerNotes && (
                    <div className="text-xs text-amber-300/90 bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-900/30">
                      <strong>Note:</strong> {job.customerNotes}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="text-white font-medium">{job.customerName}</span>
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors font-mono"
                    >
                      <Phone className="h-3 w-3" />
                      {job.customerPhone}
                    </a>
                    <span className="text-emerald-400 font-bold font-mono">
                      Total: {formatBDT(job.totalAmount)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      job.paymentStatus === 'paid_cash' || job.paymentStatus === 'paid_bkash'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {job.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                  
                  {/* Direct Print Trigger (simulated/window print) */}
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Direct</span>
                  </button>

                  {/* Download PDF button */}
                  <a
                    href={`/api/print-station/download?id=${job.id}&name=${encodeURIComponent(job.fileName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                    className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 transition-colors"
                    title="Send WhatsApp Ready Message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </a>

                  {/* Status Progression Workflow */}
                  {job.status === 'queued' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'printing')}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                    >
                      Start Printing
                    </button>
                  )}

                  {job.status === 'printing' && (
                    <button
                      onClick={() => updateJobStatus(job.id, 'ready_for_pickup')}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors"
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
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-colors"
                    >
                      Picked Up & Paid
                    </button>
                  )}

                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
