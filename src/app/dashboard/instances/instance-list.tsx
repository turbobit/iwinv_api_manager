'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Instance } from '@/types/instance';
import { InstanceDetail } from './instance-detail';

export default function InstanceList() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();
  const isFirstRender = useRef(true);

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
    if (!isFirstRender.current) return;

    const fetchInstances = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/instances?page=${pageNo}`);
        const data = await response.json();
        
        if (data.result) {
          setInstances(data.result);
          setHasMore(data.result.length > 0 && data.page_no * data.page_size < data.count);
        }
      } catch (error) {
        console.error('Error fetching instances:', error);
      } finally {
        setLoading(false);
        isFirstRender.current = false;
      }
    };

    fetchInstances();
  }, [pageNo]);

  useEffect(() => {
    if (isFirstRender.current) return;

    const fetchMoreInstances = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/instances?page=${pageNo}`);
        const data = await response.json();
        
        if (data.result) {
          setInstances(prev => {
            const existingIds = new Set(prev.map(i => i.instance_id));
            const newInstances = data.result.filter((instance: Instance) => 
              !existingIds.has(instance.instance_id)
            );
            return [...prev, ...newInstances];
          });
          setHasMore(data.result.length > 0 && data.page_no * data.page_size < data.count);
        }
      } catch (error) {
        console.error('Error fetching instances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreInstances();
  }, [pageNo]);

  // 인스턴스 삭제 후 목록 새로고침을 위한 이벤트 리스너
  useEffect(() => {
    const handleRefresh = () => {
      setInstances([]);
      setPageNo(1);
      setHasMore(true);
    };

    window.addEventListener('refreshInstanceList', handleRefresh);
    return () => {
      window.removeEventListener('refreshInstanceList', handleRefresh);
    };
  }, []);

  const handleCardClick = (instanceId: string, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      setSelectedDetailId(instanceId);
    }
  };

  return (
    <>
      <Box mb={2} p={2} bgcolor="info.main" color="white" borderRadius={1}>
        Ctrl(Cmd) + 클릭으로 상세 정보를 볼 수 있습니다.
      </Box>

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
              key={`${instance.instance_id}-${index}`}
              ref={index === instances.length - 1 ? lastInstanceElementRef : undefined}
            >
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  }
                }}
                onClick={(e) => handleCardClick(instance.instance_id, e)}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {instance.name}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2">
                      Zone: {instance.zone.name}
                    </Typography>
                    <Typography variant="body2">
                      Status: {instance.status}
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

      {selectedDetailId && (
        <InstanceDetail
          instanceId={selectedDetailId}
          onClose={() => setSelectedDetailId(null)}
        />
      )}
    </>
  );
} 