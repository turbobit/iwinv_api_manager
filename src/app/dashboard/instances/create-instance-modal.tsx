'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useResource } from '@/contexts/resource-context';

interface CreateInstanceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInstanceModal({ open, onClose, onSuccess }: CreateInstanceModalProps) {
  const { selectedZone, selectedFlavor, selectedImage } = useResource();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedZone || !selectedFlavor || !selectedImage) {
      setError('Zone, Flavor, Image를 모두 선택해주세요.');
      return;
    }

    if (!name.trim()) {
      setError('인스턴스 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          zone_id: selectedZone,
          image_id: selectedImage,
          flavor_id: selectedFlavor,
        }),
      });

      if (!response.ok) {
        throw new Error('인스턴스 생성에 실패했습니다.');
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>인스턴스 생성</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="인스턴스 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              선택된 리소스
            </Typography>
            <Typography variant="body2">
              Zone: {selectedZone || '선택되지 않음'}
            </Typography>
            <Typography variant="body2">
              Flavor: {selectedFlavor || '선택되지 않음'}
            </Typography>
            <Typography variant="body2">
              Image: {selectedImage || '선택되지 않음'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? '생성 중...' : '생성'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 