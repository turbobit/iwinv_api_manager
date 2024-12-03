import { NetworkAdapter } from '@/lib/networkAdapter';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessKey = cookieStore.get('accessKey')?.value;
    const secretKey = cookieStore.get('secretKey')?.value;

    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { error: 'Authentication credentials not found' },
        { status: 401 }
      );
    }

    const adapter = new NetworkAdapter(accessKey, secretKey);
    const response = await adapter.request({
      path: '/v1/flavors',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Flavors API Error:', error);
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Flavor 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 