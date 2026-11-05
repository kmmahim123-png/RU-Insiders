import { NextRequest, NextResponse } from 'next/server';
import { getSteadfastConfig, updateSteadfastConfig, updateOrderStatus } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const config = await getSteadfastConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin role check failed.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if this is an API config update
    if (body.action === 'save_config') {
      const updated = await updateSteadfastConfig(body.config);
      return NextResponse.json({
        success: true,
        message: 'Steadfast configuration saved in database.',
        config: updated,
      });
    }

    // Otherwise, dispatch consignment
    const { orderId, orderNumber, recipientName, recipientPhone, recipientAddress, codAmount, note } = body;

    if (!recipientName || !recipientPhone || !recipientAddress || codAmount === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required consignment fields.' },
        { status: 400 }
      );
    }

    const config = await getSteadfastConfig();
    const apiKey = process.env.STEADFAST_API_KEY || config.apiKey;
    const secretKey = process.env.STEADFAST_SECRET_KEY || config.secretKey;
    const baseUrl = process.env.STEADFAST_BASE_URL || config.baseUrl || 'https://portal.steadfast.com.bd/api/v1';

    const isLiveKey = apiKey && secretKey && !apiKey.startsWith('DEMO_');

    let consignmentId = '';
    let trackingCode = '';

    if (isLiveKey) {
      try {
        const sfResponse = await fetch(`${baseUrl}/create_order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
          },
          body: JSON.stringify({
            invoice: orderNumber || `RU-${Date.now()}`,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            recipient_address: recipientAddress,
            cod_amount: codAmount,
            note: note || 'RU Insiders Merch Delivery',
          }),
        });

        const sfData = await sfResponse.json();

        if (sfData.status === 200 && sfData.consignment) {
          consignmentId = String(sfData.consignment.consignment_id);
          trackingCode = sfData.consignment.tracking_code;
        } else {
          return NextResponse.json(
            {
              success: false,
              message: `Steadfast API error: ${sfData.message || 'Consignment creation rejected by courier portal.'}`,
              details: sfData,
            },
            { status: 502 }
          );
        }
      } catch (sfErr: any) {
        console.error('Steadfast live endpoint unreachable:', sfErr);
        return NextResponse.json(
          {
            success: false,
            message: `Steadfast Courier API is unreachable: ${sfErr.message || 'Network timeout'}. Consignment was NOT dispatched.`,
          },
          { status: 502 }
        );
      }
    } else {
      // Demo / simulation mode: clearly labeled so admins never confuse with real dispatch
      consignmentId = `DEMO-STDFST-${Math.floor(100000 + Math.random() * 900000)}`;
      trackingCode = `DEMO-RU-SF-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Update order in database only after real consignment is verified (or in explicit demo mode)
    if (orderId) {
      await updateOrderStatus(orderId, 'shipped_steadfast', trackingCode, consignmentId);
    }

    return NextResponse.json({
      success: true,
      consignmentId,
      trackingCode,
      isDemo: !isLiveKey,
      message: isLiveKey
        ? 'Steadfast Courier consignment successfully registered with live portal.'
        : 'Demo consignment generated for testing (No live courier dispatch).',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Steadfast API error' },
      { status: 500 }
    );
  }
}
