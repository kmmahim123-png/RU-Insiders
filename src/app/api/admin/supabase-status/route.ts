import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/auth';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PRINT_JOBS } from '@/lib/store';
import { readDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return NextResponse.json({
        success: true,
        configured: false,
        message: 'Supabase is not configured yet. Running in local/serverless fallback mode.',
      });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        configured: false,
        message: 'Could not initialize Supabase client.',
      });
    }

    // Test connectivity
    const { count: productCount, error: pError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: orderCount, error: oError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: printCount, error: prError } = await supabase
      .from('print_jobs')
      .select('*', { count: 'exact', head: true });

    if (pError || oError || prError) {
      return NextResponse.json({
        success: true,
        configured: true,
        connected: false,
        error: pError?.message || oError?.message || prError?.message,
        message: 'Supabase environment variables exist, but database tables might need schema setup.',
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      connected: true,
      counts: {
        products: productCount ?? 0,
        orders: orderCount ?? 0,
        printJobs: printCount ?? 0,
      },
      message: 'Supabase Cloud Database connected and healthy.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error checking Supabase status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel/env.' },
        { status: 400 }
      );
    }

    const currentDb = await readDb();

    // Seed products
    const productRows = currentDb.products.map((p, idx) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      name_bn: p.nameBn || '',
      category: p.category,
      description: p.description || '',
      price: p.price,
      regular_price: p.regularPrice || null,
      cost_price: p.costPrice || null,
      images: p.images || [],
      colors: p.colors || [],
      sizes: p.sizes || ['M', 'L', 'XL', 'XXL'],
      stock: p.stock || 0,
      customizable: Boolean(p.isCustomizable),
      order_index: idx,
      video: p.video || '',
      badge: p.badge || '',
      updated_at: new Date().toISOString(),
    }));

    const { error: pErr } = await supabase.from('products').upsert(productRows, { onConflict: 'id' });
    if (pErr) throw new Error(`Product sync error: ${pErr.message}`);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${productRows.length} products to Supabase cloud!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error syncing data to Supabase' },
      { status: 500 }
    );
  }
}
