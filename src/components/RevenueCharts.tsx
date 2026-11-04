'use client';

import React, { useState } from 'react';
import { RevenueSummary } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Printer, 
  ArrowUpRight, 
  Layers, 
  AlertTriangle,
  Award
} from 'lucide-react';

interface RevenueChartsProps {
  summary: RevenueSummary;
}

export default function RevenueCharts({ summary }: RevenueChartsProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const currentRevenue = 
    period === 'daily' 
      ? summary.dailyRevenue 
      : period === 'weekly' 
      ? summary.weeklyRevenue 
      : summary.monthlyRevenue;

  const currentProfit = 
    period === 'daily' 
      ? summary.dailyProfit 
      : period === 'weekly' 
      ? summary.weeklyProfit 
      : summary.monthlyProfit;

  const profitMarginPercent = currentRevenue > 0 ? Math.round((currentProfit / currentRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Time Period Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Revenue & Profit Analytics
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
              LIVE METRICS
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-bengali">
            দৈনিক, সাপ্তাহিক ও মাসিক লাভ-ক্ষতি এবং বিক্রয় বিশ্লেষণ
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {[
            { id: 'daily', label: 'Daily (দৈনিক)' },
            { id: 'weekly', label: 'Weekly (সাপ্তাহিক)' },
            { id: 'monthly', label: 'Monthly (মাসিক)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Total Revenue ({period})</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatBDT(currentRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
            <span>Active Volume</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Net Profit ({period})</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatBDT(currentProfit)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Profit Margin: <strong className="text-slate-900">{profitMarginPercent}%</strong>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Merch Orders</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary.totalOrders}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">
            হুডি, ড্রপ শোল্ডার ও জার্সি
          </div>
        </div>

        {/* Print Jobs Count Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Print Station Jobs</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Printer className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">
            {summary.totalPrintJobs}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">
            প্রিন্ট লাগবে রিকুয়েস্ট
          </div>
        </div>

      </div>

      {/* Best Sellers vs Low Selling Performance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performers (High Velocity) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span>Best Selling Products (বেশি বিক্রিত)</span>
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              HIGH VELOCITY
            </span>
          </div>

          <div className="space-y-3">
            {summary.bestSellingProducts.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.salesCount} units sold
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">{formatBDT(p.revenue)}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Top Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Velocity / Needs Promotion */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Low Velocity / Deadstock Alert (কম বিক্রিত)</span>
            </h3>
            <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
              RESTOCK SLOW
            </span>
          </div>

          <div className="space-y-3">
            {summary.lowSellingProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Only {p.salesCount} sold • Stock remaining: {p.stock}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-800 font-semibold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                    Needs Promo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
