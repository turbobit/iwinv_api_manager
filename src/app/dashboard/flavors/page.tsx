'use client';

import { Suspense } from 'react';
import FlavorList from './flavor-list';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function FlavorsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flavors</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <FlavorList />
      </Suspense>
    </div>
  );
} 