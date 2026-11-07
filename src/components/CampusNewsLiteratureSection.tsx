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
  Volume2
} from 'lucide-react';
import { CampusArticle, INITIAL_CAMPUS_ARTICLES, getLocalArticles } from '@/lib/campusNews';

export default function CampusNewsLiteratureSection() {
  const [articles, setArticles] = useState<CampusArticle[]>(INITIAL_CAMPUS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<CampusArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Load local articles
    const local = getLocalArticles();
    if (local && local.length > 0) {
      setArticles(local);
    }

    // Try fetching from API / Supabase
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    // Load user likes from localStorage
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
    const shareText = `"${article.title}" — লেখক/গবেষক: ${article.authorName} (${article.authorDept})। পড়ুন ও দেখুন RU Insiders-এ: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {}
  };

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research':
        return <FileText className="h-3.5 w-3.5 text-blue-500" />;
      case 'music':
        return <Music className="h-3.5 w-3.5 text-rose-500" />;
      case 'talent':
        return <Award className="h-3.5 w-3.5 text-amber-500" />;
      case 'poetry':
        return <BookOpen className="h-3.5 w-3.5 text-emerald-500" />;
      case 'news':
        return <Flame className="h-3.5 w-3.5 text-orange-500" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-purple-500" />;
    }
  };

  return (
    <section id="campus-news-literature" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-[11px] font-black uppercase font-bengali flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>রাবি মেধা, গবেষণা, গান ও সাহিত্য কর্নার</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 text-[10px] font-bold">
              দৈনিক পাবলিকেশন ও আপডেট
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-bengali tracking-tight flex items-center gap-2.5">
            <span>রাবি প্রতিভা, গবেষণা পেপার, গান ও সাহিত্য</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed">
            রাজশাহী বিশ্ববিদ্যালয়ের শিক্ষার্থীদের বৈজ্ঞানিক রিসার্চ পেপার, স্বরচিত গান-সুর, সৃজনশীল সাহিত্যকর্ম, প্যারিস রোডের কবিতা এবং মেধার বিশেষ প্রদর্শনী।
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'সকল প্রকাশনা' },
            { id: 'research', label: '🔬 গবেষণা পেপার' },
            { id: 'music', label: '🎵 গান ও সুর' },
            { id: 'talent', label: '💡 রাবি প্রতিভা' },
            { id: 'poetry', label: '✍️ সাহিত্য ও কবিতা' },
            { id: 'news', label: '📰 দৈনিক সংবাদ' },
            { id: 'literature', label: '📖 স্মৃতিচারণ' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all font-bengali ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid - Headline and Picture on top as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const isLiked = likedArticles.includes(article.id);
          const isPoem = article.category === 'poetry';
          const isResearch = article.category === 'research';
          const isMusic = article.category === 'music';

          return (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div className="p-4 sm:p-5 space-y-3">
                
                {/* 1. Category Badge & Date Header */}
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

                {/* 2. Headline (Title) on Top */}
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

                  {/* If Research Paper or Music, show prominent overlay badge */}
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

                {/* 5. Excerpt / Abstract snippet / Lyrics preview */}
                <p className={`text-xs text-slate-600 font-bengali line-clamp-3 leading-relaxed whitespace-pre-line ${
                  isPoem || isMusic ? 'italic border-l-2 border-emerald-600/40 pl-2.5 bg-emerald-50/40 py-1 rounded-r-lg' : ''
                }`}>
                  {article.excerpt}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
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

      {/* Full Article / Research / Song / Poem Dedicated Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-slate-900 flex flex-col">
            
            {/* Modal Top Close Bar */}
            <div className="p-4 sm:p-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black font-bengali flex items-center gap-1.5">
                {getCategoryIcon(selectedArticle.category)}
                <span>{selectedArticle.categoryBn}</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-slate-500 hover:text-slate-900 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Headline at top, then picture */}
            <div className="p-5 sm:p-7 space-y-4 font-bengali">
              
              {/* 1. Large Bold Headline at top */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                  {selectedArticle.title}
                </h2>
                {selectedArticle.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {selectedArticle.subtitle}
                  </p>
                )}
              </div>

              {/* 2. Cover Picture right under headline */}
              <div className="relative h-60 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 3. Author & Publication Credentials Bar */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-sm shadow">
                    {selectedArticle.authorName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      {selectedArticle.authorName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {selectedArticle.authorDept} • {selectedArticle.authorRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => handleLike(selectedArticle.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      likedArticles.includes(selectedArticle.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedArticles.includes(selectedArticle.id) ? 'fill-current' : ''}`} />
                    <span>{selectedArticle.likesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(selectedArticle)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
                  </button>
                </div>
              </div>

              {/* 4. External Paper or Audio Button */}
              {selectedArticle.externalUrl && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    {selectedArticle.category === 'research' ? <FileText className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                    <span>
                      {selectedArticle.category === 'research'
                        ? 'মূল রিসার্চ পেপার / জার্নাল লিংক উপলভ্য'
                        : 'অডিও / ভিডিও লিংক উপলভ্য'}
                    </span>
                  </div>
                  <a
                    href={selectedArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>{selectedArticle.category === 'research' ? 'রিসার্চ পেপার দেখুন' : 'গান শুনুন'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* 5. Article Full Content Presentation */}
              {selectedArticle.category === 'poetry' || selectedArticle.category === 'music' ? (
                <div className="py-4 px-5 sm:px-8 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-slate-800 text-sm sm:text-base leading-loose whitespace-pre-line font-serif italic">
                  {selectedArticle.content}
                </div>
              ) : selectedArticle.category === 'research' ? (
                <div className="py-4 px-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 font-sans">
                  {selectedArticle.content}
                </div>
              ) : (
                <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                  {selectedArticle.content}
                </div>
              )}

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-1.5">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-stone-100 text-slate-600 text-[11px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs font-bengali"
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
