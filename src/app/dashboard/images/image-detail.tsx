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
import { Image } from '@/types/image';

interface ImageDetailProps {
    imageId: string;
    onClose: () => void;
}

export function ImageDetail({ imageId, onClose }: ImageDetailProps) {
    const [image, setImage] = useState<Image | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageDetail = async () => {
            try {
                const response = await fetch(`/api/images/${imageId}`);
                const data = await response.json();
                if (data.result && data.result.length > 0) {
                    setImage(data.result[0]);
                    console.log(data.result[0]);
                }
            } catch (error) {
                console.error('Error fetching image detail:', error);
                setError('Failed to load image details');
            }
        };

        fetchImageDetail();
    }, [imageId]);

    const formatSize = (size: number | undefined) => {
        if (!size) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let index = 0;
        let convertedSize = size;

        while (convertedSize >= 1024 && index < units.length - 1) {
            convertedSize /= 1024;
            index++;
        }

        return `${convertedSize.toFixed(2)} ${units[index]}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'available':
                return 'success';
            case 'pending':
            case 'queued':
                return 'warning';
            case 'error':
            case 'deleted':
                return 'error';
            default:
                return 'default';
        }
    };

    if (error) return <Typography color="error">{error}</Typography>;
    if (!image) return <Typography>Loading...</Typography>;

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">이미지 상세 정보</Typography>
                        <Typography variant="caption" color="textSecondary">
                            ID: {image.image_id}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">이미지 타입</Typography>
                        <Typography variant="body1">{image.image_type || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">공개 여부</Typography>
                        <Chip
                            label={image.visibility}
                            color="primary"
                            size="small"
                        />
                    </Grid>
                </Grid>

                {image.os && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>운영체제 정보</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">OS 이름</Typography>
                                <Typography variant="body1">{image.os.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">OS 타입</Typography>
                                <Typography variant="body1">{image.os.os_type}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">버전</Typography>
                                <Typography variant="body1">{image.os.version}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">상태</Typography>
                                <Typography variant="body1"><Chip
                                    label={image.os.status}
                                    color={getStatusColor(image.os.status)}
                                    size="small"
                                /></Typography>
                            </Grid>
                            {image.os.content && image.os.content.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">상세 정보</Typography>
                                    {image.os.content.map((content, index) => (
                                        <Typography key={index} variant="body1" sx={{ mt: 0.5 }}>
                                            {content}
                                        </Typography>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}

                {image.zone && image.zone.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>가용 존</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {image.zone.map((zone) => (
                                <Chip
                                    key={zone}
                                    label={zone}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
} 