'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Calendar,
  User,
  Heart,
  Upload,
  AlertCircle
} from 'lucide-react';
import { CampusArticle, INITIAL_CAMPUS_ARTICLES, getLocalArticles, saveLocalArticle, deleteLocalArticle, ArticleCategory } from '@/lib/campusNews';
import { getBrowserSupabaseClient } from '@/lib/supabase';

export default function AdminCampusNewsManager() {
  const [articles, setArticles] = useState<CampusArticle[]>(INITIAL_CAMPUS_ARTICLES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CampusArticle | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('poetry');
  const [authorName, setAuthorName] = useState('');
  const [authorDept, setAuthorDept] = useState('');
  const [authorRole, setAuthorRole] = useState('শিক্ষার্থী');
  const [imageUrl, setImageUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  useEffect(() => {
    loadArticles();
    // Load subscribers count
    async function fetchSubCount() {
      try {
        const res = await fetch('/api/notifications/subscribe');
        if (res.ok) {
          const d = await res.json();
          if (d.success && typeof d.totalSubscribers === 'number') {
            setSubscriberCount(d.totalSubscribers);
          }
        }
      } catch (e) {}
    }
    fetchSubCount();
  }, []);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadArticles = async () => {
    const local = getLocalArticles();
    if (local && local.length > 0) setArticles(local);

    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success && data.articles && data.articles.length > 0) {
        setArticles(data.articles);
      }
    } catch (e) {}
  };

  const handleOpenNewForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSubtitle('');
    setCategory('poetry');
    setAuthorName('');
    setAuthorDept('');
    setAuthorRole('শিক্ষার্থী');
    setImageUrl('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80');
    setExternalUrl('');
    setContent('');
    setTags('কবিতা, প্যারিস রোড, রাবি');
    setStatus('published');
    setIsFormOpen(true);
  };

  const handleEdit = (article: CampusArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSubtitle(article.subtitle || '');
    setCategory(article.category);
    setAuthorName(article.authorName);
    setAuthorDept(article.authorDept);
    setAuthorRole(article.authorRole || 'শিক্ষার্থী');
    setImageUrl(article.imageUrl);
    setExternalUrl(article.externalUrl || '');
    setContent(article.content);
    setTags(article.tags.join(', '));
    setStatus(article.status);
    setIsFormOpen(true);
  };

  // Image Upload handler to Supabase ru-uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `article-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ru-uploads')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('ru-uploads')
            .getPublicUrl(filePath);

          setImageUrl(publicUrl);
          showMsg('ছবি সফলভাবে আপলোড হয়েছে!');
          setIsUploading(false);
          return;
        }
      }

      // Local fallback to base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        showMsg('ছবি প্রিভিউ যুক্ত হয়েছে!');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showMsg('ছবি আপলোডে সমস্যা: ' + err.message, 'error');
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showMsg('শিরোনাম ও মূল লেখা আবশ্যক!', 'error');
      return;
    }

    const catMap: Record<ArticleCategory, string> = {
      research: 'গবেষণা ও রিসার্চ পেপার',
      music: 'ক্যাম্পাস গান ও সুর',
      poetry: 'সাহিত্য ও কবিতা',
      talent: 'রাবি প্রতিভা ও অর্জন',
      news: 'দৈনিক ক্যাম্পাস সংবাদ',
      literature: 'গল্প ও স্মৃতিচারণ',
    };

    const newArticle: CampusArticle = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      categoryBn: catMap[category] || 'সাহিত্য ও কবিতা',
      authorName: authorName.trim() || 'নাম প্রকাশে অনিচ্ছুক',
      authorDept: authorDept.trim() || 'রাজশাহী বিশ্ববিদ্যালয়',
      authorRole: authorRole.trim() || 'শিক্ষার্থী',
      publishedAt: editingArticle ? editingArticle.publishedAt : new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
      externalUrl: externalUrl.trim(),
      content: content.trim(),
      excerpt: content.trim().slice(0, 160) + '...',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      likesCount: editingArticle ? editingArticle.likesCount : 0,
      isFeatured: editingArticle ? editingArticle.isFeatured : false,
      status,
    };

    // Save locally
    const updated = saveLocalArticle(newArticle);
    setArticles(updated);

    // Save via API / Supabase
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
    } catch (e) {}

    // Broadcast push notification if enabled
    if (notifySubscribers && status === 'published') {
      try {
        await fetch('/api/notifications/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newArticle.title,
            message: `${newArticle.categoryBn}: ${newArticle.excerpt}`,
            url: '/#inside-ru',
          }),
        });
      } catch (e) {}
    }

    showMsg(editingArticle ? 'লেখা সফলভাবে আপডেট হয়েছে!' : 'নতুন লেখা প্রকাশিত হয়েছে ও নোটিফিকেশন পাঠানো হয়েছে!');
    setIsFormOpen(false);
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই লেখাটি মুছে ফেলতে চান?')) return;

    const updated = deleteLocalArticle(articleId);
    setArticles(updated);

    try {
      await fetch(`/api/articles?id=${articleId}`, { method: 'DELETE' });
    } catch (e) {}

    showMsg('লেখা সফলভাবে মুছে ফেলা হয়েছে!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {actionMessage.type === 'success' ? <Check className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <BookOpen className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900 font-bengali">
              দৈনিক ক্যাম্পাস সংবাদ ও সাহিত্য কর্নার ম্যানেজার
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-bengali">
            রাজশাহী বিশ্ববিদ্যালয়ের শিক্ষার্থীদের লেখা কবিতা, ক্যাম্পাস সংবাদ, সাহিত্য ও মেধার স্বীকৃতি সরাসরি হোমপেজে প্রকাশ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold font-bengali flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>🔔 সাবস্ক্রাইবার: {subscriberCount} জন</span>
          </div>

          <button
            type="button"
            onClick={handleOpenNewForm}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ নতুন সংবাদ / কবিতা লিখুন</span>
          </button>
        </div>
      </div>

      {/* Write / Edit Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-4 shadow-2xl border border-slate-200 text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black font-bengali">
                  {editingArticle ? 'লেখা এডিট করুন' : 'নতুন সংবাদ বা কবিতা প্রকাশ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bengali">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-slate-700 font-bold">শিরোনাম (Title) *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: প্যারিস রোডের কুয়াশা ভেজা ভোর"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">ক্যাটাগরি *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="research">🔬 গবেষণা ও রিসার্চ পেপার (Research Paper)</option>
                    <option value="music">🎵 ক্যাম্পাস গান ও সুর (Songs & Music)</option>
                    <option value="talent">💡 রাবি প্রতিভা ও উদ্ভাবন (RU Talent)</option>
                    <option value="poetry">✍️ সাহিত্য ও কবিতা (Poetry & Literature)</option>
                    <option value="news">📰 দৈনিক ক্যাম্পাস সংবাদ (Daily News)</option>
                    <option value="literature">📖 গল্প ও স্মৃতিচারণ (Campus Stories)</option>
                  </select>
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">লেখক / প্রতিবেদকের নাম *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="যেমন: সাদিয়া ইসলাম"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">বিভাগ ও সেশন</label>
                  <input
                    type="text"
                    value={authorDept}
                    onChange={(e) => setAuthorDept(e.target.value)}
                    placeholder="যেমন: বাংলা বিভাগ, ২০১৯-২০"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">ভূমিকা / পরিচয়</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="যেমন: শিক্ষার্থী ও কবি"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-slate-800 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-600" />
                    <span>ফিচার ছবি (Featured Picture)</span>
                  </span>
                  {isUploading && <span className="text-emerald-600 text-[11px] animate-pulse">ছবি আপলোড হচ্ছে...</span>}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="অথবা সরাসরি ছবির ওয়েব লিঙ্ক দিন (URL)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {imageUrl && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300">
                    <img src={imageUrl} alt="প্রিভিউ" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* External Paper / Song / Media Link */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">
                  রিসার্চ পেপার DOI / PDF লিংক অথবা ইউটিউব/অডিও গান লিঙ্ক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="যেমন: https://doi.org/... অথবা https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Content Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold">মূল লেখা / কবিতা / সংবাদ *</label>
                  <span className="text-[11px] text-slate-500">
                    (কবিতার প্রতিটি স্তবকের মাঝে একটি খালি লাইন দিন)
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="এখানে আপনার সম্পূর্ণ কবিতা, গল্প বা ক্যাম্পাস সংবাদের বিবরণ লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">ট্যাগসমূহ (কমা দিয়ে লিখুন)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="যেমন: কবিতা, প্যারিস রোড, রাবি"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">স্ট্যাটাস</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="published">সরাসরি প্রকাশিত (Published)</option>
                    <option value="draft">খসড়া (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Push Notification Broadcast Checkbox */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-blue-900">
                  <input
                    type="checkbox"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🔔 প্রকাশের সাথে সাথে সকল সাবস্ক্রাইবারকে ব্রাউজার নোটিফিকেশন পাঠান</span>
                </label>
                <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                  {subscriberCount} জন সাবস্ক্রাইবার
                </span>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingArticle ? 'আপডেট করুন' : 'প্রকাশ করুন'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Articles List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-800 font-bengali">
            সকল পোস্ট তালিকা ({articles.length}টি)
          </h4>
        </div>

        <div className="divide-y divide-slate-100">
          {articles.map((art) => (
            <div key={art.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3.5">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black font-bengali">
                      {art.categoryBn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bengali">
                      {art.publishedAt}
                    </span>
                  </div>

                  <h5 className="text-sm font-black text-slate-900 font-bengali leading-snug">
                    {art.title}
                  </h5>

                  <div className="text-[11px] text-slate-500 font-bengali flex items-center gap-2">
                    <User className="h-3 w-3 text-slate-400" />
                    <span>{art.authorName}</span>
                    <span>•</span>
                    <span className="text-slate-600">{art.authorDept}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                      <Heart className="h-3 w-3 fill-current" />
                      {art.likesCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleEdit(art)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all font-bengali"
                >
                  <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(art.id)}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
