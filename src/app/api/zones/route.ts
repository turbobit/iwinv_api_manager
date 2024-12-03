import { NetworkAdapter } from '@/lib/networkAdapter';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
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
      path: '/v1/zones',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Zones API Error:', error);
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: '존 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 