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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Instance } from '@/types/instance';
import React from 'react';

interface InstanceDetailProps {
  instanceId: string;
  onClose: () => void;
}

export function InstanceDetail({ instanceId, onClose }: InstanceDetailProps) {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstanceDetail = async () => {
      try {
        const response = await fetch(`/api/instances/${instanceId}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setInstance(data.result[0]);
          console.log(data.result[0]);
        }
      } catch (error) {
        console.error('Error fetching instance detail:', error);
        setError('Failed to load instance details');
      }
    };

    fetchInstanceDetail();
  }, [instanceId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!instance) return <Typography>Loading...</Typography>;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{instance.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Chip
            label={instance.status}
            color={instance.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>기본 정보</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th">Instance ID</TableCell>
                    <TableCell>{instance.instance_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">시작 일시</TableCell>
                    <TableCell>{formatDate(instance.start_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">기본 계정</TableCell>
                    <TableCell>
                      Username: {instance.default_account.username}<br />
                      Password: {instance.default_account.password}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>네트워크 정보</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {instance.ip.map((network, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell component="th">Public IP</TableCell>
                        <TableCell>{network.public.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Private IP</TableCell>
                        <TableCell>
                          Address: {network.private.address}<br />
                          Gateway: {network.private.gateway}<br />
                          Netmask: {network.private.netmask}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>모니터링 상태</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th">Port</TableCell>
                    <TableCell>{instance.monitoring.port}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Resource</TableCell>
                    <TableCell>{instance.monitoring.resource}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>연결 제한</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th">Block Storage</TableCell>
                    <TableCell>{instance.connection_limit.block_storage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">IP</TableCell>
                    <TableCell>{instance.connection_limit.ip}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>트래픽</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th">기본</TableCell>
                    <TableCell>{instance.traffic.default} GB</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">주기</TableCell>
                    <TableCell>{instance.traffic.period}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {instance.vnc && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>VNC 접속</Typography>
            <Button
              variant="contained"
              color="primary"
              href={instance.vnc.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              VNC 콘솔 열기
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
} 