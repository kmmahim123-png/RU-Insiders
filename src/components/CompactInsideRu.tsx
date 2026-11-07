'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Heart,
  Share2,
  Calendar,
  User,
  X,
  ExternalLink,
  Flame,
  Award,
  Music,
  FileText,
  PenTool,
  Check
} from 'lucide-react';
import { CampusArticle, INITIAL_CAMPUS_ARTICLES, getLocalArticles } from '@/lib/campusNews';

export default function CompactInsideRu() {
  const [articles, setArticles] = useState<CampusArticle[]>(INITIAL_CAMPUS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('news');
  const [selectedArticle, setSelectedArticle] = useState<CampusArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const local = getLocalArticles();
    if (local && local.length > 0) setArticles(local);

    fetch(`/api/articles?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    try {
      const savedLikes = localStorage.getItem('ru_user_liked_articles');
      if (savedLikes) setLikedArticles(JSON.parse(savedLikes));
    } catch (e) {}
  }, []);

  const handleLike = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedArticles.includes(articleId);
    const updated = isLiked
      ? likedArticles.filter((id) => id !== articleId)
      : [...likedArticles, articleId];

    setLikedArticles(updated);
    try {
      localStorage.setItem('ru_user_liked_articles', JSON.stringify(updated));
    } catch (err) {}

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          return {
            ...a,
            likesCount: isLiked ? Math.max(0, a.likesCount - 1) : a.likesCount + 1,
          };
        }
        return a;
      })
    );

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle((prev) =>
        prev
          ? {
              ...prev,
              likesCount: isLiked ? Math.max(0, prev.likesCount - 1) : prev.likesCount + 1,
            }
          : null
      );
    }
  };

  const handleShare = async (article: CampusArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `"${article.title}" — লেখক/গবেষক: ${article.authorName} (${article.authorDept})। পড়ুন RU Insiders-এ: ${window.location.origin}/inside-ru`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: `${window.location.origin}/inside-ru`,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.origin}/inside-ru`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const categoryIcons = [
    { id: 'news', label: 'ক্যাম্পাস নিউজ', icon: '📰', count: articles.filter((a) => a.category === 'news').length },
    { id: 'literature', label: 'গল্প ও স্মৃতি', icon: '📖', count: articles.filter((a) => a.category === 'literature').length },
    { id: 'poetry', label: 'সাহিত্য ও কবিতা', icon: '✍️', count: articles.filter((a) => a.category === 'poetry').length },
    { id: 'research', label: 'রিসার্চ পেপার', icon: '🔬', count: articles.filter((a) => a.category === 'research').length },
    { id: 'talent', label: 'রাবি প্রতিভা', icon: '🌟', count: articles.filter((a) => a.category === 'talent').length },
    { id: 'music', label: 'গান ও সুর', icon: '🎵', count: articles.filter((a) => a.category === 'music').length },
  ];

  const filteredArticles = articles.filter((a) => a.category === selectedCategory);
  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 font-bengali">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        
        {/* Section Header with Direct Dedicated Page Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ইনসাইড রাজশাহী বিশ্ববিদ্যালয়: ডেইলি নিউজ, গল্প ও সাহিত্য
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              নিচের আইকনগুলোতে ক্লিক করে একটি একটি করে খবর ও গল্প পড়ুন
            </p>
          </div>

          <Link
            href="/inside-ru"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition shrink-0 group border border-blue-200"
          >
            <span>আলাদা পেজে সবগুলো পড়ুন</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Compact Category Icons Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoryIcons.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/25 text-white' : 'bg-white text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact News & Stories Cards Grid (3 Clean Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {displayArticles.slice(0, 3).map((article) => {
            const isLiked = likedArticles.includes(article.id);
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group p-3 rounded-2xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                      {article.categoryBn.split(' ')[0]}
                    </span>
                  </div>

                  {/* Headline & Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 pt-1">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span className="truncate max-w-[150px] font-medium text-slate-600">
                    ✍️ {article.authorName}
                  </span>
                  <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                    <span>পড়ুন</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <span>মোট {articles.length} টি সংবাদ, গল্প, কবিতা ও রিসার্চ পেপার প্রকাশিত হয়েছে।</span>
          <Link
            href="/inside-ru"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            সবগুলো দেখুন →
          </Link>
        </div>

      </div>

      {/* Article Reader Modal (Pop-up upon clicking a card) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-bengali">
            
            {/* Modal Header Bar */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                  {selectedArticle.categoryBn}
                </span>
                <span className="text-xs text-slate-300">
                  {selectedArticle.publishedAt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              
              {/* Title & Author */}
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h2>
                {selectedArticle.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-600 italic">
                    {selectedArticle.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>লেখক/গবেষক: <strong>{selectedArticle.authorName}</strong></span>
                  <span>•</span>
                  <span>{selectedArticle.authorDept}</span>
                </div>
              </div>

              {/* Cover Image */}
              {selectedArticle.imageUrl && (
                <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Full Text Content */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200 font-serif">
                {selectedArticle.content}
              </div>

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleLike(selectedArticle.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    likedArticles.includes(selectedArticle.id)
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${likedArticles.includes(selectedArticle.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{selectedArticle.likesCount} লাইক</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/inside-ru"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>সব খবর দেখুন</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
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
