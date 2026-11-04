import { NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/store';
import { Product } from '@/lib/types';

// In-memory runtime cache for products with mock store
let productsCache: Product[] = [...INITIAL_PRODUCTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let filtered = [...productsCache];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameBn && p.nameBn.includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    products: filtered,
  });
}

export async function POST(request: Request) {
  try {
    // Admin role verification check (Marketplace Audit #3)
    const authHeader = request.headers.get('authorization');
    const adminPin = request.headers.get('x-admin-pin');

    // Default PIN or environment PIN check
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';
    if (adminPin !== expectedPin && authHeader !== `Bearer ${expectedPin}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Input Validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Validation failed: Name, price, and category are required.' },
        { status: 400 }
      );
    }

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: body.name,
      nameBn: body.nameBn || '',
      category: body.category,
      description: body.description || '',
      price: Number(body.price),
      regularPrice: body.regularPrice ? Number(body.regularPrice) : Number(body.price) * 1.25,
      costPrice: body.costPrice ? Number(body.costPrice) : Number(body.price) * 0.6,
      images: body.images && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      ],
      colors: body.colors || [{ name: 'Default Heritage', hex: '#881337' }],
      sizes: body.sizes || ['M', 'L', 'XL'],
      stock: Number(body.stock || 20),
      salesCount: 0,
      isCustomizable: Boolean(body.isCustomizable),
      featured: Boolean(body.featured),
      badge: body.badge || 'New Arrival',
    };

    productsCache.unshift(newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
