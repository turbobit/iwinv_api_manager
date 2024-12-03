'use client';

import { Suspense } from 'react';
import { ZoneList } from './zone-list';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function ZonePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Zones</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ZoneList />
      </Suspense>
    </div>
  );
} 