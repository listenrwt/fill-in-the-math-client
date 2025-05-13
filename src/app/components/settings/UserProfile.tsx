'use client';

import React from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { UserData } from '../../lib/system.types';
import UserAvatar from '../userAvatar';

interface UserProfileProps {
  userData: UserData | null;
  selectedAvatarId: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, selectedAvatarId }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Profile
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <UserAvatar avatarId={selectedAvatarId} size={80} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">{userData?.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {userData?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Experience: {userData?.experience || 0}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserProfile;
