'use client';

import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Flavor } from '@/types/flavor';

interface FlavorDetailProps {
  flavorId: string;
  onClose: () => void;
}

export function FlavorDetail({ flavorId, onClose }: FlavorDetailProps) {
  const [flavor, setFlavor] = useState<Flavor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlavorDetail = async () => {
      try {
        const response = await fetch(`/api/flavors/${flavorId}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setFlavor(data.result[0]);
        }
      } catch (error) {
        console.error('Error fetching flavor detail:', error);
        setError('Failed to load flavor details');
      }
    };

    fetchFlavorDetail();
  }, [flavorId]);

  const formatMemory = (memory: number) => {
    return memory >= 1024 ? `${memory / 1024}GB` : `${memory}MB`;
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!flavor) return <Typography>Loading...</Typography>;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{flavor.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
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

        <Typography variant="h6" gutterBottom>Specifications</Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Type</Typography>
            <Typography variant="body1">{flavor.spec.type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">vCPU</Typography>
            <Typography variant="body1">{flavor.spec.vcpu}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Memory</Typography>
            <Typography variant="body1">{formatMemory(flavor.spec.memory)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Disk</Typography>
            <Typography variant="body1">{flavor.spec.disk}GB</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Network</Typography>
            <Typography variant="body1">{flavor.spec.network}Gbps</Typography>
          </Grid>
          {flavor.spec.gpu && (
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">GPU</Typography>
              <Typography variant="body1">{flavor.spec.gpu}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Pricing</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Monthly</Typography>
            <Box>
              {flavor.price?.full?.KRW && (() => {
                const monthlyPrice = Number(flavor.price?.full?.KRW);
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
          </Grid>
          <Grid item xs={12} sm={6}>
            
            <Typography variant="subtitle1" gutterBottom>Daily</Typography>
            <Box>
              {flavor.price?.partial?.KRW && (() => {
                const dailyPrice = Number(flavor.price?.partial?.KRW);
                return (
                  <>
                    <Typography variant="body2">
                      Price: ₩{dailyPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      VAT: ₩{(dailyPrice * 0.2).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      Total: ₩{(dailyPrice * 1.1).toLocaleString()}
                    </Typography>
                  </>
                );
              })()}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Support</Typography>
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Supporting Images</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {flavor.supporting_images.map((image) => (
              <Chip key={image} label={image} size="small" />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Available Zones</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {flavor.zone.map((zone) => (
              <Chip key={zone} label={zone} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 