import { NextResponse } from 'next/server';
import { NetworkAdapter } from '@/lib/networkAdapter';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessKey = cookieStore.get('accessKey')?.value;
    const secretKey = cookieStore.get('secretKey')?.value;

    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    const response = await networkAdapter.request({
      method: 'GET',
      path: '/v1/images',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
} 