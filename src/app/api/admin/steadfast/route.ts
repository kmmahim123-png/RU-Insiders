import { NextRequest, NextResponse } from 'next/server';
import { getSteadfastConfig, updateSteadfastConfig, updateOrderStatus } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

function sanitizeBaseUrl(url?: string): string {
  if (!url || url.includes('steadfast.com.bd')) {
    return 'https://portal.packzy.com/api/v1';
  }
  return url.trim().replace(/\/+$/, '');
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const config = await getSteadfastConfig();
    config.baseUrl = sanitizeBaseUrl(config.baseUrl);
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
      const sanitized = {
        ...body.config,
        baseUrl: sanitizeBaseUrl(body.config?.baseUrl),
      };
      const updated = await updateSteadfastConfig(sanitized);
      return NextResponse.json({
        success: true,
        message: 'Steadfast configuration saved in database.',
        config: updated,
      });
    }

    const config = await getSteadfastConfig();
    const apiKey = (process.env.STEADFAST_API_KEY || body.apiKey || config.apiKey || '').trim();
    const secretKey = (process.env.STEADFAST_SECRET_KEY || body.secretKey || config.secretKey || '').trim();
    const baseUrl = sanitizeBaseUrl(process.env.STEADFAST_BASE_URL || body.baseUrl || config.baseUrl);

    // Action: Test API connection and balance
    if (body.action === 'test_connection') {
      if (!apiKey || !secretKey || apiKey.startsWith('DEMO_')) {
        return NextResponse.json({
          success: false,
          message: 'লাইভ API Key এবং Secret Key প্রয়োজন। ডেমো কি দিয়ে লাইভ টেস্ট করা যাবে না।',
        }, { status: 400 });
      }

      try {
        const testRes = await fetch(`${baseUrl}/get_balance`, {
          method: 'GET',
          headers: {
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
            'Accept': 'application/json',
          },
        });

        const rawText = await testRes.text();
        let testData: any = null;
        try {
          testData = JSON.parse(rawText);
        } catch {
          return NextResponse.json({
            success: false,
            message: `Steadfast সার্ভার থেকে অপ্রত্যাশিত রেসপন্স এসেছে (HTTP ${testRes.status})। Base URL: ${baseUrl} সঠিক কি না যাচাই করুন।`,
          }, { status: 502 });
        }

        if (testRes.ok && testData.status === 200) {
          const balance = testData.current_balance ?? testData.balance ?? '0.00';
          return NextResponse.json({
            success: true,
            status: 200,
            balance,
            message: `সংযোগ সফল! বর্তমান স্টেডফাস্ট একাউন্ট ব্যালেন্স: ৳${balance}`,
          });
        } else {
          return NextResponse.json({
            success: false,
            status: testData.status || testRes.status,
            message: testData.message || 'ভুল API Credentials (API Key অথবা Secret Key ভুল)।',
          }, { status: 400 });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          message: `Steadfast সার্ভারের সাথে কানেক্ট করা যায়নি: ${err.message}`,
        }, { status: 502 });
      }
    }

    // Otherwise: Dispatch consignment
    const { orderId, orderNumber, recipientName, recipientPhone, recipientAddress, codAmount, note } = body;

    if (!recipientName || !recipientPhone || !recipientAddress || codAmount === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required consignment fields.' },
        { status: 400 }
      );
    }

    const isLiveKey = apiKey && secretKey && !apiKey.startsWith('DEMO_');

    let consignmentId = '';
    let trackingCode = '';

    if (isLiveKey) {
      try {
        const sfResponse = await fetch(`${baseUrl}/create_order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
          },
          body: JSON.stringify({
            invoice: String(orderNumber || `RU-${Date.now()}`),
            recipient_name: recipientName.trim(),
            recipient_phone: recipientPhone.trim(),
            recipient_address: recipientAddress.trim(),
            cod_amount: Number(codAmount) || 0,
            note: note || 'RU Insiders Merch Delivery',
          }),
        });

        const rawText = await sfResponse.text();
        let sfData: any = null;
        try {
          sfData = JSON.parse(rawText);
        } catch {
          return NextResponse.json(
            {
              success: false,
              message: `Steadfast API থেকে নন-JSON রেসপন্স এসেছে (HTTP ${sfResponse.status})। Base URL হিসেবে https://portal.packzy.com/api/v1 ব্যবহার নিশ্চিত করুন।`,
              raw: rawText.substring(0, 150),
            },
            { status: 502 }
          );
        }

        if (sfResponse.ok && sfData.status === 200 && sfData.consignment) {
          consignmentId = String(sfData.consignment.consignment_id);
          trackingCode = sfData.consignment.tracking_code;
        } else {
          const detailMessage = sfData?.message || sfData?.errors?.recipient_phone?.[0] || 'কনসাইনমেন্ট বুকিং বাতিল হয়েছে।';
          return NextResponse.json(
            {
              success: false,
              message: `Steadfast কুরিয়ার এরর: ${detailMessage}`,
              details: sfData,
            },
            { status: 400 }
          );
        }
      } catch (sfErr: any) {
        console.error('Steadfast live endpoint unreachable:', sfErr);
        return NextResponse.json(
          {
            success: false,
            message: `Steadfast Courier API-তে যোগাযোগ করা যায়নি: ${sfErr.message || 'Network timeout'}। বুকিং সম্পন্ন হয়নি।`,
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
        ? 'Steadfast Courier পার্সেল সফলভাবে লাইভ পোর্টালে বুকিং করা হয়েছে।'
        : 'ডেমো কনসাইনমেন্ট সফলভাবে তৈরি হয়েছে (টেস্টিং মোড)।',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Steadfast API error' },
      { status: 500 }
    );
  }
}
