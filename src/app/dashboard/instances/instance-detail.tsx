'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { Instance } from '@/types/instance';
import React from 'react';

interface InstanceDetailProps {
  instanceId: string;
  onClose: () => void;
}

export function InstanceDetail({ instanceId, onClose }: InstanceDetailProps) {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: string;
    data?: any;
  }>({ open: false, type: '' });
  const [error, setError] = useState<string | null>(null);

  const fetchInstanceDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/instances/${instanceId}`);
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        setInstance(data.result[0]);
      }
    } catch (error) {
      setError('Failed to fetch instance details');
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchInstanceDetail();
    const interval = setInterval(fetchInstanceDetail, 5000); // 5초마다 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [fetchInstanceDetail]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleActionDialogOpen = (type: string) => {
    setActionDialog({ open: true, type });
    handleActionClose();
  };

  const handleActionDialogClose = () => {
    setActionDialog({ open: false, type: '' });
  };

  const handleAction = async (action: string, data?: any) => {
    try {
      let response;
      
      if (action === 'delete') {
        response = await fetch(`/api/instances/${instanceId}/action`, {
          method: 'DELETE'
        });
        if (response.ok) {
          handleActionDialogClose();
          onClose();
          // 목록 새로고침을 위해 이벤트 발생
          window.dispatchEvent(new CustomEvent('refreshInstanceList'));
          return;
        }
      } else if (action === 'edit') {
        response = await fetch(`/api/instances/${instanceId}/action`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(`/api/instances/${instanceId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, ...data }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      // 성공 후 인스턴스 정보 새로고침
      await fetchInstanceDetail();
      handleActionDialogClose();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  if (loading || !instance) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">인스턴스 상세 정보</Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleActionClick}
              sx={{ mr: 1 }}
            >
              작업
            </Button>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => handleAction('start')}>
          <ListItemIcon>
            <PlayArrowIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>시작</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('shutdown')}>
          <ListItemIcon>
            <StopIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>종료</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionDialogOpen('reboot')}>
          <ListItemIcon>
            <RestartAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>재시작</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionDialogOpen('rebuild')}>
          <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>재구축</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionDialogOpen('resize')}>
          <ListItemIcon>
            <AspectRatioIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>크기 조정</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionDialogOpen('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>삭제</ListItemText>
        </MenuItem>
      </Menu>

      {/* Action Dialogs */}
      <Dialog open={actionDialog.open} onClose={handleActionDialogClose}>
        <DialogTitle>
          {actionDialog.type === 'reboot' && '재시작'}
          {actionDialog.type === 'rebuild' && '재구축'}
          {actionDialog.type === 'resize' && '크기 조정'}
          {actionDialog.type === 'delete' && '삭제'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.type === 'reboot' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>재시작 유형</InputLabel>
              <Select
                value={actionDialog.data?.type || 'SOFT'}
                onChange={(e) => setActionDialog(prev => ({ ...prev, data: { type: e.target.value } }))}
              >
                <MenuItem value="SOFT">Soft Reboot</MenuItem>
                <MenuItem value="HARD">Hard Reboot</MenuItem>
              </Select>
            </FormControl>
          )}
          {actionDialog.type === 'rebuild' && (
            <TextField
              fullWidth
              margin="normal"
              label="Image ID"
              onChange={(e) => setActionDialog(prev => ({ ...prev, data: { imageId: e.target.value } }))}
            />
          )}
          {actionDialog.type === 'resize' && (
            <TextField
              fullWidth
              margin="normal"
              label="Flavor ID"
              onChange={(e) => setActionDialog(prev => ({ ...prev, data: { flavorId: e.target.value } }))}
            />
          )}
          {actionDialog.type === 'delete' && (
            <Typography>정말로 이 인스턴스를 삭제하시겠습니까?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionDialogClose}>취소</Button>
          <Button
            onClick={() => handleAction(actionDialog.type, actionDialog.data)}
            color={actionDialog.type === 'delete' ? 'error' : 'primary'}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <DialogContent>
        <Box mb={3}>
            라이브 서버 상태 : 
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