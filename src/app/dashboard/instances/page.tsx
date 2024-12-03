'use client';

import { Suspense, useState } from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InstanceList from './instance-list';
import { LoadingSpinner } from '@/components/loading-spinner';
import { CreateInstanceModal } from './create-instance-modal';
import { useResource } from '@/contexts/resource-context';

export default function InstancesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { selectedZone, selectedFlavor, selectedImage } = useResource();

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // 인스턴스 목록 새로고침 등의 작업
  };

  return (
    <div className="p-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <h1 className="text-2xl font-bold">Instances</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          disabled={!selectedZone || !selectedFlavor || !selectedImage}
        >
          인스턴스 생성
        </Button>
      </Box>

      {(!selectedZone || !selectedFlavor || !selectedImage) && (
        <Box mb={4} p={2} bgcolor="info.main" color="white" borderRadius={1}>
          인스턴스를 생성하려면 Zone, Flavor, Image를 먼저 선택해주세요.
        </Box>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <InstanceList />
      </Suspense>

      <CreateInstanceModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
} 