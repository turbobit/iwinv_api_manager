'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, IconButton } from '@mui/material';
import { Instance } from '@/types/instance';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InstanceList() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const observer = useRef<IntersectionObserver>();

  const lastInstanceElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNo(prevPageNo => prevPageNo + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/instances?page=${pageNo}`);
        const data = await response.json();
        if (data.result) {
          console.log(data.result);
          setInstances(prev => [...prev, ...data.result]);
          setHasMore(data.result.length > 0 && data.page_no * data.page_size < data.count);
        }
      } catch (error) {
        console.error('Error fetching instances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, [pageNo]);

  const handleAction = async (instanceId: string, action: string) => {
    try {
      const response = await fetch(`/api/instances/${instanceId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      // Refresh instance list
      const updatedResponse = await fetch(`/api/instances?page=1`);
      const data = await updatedResponse.json();
      if (data.result) {
        setInstances(data.result);
        setPageNo(1);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const formatMemory = (memory: number) => {
    return memory >= 1024 ? `${memory / 1024}GB` : `${memory}MB`;
  };

  return (
    <>
      <Grid container spacing={3}>
        {instances.map((instance, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={instance.instance_id}
            ref={index === instances.length - 1 ? lastInstanceElementRef : undefined}
          >
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {instance.name}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleAction(instance.instance_id, instance.power === 'on' ? 'shutdown' : 'start')}
                    >
                      <PowerSettingsNewIcon color={instance.power === 'on' ? 'success' : 'error'} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleAction(instance.instance_id, 'reboot')}
                    >
                      <RestartAltIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleAction(instance.instance_id, 'delete')}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box mb={2}>
                  <Chip 
                    label={instance.status} 
                    color={instance.status === 'active' ? 'success' : 'default'} 
                    size="small" 
                  />
                  {instance.task && (
                    <Chip 
                      label={instance.task} 
                      color="warning" 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {instance.description || 'No description'}
                </Typography>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Specifications
                  </Typography>
                  <Typography variant="body2">
                    Type: {instance.flavor.spec.type}
                  </Typography>
                  <Typography variant="body2">
                    vCPU: {instance.flavor.spec.vcpu} / Memory: {formatMemory(instance.flavor.spec.memory)}
                  </Typography>
                  <Typography variant="body2">
                    Disk: {instance.flavor.spec.disk}GB
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Image
                  </Typography>
                  <Typography variant="body2">
                    {instance.image.name} ({instance.image.os_type} {instance.image.version})
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Networks
                  </Typography>
                  {instance.networks.map((network) => (
                    <Typography key={network.network_id} variant="body2">
                      {network.name}: {network.ip}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box mt={3} textAlign="center">
          <Typography>Loading...</Typography>
        </Box>
      )}
    </>
  );
} 