'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { Image } from '@/types/image';
import { ImageDetail } from './image-detail';
import { useResource } from '@/contexts/resource-context';

export default function ImageList() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const { selectedImage, setSelectedImage } = useResource();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        if (data.result) {
          setImages(data.result);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleCardClick = (imageId: string, event: React.MouseEvent) => {
    // Ctrl/Cmd + 클릭으로 상세 정보 보기
    if (event.ctrlKey || event.metaKey) {
      setSelectedDetailId(imageId);
    } else {
      // 일반 클릭으로 선택/해제
      setSelectedImage(selectedImage === imageId ? null : imageId);
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
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.image_id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(selectedImage === image.image_id && {
                  border: '2px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                }),
                '&:hover': {
                  bgcolor: selectedImage === image.image_id ? 'primary.50' : 'grey.50',
                }
              }}
              onClick={(e) => handleCardClick(image.image_id, e)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Typography variant="h6" gutterBottom>
                    {image.os.name}
                  </Typography>
                  {selectedImage === image.image_id && (
                    <Chip 
                      label="선택됨" 
                      color="primary" 
                      size="small" 
                    />
                  )}
                </Box>
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

      {selectedDetailId && (
        <ImageDetail 
          imageId={selectedDetailId} 
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
} 