import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/lib/store';
import { Order } from '@/lib/types';
import { generateToken } from '@/lib/utils';

let ordersCache: Order[] = [...INITIAL_ORDERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const phone = searchParams.get('phone');
  const adminPin = request.headers.get('x-admin-pin');
  const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

  // Admin access with valid PIN returns all orders
  if (adminPin === expectedPin) {
    return NextResponse.json({
      success: true,
      orders: ordersCache,
    });
  }

  // Customer order tracking: strictly enforces compound key (OrderNumber + Phone)
  // Prevents IDOR (Insecure Direct Object Reference)
  if (!orderNumber || !phone) {
    return NextResponse.json(
      { success: false, message: 'Both Order Number and Phone Number are required for tracking verification.' },
      { status: 400 }
    );
  }

  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
  const foundOrder = ordersCache.find(
    (o) =>
      o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
      o.customerPhone.replace(/[^0-9]/g, '') === cleanPhone
  );

  if (!foundOrder) {
    return NextResponse.json(
      { success: false, message: 'No matching order found with the provided credentials.' },
      { status: 404 }
    );
  }

  // Return sanitized customer view (hide internal profit margins)
  const sanitized = {
    id: foundOrder.id,
    orderNumber: foundOrder.orderNumber,
    customerName: foundOrder.customerName,
    items: foundOrder.items,
    subtotal: foundOrder.subtotal,
    deliveryFee: foundOrder.deliveryFee,
    total: foundOrder.total,
    status: foundOrder.status,
    deliveryMethod: foundOrder.deliveryMethod,
    paymentMethod: foundOrder.paymentMethod,
    steadfastTrackingCode: foundOrder.steadfastTrackingCode,
    createdAt: foundOrder.createdAt,
  };

  return NextResponse.json({
    success: true,
    order: sanitized,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: Customer details and items are required.' },
        { status: 400 }
      );
    }

    // Defensive server-side pricing recalculation
    let subtotal = 0;
    let estimatedCost = 0;

    for (const item of body.items) {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price) || 0;
      subtotal += price * qty;
      estimatedCost += Math.round(price * 0.55) * qty;
    }

    const deliveryFee = body.deliveryMethod === 'ru_campus_pickup' ? 0 : 70;
    const total = subtotal + deliveryFee;
    const netProfit = subtotal - estimatedCost;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateToken('RU-ORD'),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerAddress: body.customerAddress?.trim() || 'RU Campus Point',
      deliveryMethod: body.deliveryMethod || 'ru_campus_pickup',
      paymentMethod: body.paymentMethod || 'cash_on_delivery',
      items: body.items,
      subtotal,
      deliveryFee,
      total,
      estimatedCost,
      netProfit,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    ordersCache.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
