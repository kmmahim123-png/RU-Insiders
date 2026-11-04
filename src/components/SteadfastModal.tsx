'use client';

import React, { useState } from 'react';
import { Order, SteadfastConfig } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { Truck, X, Check, AlertCircle, Copy, ExternalLink, Loader2 } from 'lucide-react';

interface SteadfastModalProps {
  order: Order;
  config: SteadfastConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (consignmentId: string, trackingCode: string) => void;
}

export default function SteadfastModal({ order, config, isOpen, onClose, onSuccess }: SteadfastModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState(order.customerName);
  const [recipientPhone, setRecipientPhone] = useState(order.customerPhone);
  const [recipientAddress, setRecipientAddress] = useState(order.customerAddress);
  const [codAmount, setCodAmount] = useState(order.total);
  const [note, setNote] = useState(`RU Insiders Order #${order.orderNumber}`);

  if (!isOpen) return null;

  const handleCreateConsignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/steadfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          recipientName,
          recipientPhone,
          recipientAddress,
          codAmount,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch via Steadfast Courier');
      }

      onSuccess(data.consignmentId, data.trackingCode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error communicating with Steadfast API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dispatch via Steadfast Courier
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                স্টেডফাস্ট কুরিয়ারে পার্সেল বুকিং কনসাইনমেন্ট তৈরি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* API Status Notice */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Steadfast Gateway Status:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CONNECTED (API v1)
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dispatch Form */}
        <form onSubmit={handleCreateConsignment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Customer Phone</label>
              <input
                type="text"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1">Delivery Address</label>
            <textarea
              required
              rows={2}
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">COD Collection Amount (BDT)</label>
              <input
                type="number"
                required
                value={codAmount}
                onChange={(e) => setCodAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Courier Note / Instructions</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-crimsonGlow transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Consignment...</span>
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4" />
                  <span>Confirm Steadfast Dispatch</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
