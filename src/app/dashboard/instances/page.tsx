'use client';

import { Suspense } from 'react';
import InstanceList from './instance-list';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function InstancesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Instances</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <InstanceList />
      </Suspense>
    </div>
  );
} 