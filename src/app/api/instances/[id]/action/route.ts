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

    const body = await request.json();
    const { action, ...actionData } = body;

    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    let response;

    switch (action) {
      case 'start':
        response = await networkAdapter.request({
          method: 'POST',
          path: `/v1/instances/${params.id}/start`
        });
        break;
      case 'shutdown':
        response = await networkAdapter.request({
          method: 'POST',
          path: `/v1/instances/${params.id}/shutdown`
        });
        break;
      case 'reboot':
        response = await networkAdapter.request({
          method: 'POST',
          path: `/v1/instances/${params.id}/reboot`,
          body: { type: actionData.type }
        });
        break;
      case 'rebuild':
        response = await networkAdapter.request({
          method: 'POST',
          path: `/v1/instances/${params.id}/rebuild`,
          body: { image_id: actionData.imageId }
        });
        break;
      case 'resize':
        response = await networkAdapter.request({
          method: 'POST',
          path: `/v1/instances/${params.id}/resize`,
          body: { flavor_id: actionData.flavorId }
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error performing instance action:', error);
    return NextResponse.json(
      { error: 'Failed to perform instance action' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Props) {
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

    const body = await request.json();
    const networkAdapter = new NetworkAdapter(accessKey, secretKey);
    const response = await networkAdapter.request({
      method: 'PUT',
      path: `/v1/instances/${params.id}`,
      body
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating instance:', error);
    return NextResponse.json(
      { error: 'Failed to update instance' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
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
      method: 'DELETE',
      path: `/v1/instances/${params.id}`
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting instance:', error);
    return NextResponse.json(
      { error: 'Failed to delete instance' },
      { status: 500 }
    );
  }
} 