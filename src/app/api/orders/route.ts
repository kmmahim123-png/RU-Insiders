import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder, updateOrderStatus, deleteOrder, getProducts } from '@/lib/db';
import { Order, CartItem } from '@/lib/types';
import { generateToken } from '@/lib/utils';
import { verifyAdminAuth } from '@/lib/auth';

const CUSTOM_BASE_PRICES: Record<string, number> = {
  jersey: 650,
  dropshoulder: 580,
  hoodie: 1150,
  tshirt: 390,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');
    const isAdmin = verifyAdminAuth(request);

    const orders = await getOrders();

    // Admin access returns all orders
    if (isAdmin) {
      return NextResponse.json({
        success: true,
        orders,
      });
    }

    // Customer order tracking: strictly enforces compound key (OrderNumber + Phone)
    if (!orderNumber || !phone) {
      return NextResponse.json(
        { success: false, message: 'Both Order Number and Phone Number are required for tracking verification.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    const foundOrder = orders.find(
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

    // Return sanitized customer view
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: Customer name, phone, and items array are required.' },
        { status: 400 }
      );
    }

    // Strict 11-digit Bangladeshi mobile number validation
    const cleanPhone = body.customerPhone.toString().replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'মোবাইল নম্বর অবশ্যই ১১ সংখ্যার হতে হবে এবং 01 দিয়ে শুরু হতে হবে (যেমন: 017XXXXXXXX)।' 
        },
        { status: 400 }
      );
    }

    // Server-side price verification against catalog to eliminate price tampering
    const catalogProducts = await getProducts();
    const productCatalog = new Map(catalogProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    let estimatedCost = 0;
    const validatedItems: CartItem[] = [];

    for (const rawItem of body.items) {
      const qty = Math.max(1, Math.min(100, Number(rawItem.quantity) || 1));
      let unitPrice = 0;
      let unitCost = 0;

      // Check if item corresponds to an official catalog product
      const catalogMatch = productCatalog.get(rawItem.productId);
      if (catalogMatch) {
        unitPrice = catalogMatch.price;
        unitCost = catalogMatch.costPrice || Math.round(catalogMatch.price * 0.55);
      } else if (rawItem.productId?.startsWith('custom-') || rawItem.customization) {
        // Compute canonical customizer price
        const garment = (rawItem.customization?.garmentType || 'hoodie').toLowerCase();
        const base = CUSTOM_BASE_PRICES[garment] || 600;
        const customization = rawItem.customization || {};
        const fee =
          (customization.customText ? 50 : 0) +
          (customization.uploadedImage ? 70 : 0) +
          (customization.playerName ? 50 : 0) +
          (customization.playerNumber ? 50 : 0);
        unitPrice = base + fee;
        unitCost = Math.round(unitPrice * 0.55);
      } else {
        // Fallback for custom or legacy items: enforce shop minimum price floor
        unitPrice = Math.max(350, Number(rawItem.price) || 350);
        unitCost = Math.round(unitPrice * 0.55);
      }

      subtotal += unitPrice * qty;
      estimatedCost += unitCost * qty;

      validatedItems.push({
        ...rawItem,
        price: unitPrice,
        quantity: qty,
      });
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
      items: validatedItems,
      subtotal,
      deliveryFee,
      total,
      estimatedCost,
      netProfit,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await addOrder(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully and validated against catalog.',
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
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
    const { id, status, steadfastTrackingCode, steadfastConsignmentId, cancelledFrom, riderName } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required.' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status, steadfastTrackingCode, steadfastConsignmentId, cancelledFrom, riderName);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated in database.',
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
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
      return NextResponse.json({ success: false, message: 'Order ID required.' }, { status: 400 });
    }

    await deleteOrder(id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted from database.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
