'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Flavor } from '@/types/flavor';
import { FlavorDetail } from './flavor-detail';
import { useResource } from '@/contexts/resource-context';

export default function FlavorList() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const { selectedFlavor, setSelectedFlavor } = useResource();

  useEffect(() => {
    const fetchFlavors = async () => {
      try {
        const response = await fetch('/api/flavors');
        const data = await response.json();
        if (data.result) {
          setFlavors(data.result);
        }
      } catch (error) {
        console.error('Error fetching flavors:', error);
      }
    };

    fetchFlavors();
  }, []);

  const formatMemory = (memory: number) => {
    return memory >= 1024 ? `${memory / 1024}GB` : `${memory}MB`;
  };

  const handleCardClick = (flavorId: string, event: React.MouseEvent) => {
    // Ctrl/Cmd + 클릭으로 상세 정보 보기
    if (event.ctrlKey || event.metaKey) {
      setSelectedDetailId(flavorId);
    } else {
      // 일반 클릭으로 선택/해제
      setSelectedFlavor(selectedFlavor === flavorId ? null : flavorId);
    }
  };

  const handleCloseDetail = () => {
    setSelectedDetailId(null);
  };

  return (
    <>
      <Box mb={2} p={2} bgcolor="info.main" color="white" borderRadius={1}>
        Ctrl(Cmd) + 클릭으로 상세 정보를 볼 수 있습니다.
      </Box>

      <Grid container spacing={3}>
        {flavors.map((flavor) => {
          const monthlyPrice = Number(flavor.price.full.KRW.price);
          const monthlyVat = Number(flavor.price.full.KRW.vat);
          const monthlyTotal = Number(flavor.price.full.KRW.total);
          const dailyTotal = Number(flavor.price.partial.KRW.total);

          return (
            <Grid item xs={12} sm={6} md={4} key={flavor.flavor_id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ...(selectedFlavor === flavor.flavor_id && {
                    border: '2px solid',
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  }),
                  '&:hover': {
                    bgcolor: selectedFlavor === flavor.flavor_id ? 'primary.50' : 'grey.50',
                  }
                }}
                onClick={(e) => handleCardClick(flavor.flavor_id, e)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Typography variant="h6" gutterBottom>
                      {flavor.name}
                    </Typography>
                    {selectedFlavor === flavor.flavor_id && (
                      <Chip 
                        label="선택됨" 
                        color="primary" 
                        size="small" 
                      />
                    )}
                  </Box>
                  <Box mb={2}>
                    <Chip 
                      label={flavor.provide} 
                      color={flavor.provide === 'dedicated' ? 'primary' : 'default'} 
                      size="small" 
                    />
                    <Chip 
                      label={flavor.status} 
                      color={flavor.status === 'available' ? 'success' : 'error'} 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Type: {flavor.spec.type}
                  </Typography>
                  <Typography variant="body2">
                    vCPU: {flavor.spec.vcpu} / Memory: {formatMemory(flavor.spec.memory)}
                  </Typography>
                  <Typography variant="body2">
                    Disk: {flavor.spec.disk}GB / Network: {flavor.spec.network}Gbps
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Monthly Price
                    </Typography>
                    <Typography variant="body2">
                      Price: ₩{monthlyPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      VAT: ₩{monthlyVat.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      Total: ₩{monthlyTotal.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      Daily Price
                    </Typography>
                    <Typography variant="body2">
                      ₩{dailyTotal.toLocaleString()} / day
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {selectedDetailId && (
        <FlavorDetail 
          flavorId={selectedDetailId} 
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
} 