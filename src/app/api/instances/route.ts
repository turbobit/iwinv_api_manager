import { NextResponse } from 'next/server';
import { NetworkAdapter } from '@/lib/networkAdapter';
import { cookies } from 'next/headers';
import { CreateInstanceRequest } from '@/types/instance';

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    const response = await networkAdapter.request({
      method: 'GET',
      path: '/v1/instances',
      queryParams: { page }
    });
    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching instances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instances' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body: CreateInstanceRequest = await request.json();

    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    const response = await networkAdapter.request({
      method: 'POST',
      path: '/v1/instances',
      body
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating instance:', error);
    return NextResponse.json(
      { error: 'Failed to create instance' },
      { status: 500 }
    );
  }
} 