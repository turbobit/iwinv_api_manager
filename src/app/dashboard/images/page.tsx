'use client';

import { Suspense } from 'react';
import ImageList from './image-list';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function ImagesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ImageList />
      </Suspense>
    </div>
  );
} 