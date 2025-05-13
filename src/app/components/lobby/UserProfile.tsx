// UserProfile.tsx
import React from 'react';

import { Box, LinearProgress, Typography } from '@mui/material';

import UserAvatar from '../userAvatar';

export interface UserProfileProps {
  username: string;
  avatarId: number;
  experience: number;
}

// Calculate level from Exp.
const getLevelInfo = (exp: number) => {
  let level = 1;
  let nextThreshold = 4;
  while (exp >= nextThreshold) {
    level++;
    nextThreshold *= 2;
  }
  const previousThreshold = level === 1 ? 0 : nextThreshold / 2;
  return { level, previousThreshold, nextThreshold };
};

const UserProfile: React.FC<UserProfileProps> = ({ username, avatarId, experience }) => {
  // Calculate current level and XP thresholds.
  const { level, previousThreshold, nextThreshold } = getLevelInfo(experience);

  // Compute the progress percentage within the current level.
  const progress = ((experience - previousThreshold) / (nextThreshold - previousThreshold)) * 100;

  return (
    <Box
      width={{ xs: 150, md: 350 }}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // row for md, column for xs
        alignItems: 'center',
        p: { xs: 1, md: 2 },
        border: '1px solid #e0e0e0',
        borderRadius: 2,
      }}
    >
      {/* Avatar Section */}
      <UserAvatar
        avatarId={avatarId}
        alt={`${username}'s avatar`}
        sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 } }}
      />

      {/* User Details for md view (aligned to the right of the avatar) */}
      <Box
        width={{ xs: 120, md: 180 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          ml: { xs: 0, md: 2 }, // add margin left on md for spacing between avatar & text
        }}
      >
        {/* Username Section */}
        <Typography
          variant="h5"
          component="div"
          sx={{ mt: 1, fontSize: { xs: '24px', md: '30px' } }}
        >
          {username}
        </Typography>

        {/* Experience / Level Section */}
        <Typography
          sx={{
            display: 'block',
            fontSize: { xs: '12px', md: '16px' },
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          Level {level}
        </Typography>
        <Box sx={{ width: { xs: 120, md: 180 }, mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: { xs: 12, md: 20 },
              borderRadius: { xs: '4px', md: '8px' },
              backgroundColor: '#FFFFFF',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#00AA00',
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontSize: { xs: '12px', md: '14px' },
              textAlign: 'center',
              mt: 0.5,
            }}
          >
            {experience}&nbsp;XP /&nbsp;{nextThreshold}&nbsp;XP
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
