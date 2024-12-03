'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Instance } from '@/types/instance';

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

  return (
    <>
      {instances.length === 0 && !loading ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            활성화된 인스턴스가 없습니다.
          </Typography>
        </Box>
      ) : (
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
                  </Box>
                  <Box mb={2}>
                    <Chip 
                      label={instance.status} 
                      color={instance.status === 'active' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                  <Box mt={2}>
                    <Typography variant="body2">
                      Zone: {instance.zone.name}
                    </Typography>
                    <Typography variant="body2">
                      Provide: {instance.provide}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {loading && (
        <Box mt={3} textAlign="center">
          <Typography>로딩중...</Typography>
        </Box>
      )}
    </>
  );
} 