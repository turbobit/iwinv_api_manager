'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Flavor } from '@/types/flavor';
import { FlavorDetail } from './flavor-detail';

export default function FlavorList() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);

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

  const handleCardClick = (flavorId: string) => {
    setSelectedFlavorId(flavorId);
  };

  const handleCloseDetail = () => {
    setSelectedFlavorId(null);
  };

  return (
    <>
      <Grid container spacing={3}>
        {flavors.map((flavor) => (
          <Grid item xs={12} sm={6} md={4} key={flavor.flavor_id}>
            <Card 
              sx={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(flavor.flavor_id)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {flavor.name}
                </Typography>
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
                  {flavor.price?.full?.KRW && (() => {
                    const monthlyPrice = Number(flavor.price.full.KRW);
                    return (
                      <>
                        <Typography variant="body2">
                          Price: ₩{monthlyPrice.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          VAT: ₩{(monthlyPrice * 0.1).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          Total: ₩{(monthlyPrice * 1.1).toLocaleString()}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
                <Box mt={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    Daily Price
                  </Typography>
                  <Typography variant="body2">
                    ₩{Number(flavor.price?.partial?.KRW).toLocaleString()} / day
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedFlavorId && (
        <FlavorDetail 
          flavorId={selectedFlavorId} 
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
} 