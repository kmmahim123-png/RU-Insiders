import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { INITIAL_CAMPUS_ARTICLES, CampusArticle } from '@/lib/campusNews';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('campus_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, articles: data, source: 'supabase' });
      }
    }
  } catch (err) {
    console.warn('Supabase articles fetch failed, falling back to local seed', err);
  }

  return NextResponse.json({
    success: true,
    articles: INITIAL_CAMPUS_ARTICLES,
    source: 'fallback',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article: CampusArticle = {
      id: body.id || `art-${Date.now()}`,
      title: body.title || 'শিরোনামহীন লেখা',
      subtitle: body.subtitle || '',
      category: body.category || 'poetry',
      categoryBn: body.categoryBn || 'সাহিত্য ও কবিতা',
      authorName: body.authorName || 'নাম প্রকাশে অনিচ্ছুক',
      authorDept: body.authorDept || 'রাজশাহী বিশ্ববিদ্যালয়',
      authorRole: body.authorRole || 'শিক্ষার্থী',
      publishedAt: body.publishedAt || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
      content: body.content || '',
      excerpt: body.excerpt || (body.content ? body.content.slice(0, 160) + '...' : ''),
      tags: Array.isArray(body.tags) ? body.tags : ['রাবি সাহিত্য'],
      likesCount: body.likesCount || 0,
      isFeatured: !!body.isFeatured,
      status: body.status || 'published',
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('campus_articles')
        .upsert(article, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, article: data, source: 'supabase' });
      }
    }

    return NextResponse.json({ success: true, article, source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('campus_articles').delete().eq('id', id);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
