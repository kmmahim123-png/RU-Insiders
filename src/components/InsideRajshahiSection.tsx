'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Heart,
  Share2,
  Calendar,
  User,
  GraduationCap,
  X,
  ExternalLink,
  ChevronRight,
  Check,
  Flame,
  Award,
  Music,
  FileText,
  Search,
  PenTool,
  Feather
} from 'lucide-react';
import { CampusArticle, INITIAL_CAMPUS_ARTICLES, getLocalArticles } from '@/lib/campusNews';

interface InsideRajshahiSectionProps {
  hideHeroBanner?: boolean;
}

export default function InsideRajshahiSection({ hideHeroBanner = false }: InsideRajshahiSectionProps) {
  const [articles, setArticles] = useState<CampusArticle[]>(INITIAL_CAMPUS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<CampusArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load local articles
    const local = getLocalArticles();
    if (local && local.length > 0) {
      setArticles(local);
    }

    // Fetch live articles from API
    fetch(`/api/articles?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    // Load liked articles
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
    const shareText = `"${article.title}" — লেখক/গবেষক: ${article.authorName} (${article.authorDept})। পড়ুন RU Insiders-এ: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const categories = [
    { id: 'all', label: 'সব লেখা ও নিউজ', count: articles.length },
    { id: 'news', label: 'ক্যাম্পাস নিউজ', count: articles.filter((a) => a.category === 'news').length },
    { id: 'literature', label: 'গল্প ও স্মৃতিচারণ', count: articles.filter((a) => a.category === 'literature').length },
    { id: 'poetry', label: 'সাহিত্য ও কবিতা', count: articles.filter((a) => a.category === 'poetry').length },
    { id: 'research', label: 'গবেষণা ও পেপার', count: articles.filter((a) => a.category === 'research').length },
    { id: 'talent', label: 'কৃতি শিক্ষার্থী ও ট্যালেন্ট', count: articles.filter((a) => a.category === 'talent').length },
    { id: 'music', label: 'ক্যাম্পাস গান ও সুর', count: articles.filter((a) => a.category === 'music').length },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCat = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authorDept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'research':
        return <FileText className="h-3.5 w-3.5 text-blue-500" />;
      case 'poetry':
        return <Feather className="h-3.5 w-3.5 text-emerald-500" />;
      case 'literature':
        return <BookOpen className="h-3.5 w-3.5 text-amber-500" />;
      case 'music':
        return <Music className="h-3.5 w-3.5 text-rose-500" />;
      case 'talent':
        return <Award className="h-3.5 w-3.5 text-purple-500" />;
      case 'news':
        return <Flame className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  return (
    <section id="inside-ru" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* ===================================================================== */}
      {/* SECTION CONTROLS (OR HERO CARD IF NOT HIDDEN)                         */}
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
                placeholder="গল্প, কবিতা বা লেখকের নাম খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bengali"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">
              মোট {filteredArticles.length}টি লেখা প্রদর্শিত হচ্ছে
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-bengali whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-6 sm:p-8 text-white border border-emerald-700/50 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold font-bengali">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                <span>ইনসাইড রাজশাহী ইউনিভার্সিটি • সাহিত্য, সংস্কৃতি ও গবেষণা</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-bengali tracking-tight text-white leading-tight">
                ডেইলি ক্যাম্পাস নিউজ, গল্প, সাহিত্য ও কবিতা
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-bengali leading-relaxed">
                প্যারিস রোডের আড্ডা, শিক্ষার্থীদের স্বরচিত গল্প ও কবিতা, রাবি গবেষকদের আন্তর্জাতিক উদ্ভাবন এবং ক্যাম্পাস ট্যালেন্টদের গৌরবগাথা — শিরোনামে ক্লিক করে সম্পূর্ণ লেখাটি সরাসরি পড়ুন।
              </p>
            </div>

            {/* Search bar inside header */}
            <div className="shrink-0 w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="গল্প, কবিতা বা লেখকের নাম খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-emerald-500/40 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bengali"
                />
              </div>
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-bengali whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-amber-900/40 ring-2 ring-white scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-black/30 text-emerald-200'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ARTICLE & STORY CARDS GRID                                            */}
      {/* (User's Exact Requirement: Title at top, picture under it, click to read) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredArticles.map((article) => {
          const isLiked = likedArticles.includes(article.id);
          const isResearch = article.category === 'research';
          const isMusic = article.category === 'music';
          const isPoem = article.category === 'poetry';

          return (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1.5"
            >
              <div className="p-5 space-y-3">
                
                {/* 1. Category Tag & Date Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black border border-slate-200 flex items-center gap-1.5 font-bengali">
                    {getCategoryIcon(article.category)}
                    <span>{article.categoryBn}</span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-bengali flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{article.publishedAt}</span>
                  </span>
                </div>

                {/* 2. Bold Headline (Title) on Top */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-bengali leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* 3. Picture on Top (Directly under Headline) */}
                <div className="relative h-44 sm:h-48 w-full rounded-2xl bg-slate-900 overflow-hidden shadow-inner">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />

                  {/* Likes button over photo */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(article.id, e)}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1 text-[11px] font-black ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
                        : 'bg-black/50 hover:bg-black/75 text-white border border-white/20'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-white' : 'text-rose-300'}`} />
                    <span>{article.likesCount}</span>
                  </button>

                  {isResearch && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>রিসার্চ পেপার</span>
                    </div>
                  )}
                  {isMusic && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      <span>ক্যাম্পাস গান</span>
                    </div>
                  )}
                </div>

                {/* 4. Author & Department Info */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 font-bengali pt-0.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {article.authorName.slice(0, 1)}
                  </div>
                  <span className="truncate">{article.authorName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-emerald-800 font-medium truncate">{article.authorDept}</span>
                </div>

                {/* 5. Excerpt / Abstract snippet */}
                <p className={`text-xs text-slate-600 font-bengali line-clamp-3 leading-relaxed whitespace-pre-line ${
                  isPoem || isMusic ? 'italic border-l-2 border-emerald-600/40 pl-2.5 bg-emerald-50/40 py-1 rounded-r-lg' : ''
                }`}>
                  {article.excerpt}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between mt-auto bg-slate-50/50">
                <button
                  type="button"
                  onClick={(e) => handleShare(article, e)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-stone-100 transition-all"
                  title="শেয়ার করুন"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {article.externalUrl && (
                    <a
                      href={article.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1"
                      title={isResearch ? 'রিসার্চ পেপার লিংক' : 'অডিও লিংক'}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{isResearch ? 'পেপার' : isMusic ? 'গান' : 'লিংক'}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 group-hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all font-bengali shadow-sm"
                  >
                    <span>{isResearch ? 'পেপার পড়ুন' : isMusic ? 'গান ও লিরিক্স' : 'সম্পূর্ণ পড়ুন'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* DEDICATED FULL READER MODAL                                           */}
      {/* ===================================================================== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-slate-900 flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black font-bengali flex items-center gap-1.5">
                {getCategoryIcon(selectedArticle.category)}
                <span>{selectedArticle.categoryBn}</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-8 space-y-5 font-bengali">
              
              {/* Title */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                  {selectedArticle.title}
                </h2>
                {selectedArticle.subtitle && (
                  <p className="text-sm sm:text-base text-slate-500 font-medium">
                    {selectedArticle.subtitle}
                  </p>
                )}
              </div>

              {/* Author & Meta Row */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow">
                    {selectedArticle.authorName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{selectedArticle.authorName}</h4>
                    <p className="text-[11px] text-slate-500">{selectedArticle.authorDept}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{selectedArticle.publishedAt}</span>
                  </span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={(e) => handleLike(selectedArticle.id, e)}
                    className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    <span>{selectedArticle.likesCount} লাইক</span>
                  </button>
                </div>
              </div>

              {/* Cover Picture */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md bg-slate-900">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Content Body */}
              <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-bengali">
                {selectedArticle.content}
              </div>

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">ট্যাগ:</span>
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* External Link / DOI button if available */}
              {selectedArticle.externalUrl && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-black text-blue-950 text-xs sm:text-sm">
                      {selectedArticle.category === 'research' ? 'আন্তর্জাতিক জার্নাল বা ডিওআই (DOI) রেফারেন্স' : 'অরিজিনাল অডিও / এক্সটার্নাল লিংক'}
                    </h5>
                    <p className="text-[11px] text-blue-800">
                      গবেষণাপত্রের পূর্ণাঙ্গ পিডিএফ বা লিরিক্স দেখতে মূল লিংকে ভিজিট করুন।
                    </p>
                  </div>
                  <a
                    href={selectedArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow shrink-0 self-start sm:self-auto"
                  >
                    <span>মূল উৎস দেখুন</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* Bottom Share & Close Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'বন্ধুদের সাথে শেয়ার করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition"
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
