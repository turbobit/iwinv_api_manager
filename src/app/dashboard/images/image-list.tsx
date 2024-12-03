'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Image } from '@/types/image';
import { ImageDetail } from './image-detail';

export default function ImageList() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const observer = useRef<IntersectionObserver>();

  const lastImageElementRef = useCallback((node: HTMLDivElement) => {
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
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/images?page=${pageNo}`);
        const data = await response.json();
        if (data.result) {
          setImages(prev => [...prev, ...data.result]);
          setHasMore(data.result.length > 0 && data.page_no * data.page_size < data.count);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [pageNo]);

  const handleCardClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleCloseDetail = () => {
    setSelectedImageId(null);
  };

  return (
    <>
      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={image.image_id}
            ref={index === images.length - 1 ? lastImageElementRef : undefined}
          >
            <Card 
              sx={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(image.image_id)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {image.os.name}
                </Typography>
                <Box mb={2}>
                  <Chip 
                    label={image.visibility} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={image.os.status} 
                    color={image.os.status === 'available' ? 'success' : 'error'} 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                  <Chip 
                    label={image.image_type} 
                    color="default" 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Box>
                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    OS Type: {image.os.os_type}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Version: {image.os.version}
                  </Typography>
                </Box>
                {image.os.content.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Details
                    </Typography>
                    {image.os.content.map((content, idx) => (
                      <Typography key={idx} variant="body2" color="textSecondary">
                        {content}
                      </Typography>
                    ))}
                  </Box>
                )}
                {image.zone.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Available Zones
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {image.zone.map((zone) => (
                        <Chip 
                          key={zone} 
                          label={zone} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
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

      {selectedImageId && (
        <ImageDetail 
          imageId={selectedImageId} 
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
} 