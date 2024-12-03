import { NextResponse } from 'next/server';
import { NetworkAdapter } from '@/lib/networkAdapter';
import { cookies } from 'next/headers';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
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
      path: `/v1/images/${params.id}`,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching image detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image detail' },
      { status: 500 }
    );
  }
} 