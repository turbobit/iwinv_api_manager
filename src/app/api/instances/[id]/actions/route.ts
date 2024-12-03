import { NextResponse } from 'next/server';
import { NetworkAdapter } from '@/lib/networkAdapter';
import { cookies } from 'next/headers';

interface Props {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Props) {
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

    const { action, ...body } = await request.json();
    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    
    let path = `/v1/instances/${params.id}`;
    switch (action) {
      case 'start':
        path += '/start';
        break;
      case 'shutdown':
        path += '/shutdown';
        break;
      case 'reboot':
        path += '/reboot';
        break;
      case 'rebuild':
        path += '/rebuild';
        break;
      case 'resize':
        path += '/resize';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = await networkAdapter.request({
      method: 'POST',
      path,
      body
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error performing instance action:', error);
    return NextResponse.json(
      { error: 'Failed to perform instance action' },
      { status: 500 }
    );
  }
} 