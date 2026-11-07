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
  Award
} from 'lucide-react';
import { CampusArticle, INITIAL_CAMPUS_ARTICLES, getLocalArticles } from '@/lib/campusNews';

export default function CampusNewsLiteratureSection() {
  const [articles, setArticles] = useState<CampusArticle[]>(INITIAL_CAMPUS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<CampusArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Load local articles (including any admin created ones)
    const local = getLocalArticles();
    if (local && local.length > 0) {
      setArticles(local);
    }

    // Try fetching from API
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    // Load liked articles from localStorage
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
  };

  const handleShare = async (article: CampusArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `"${article.title}" — লেখক: ${article.authorName} (${article.authorDept})। পড়ুন RU Insiders-এ: ${window.location.origin}`;

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

  return (
    <section id="campus-news-literature" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-[11px] font-black uppercase font-bengali flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>রাবি ট্যালেন্ট ও সাহিত্য কর্নার</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 text-[10px] font-bold">
              দৈনিক আপডেট
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-bengali tracking-tight flex items-center gap-2.5">
            <span>দৈনিক ক্যাম্পাস সংবাদ ও সাহিত্য-কবিতা</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bengali">
            রাজশাহী বিশ্ববিদ্যালয়ের শিক্ষার্থীদের মেধা, সৃজনশীল সাহিত্যকর্ম, প্যারিস রোডের স্মৃতিগাথা এবং সাম্প্রতিক ক্যাম্পাস সংবাদ।
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'সকল লেখা' },
            { id: 'poetry', label: 'সাহিত্য ও কবিতা' },
            { id: 'talent', label: 'রাবি প্রতিভা' },
            { id: 'news', label: 'দৈনিক সংবাদ' },
            { id: 'literature', label: 'গল্প ও স্মৃতিচারণ' },
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const isLiked = likedArticles.includes(article.id);
          const isPoem = article.category === 'poetry';

          return (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-black border border-amber-400/30 flex items-center gap-1 font-bengali shadow-md">
                      {isPoem ? <BookOpen className="h-3 w-3" /> : <Award className="h-3 w-3" />}
                      <span>{article.categoryBn}</span>
                    </span>
                  </div>

                  {/* Likes Count Top-Right */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(article.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1 text-[11px] font-black ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
                        : 'bg-black/50 hover:bg-black/75 text-white border border-white/20'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-white' : 'text-rose-300'}`} />
                    <span>{article.likesCount}</span>
                  </button>

                  {/* Author Line on Image Bottom */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 font-bengali">
                      <User className="h-3.5 w-3.5 text-amber-300" />
                      <span>{article.authorName}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-[10px] text-emerald-300">{article.authorDept}</span>
                    </div>
                  </div>
                </div>

                {/* Article Card Body */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-bengali leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Poetic Stanza / Excerpt */}
                  <p className={`text-xs text-slate-600 font-bengali line-clamp-3 leading-relaxed whitespace-pre-line ${
                    isPoem ? 'italic border-l-2 border-emerald-600/40 pl-2.5 bg-emerald-50/40 py-1 rounded-r-lg' : ''
                  }`}>
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-auto">
                <span className="text-[10px] text-slate-400 font-bengali flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{article.publishedAt}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleShare(article, e)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-stone-100 transition-all"
                    title="শেয়ার করুন"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all font-bengali shadow-sm"
                  >
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Article / Poem Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-slate-900 flex flex-col">
            
            {/* Modal Header Image */}
            <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black font-bengali uppercase">
                  {selectedArticle.categoryBn}
                </span>
                <h3 className="text-lg sm:text-2xl font-black font-bengali leading-snug">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Author Profile Bar */}
            <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-sm shadow">
                  {selectedArticle.authorName.slice(0, 1)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali">
                    {selectedArticle.authorName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-bengali">
                    {selectedArticle.authorDept} • {selectedArticle.authorRole}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
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
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all font-bengali"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-5 sm:p-7 space-y-4 font-bengali">
              {selectedArticle.category === 'poetry' ? (
                // Beautiful poetic stanzas presentation
                <div className="text-center sm:text-left py-3 px-4 sm:px-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-slate-800 text-sm sm:text-base leading-loose whitespace-pre-line font-serif italic">
                  {selectedArticle.content}
                </div>
              ) : (
                // Clean article / news paragraphs
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
