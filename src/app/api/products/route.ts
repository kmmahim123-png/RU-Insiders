import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, deleteProduct, moveProductPosition, updateProduct } from '@/lib/db';
import { Product } from '@/lib/types';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const allProducts = await getProducts();
    let filtered = [...allProducts];

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

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
      name: body.name.trim(),
      nameBn: body.nameBn?.trim() || '',
      category: body.category,
      description: body.description?.trim() || 'RU Insiders Official Apparel',
      price: Number(body.price),
      regularPrice: body.regularPrice ? Number(body.regularPrice) : Math.round(Number(body.price) * 1.25),
      costPrice: body.costPrice ? Number(body.costPrice) : Math.round(Number(body.price) * 0.6),
      images: body.images && body.images.length > 0 ? body.images : [
        '/logo.png'
      ],
      colors: body.colors || [{ name: 'Heritage Maroon', hex: '#881337' }, { name: 'Royal Blue', hex: '#1d4ed8' }],
      sizes: body.sizes || ['M', 'L', 'XL', 'XXL'],
      stock: Number(body.stock || 25),
      salesCount: 0,
      isCustomizable: Boolean(body.isCustomizable),
      isStoryHighlight: Boolean(body.isStoryHighlight ?? body.featured),
      featured: Boolean(body.featured ?? true),
      badge: body.badge || 'New Arrival',
      orderIndex: 0,
      video: body.video?.trim() || undefined,
    };

    const updatedList = await addProduct(newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product added successfully to database and live store.',
      product: newProduct,
      products: updatedList,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required for deletion.' },
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Product not found in database.' },
        { status: 404 }
      );
    }

    const currentProducts = await getProducts();

    return NextResponse.json({
      success: true,
      message: 'Product successfully deleted from database.',
      products: currentProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action, direction, updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required.' }, { status: 400 });
    }

    if (action === 'move' && (direction === 'up' || direction === 'down')) {
      const updatedList = await moveProductPosition(id, direction);
      return NextResponse.json({
        success: true,
        message: `Product moved ${direction} successfully.`,
        products: updatedList,
      });
    }

    if (action === 'update' && updates) {
      const updated = await updateProduct(id, updates);
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully.',
        product: updated,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product position' },
      { status: 500 }
    );
  }
}
