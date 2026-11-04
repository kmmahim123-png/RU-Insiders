'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  FileUp, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Share2, 
  Phone,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { PrintJob } from '@/lib/types';

export default function PrintStationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [paperType, setPaperType] = useState<'standard_80gsm' | 'art_paper_matte'>('standard_80gsm');
  const [doubleSided, setDoubleSided] = useState(true);
  const [pageCount, setPageCount] = useState(10);
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedJob, setSubmittedJob] = useState<PrintJob | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Price Calculation
  let baseRate = printType === 'color' ? 15 : 2.5;
  if (paperType === 'art_paper_matte') baseRate += 10;
  if (doubleSided) baseRate = baseRate * 0.9; // 10% duplex discount
  const estimatedTotal = Math.ceil(pageCount * copies * baseRate);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      // Rough page count estimation based on size or default to 10
      const approxPages = Math.max(1, Math.min(250, Math.round(selected.size / (60 * 1024))));
      setPageCount(approxPages > 0 ? approxPages : 8);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !file) {
      alert('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং PDF ফাইল দিন।');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerNotes,
        fileName: file.name,
        fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
        pageCount,
        printType,
        paperType,
        doubleSided,
        copies,
        paymentStatus: 'unpaid',
      };

      const res = await fetch('/api/print-station', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit print job');
      }

      setSubmittedJob(data.job);
    } catch (err: any) {
      alert(err.message || 'Error uploading print document');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Printer className="h-3.5 w-3.5 text-emerald-400" />
          <span>RU Insiders Campus Print Hub (প্রিন্ট লাগবে)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          ইনস্ট্যান্ট ডকুমেন্ট ও PDF প্রিন্ট স্টেশন
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-300 font-bengali leading-relaxed">
          টেলিগ্রাম বা মেসেঞ্জারে ফাইল পাঠিয়ে দাঁড়িয়ে থাকার দিন শেষ। ওয়েবসাইট থেকে সরাসরি PDF জমা দিন, লাইভ রেডি স্ট্যাটাস ট্র্যাক করুন আর প্যারিস রোড কাউন্টার থেকে সংগ্রহ করুন।
        </p>
      </div>

      {submittedJob ? (
        // SUCCESS RECEIPT VIEW
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-emerald-500/40 bg-slate-900/90 shadow-2xl space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-300 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              প্রিন্ট রিকুয়েস্ট সফলভাবে জমা হয়েছে!
            </h2>
            <p className="text-xs text-slate-400 font-bengali">
              কাউন্টারে গিয়ে নিচের টোকেন কোডটি দেখালেই প্রিন্ট কপি হাতে পাবেন।
            </p>
          </div>

          {/* Token Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                YOUR PICKUP TOKEN
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider">
                {submittedJob.token}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(submittedJob.token)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs"
            >
              {copiedToken ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedToken ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Job Details Grid */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>File:</span>
              <span className="text-white font-medium truncate max-w-[200px]">{submittedJob.fileName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Print Config:</span>
              <span className="text-slate-200">
                {submittedJob.pageCount} Pages • {submittedJob.copies} Copy • {submittedJob.printType.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Payable:</span>
              <span className="text-emerald-400 font-bold font-mono">{formatBDT(submittedJob.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Option:</span>
              <span className="text-amber-400 font-semibold">Cash on Pickup or bKash at Desk</span>
            </div>
          </div>

          {/* WhatsApp Direct Link Feature requested by user */}
          <div className="pt-2 space-y-3">
            <a
              href={`https://wa.me/8801718000000?text=${encodeURIComponent(
                `আসসালামু আলাইকুম RU Insiders, আমি ওয়েবসাইট থেকে একটি PDF প্রিন্ট দিয়েছি।\nআমার টোকেন: ${submittedJob.token}\nফাইলের নাম: ${submittedJob.fileName}\nমোট টাকা: ৳${submittedJob.totalAmount}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Send className="h-4 w-4" />
              <span>Forward Token via WhatsApp (হোয়াটসঅ্যাপে পাঠান)</span>
            </a>

            <button
              onClick={() => {
                setSubmittedJob(null);
                setFile(null);
              }}
              className="text-xs text-slate-400 hover:text-white underline pt-1"
            >
              Print Another Document (অন্য ফাইল প্রিন্ট করুন)
            </button>
          </div>

        </div>
      ) : (
        // UPLOADER FORM
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* File Dropzone & Configuration (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Drag & Drop Area */}
            <div className="relative glass-card rounded-3xl p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500/80 transition-all text-center group cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileUp className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {file ? file.name : 'Click to Upload or Drag & Drop PDF here'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-bengali">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Selected` : 'PDF, DOC, DOCX ফাইল আপলোড করুন (সর্বোচ্চ ৫০ MB)'}
                  </p>
                </div>
                {file && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> File Ready
                  </span>
                )}
              </div>
            </div>

            {/* Print Settings Options */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Printer className="h-4 w-4 text-amber-400" />
                <span>Print Preferences (প্রিন্ট অপশন)</span>
              </h3>

              {/* Color vs B&W */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Color Output</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrintType('bw')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      printType === 'bw'
                        ? 'bg-slate-800 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Black & White (সাদাকালো)</div>
                    <div className="text-[11px] text-emerald-400 font-mono">৳2.5 / page</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintType('color')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      printType === 'color'
                        ? 'bg-rose-950/60 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">High Quality Color (রঙিন)</div>
                    <div className="text-[11px] text-amber-400 font-mono">৳15 / page</div>
                  </button>
                </div>
              </div>

              {/* Duplex vs Single Side */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Sides</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDoubleSided(true)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      doubleSided
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Double-Sided (উভয় পিঠ)</div>
                    <div className="text-[11px] text-slate-400">১০% খরচ সাশ্রয়ী</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubleSided(false)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      !doubleSided
                        ? 'bg-slate-800 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Single-Sided (এক পিঠ)</div>
                    <div className="text-[11px] text-slate-400">স্ট্যান্ডার্ড একপাশে প্রিন্ট</div>
                  </button>
                </div>
              </div>

              {/* Pages & Copies Numerical Pickers */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Total Pages (মোট পৃষ্ঠা)</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Copies (কত সেট)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Customer Details & Pricing Checkout Card (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pickup & Contact Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Your Full Name (আপনার নাম)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakil Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Mobile Number (মোবাইল নম্বর)</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Special Instruction (যদি কোনো বিশেষ নোট থাকে)</label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: কভার পেজ কালার আর বাকি সব সাদাকালো প্রিন্ট হবে..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Per Page Rate:</span>
                  <span className="font-mono text-white">৳{baseRate.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pages & Copies:</span>
                  <span className="font-mono text-white">{pageCount} pgs × {copies} copy</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Estimated Total:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {formatBDT(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-emeraldGlow transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Queuing Document...</span>
                ) : (
                  <>
                    <Printer className="h-4 w-4" />
                    <span>Confirm & Generate Pickup Token</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 font-bengali">
                পিকআপের সময় কাউন্টারে ক্যাশ অথবা বিকাশে পেমেন্ট করতে পারবেন।
              </p>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
