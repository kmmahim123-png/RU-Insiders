import { NextRequest, NextResponse } from 'next/server';
import { getStoredSpotsData, saveStoredSpotsData } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getStoredSpotsData();
    return NextResponse.json({
      success: true,
      customTouristSpots: data.customTouristSpots,
      bannerSlides: data.bannerSlides,
      customMapPhotos: data.customMapPhotos,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching spots data' },
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
    const { action, spot, touristSpots, bannerSlides, customMapPhotos } = body;

    const currentData = await getStoredSpotsData();

    if (action === 'save_spot' && spot) {
      const existing = currentData.customTouristSpots || [];
      const updated = existing.filter((s: any) => s.id !== spot.id);
      updated.push(spot);
      await saveStoredSpotsData({ customTouristSpots: updated });
      return NextResponse.json({
        success: true,
        message: 'Tourist spot saved successfully to server and database.',
        customTouristSpots: updated,
      });
    }

    if (action === 'save_spots' && Array.isArray(touristSpots)) {
      await saveStoredSpotsData({ customTouristSpots: touristSpots });
      return NextResponse.json({
        success: true,
        message: 'All tourist spots saved successfully.',
        customTouristSpots: touristSpots,
      });
    }

    if (action === 'save_banner_slides' && Array.isArray(bannerSlides)) {
      await saveStoredSpotsData({ bannerSlides });
      return NextResponse.json({
        success: true,
        message: 'Banner slides saved successfully.',
        bannerSlides,
      });
    }

    if (action === 'save_map_photos' && customMapPhotos) {
      await saveStoredSpotsData({ customMapPhotos });
      return NextResponse.json({
        success: true,
        message: 'Map place photos saved successfully.',
        customMapPhotos,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action provided.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error saving spots data' },
      { status: 500 }
    );
  }
}
