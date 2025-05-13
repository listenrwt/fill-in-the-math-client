'use client';

import React from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';

import avatarMap from '../../assets/avatarMap';
import UserAvatar from '../UserAvatar';

interface ChangeAvatarProps {
  selectedAvatarId: number;
  handleAvatarChange: (avatarId: number) => void;
}

const ChangeAvatar: React.FC<ChangeAvatarProps> = ({ selectedAvatarId, handleAvatarChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Avatar
      </Typography>
      <Grid container spacing={1}>
        {Object.entries(avatarMap).map(([id]) => (
          <Grid item key={id}>
            <Box
              sx={{
                p: 1,
                border:
                  selectedAvatarId === Number(id) ? '3px solid #4285F4' : '3px solid transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => handleAvatarChange(Number(id))}
            >
              <UserAvatar avatarId={Number(id)} size={50} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ChangeAvatar;
