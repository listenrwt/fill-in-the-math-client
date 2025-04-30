// UserAvatar.tsx
import React from 'react';

import { Avatar } from '@mui/material';
import type { SxProps, Theme } from '@mui/system';

import avatarMap from '../assets/avatarMap';

interface UserAvatarProps {
  avatarId: number;
  alt?: string;
  size?: number; // optional, ignored if `sx` is passed
  sx?: SxProps<Theme>; // allow responsive and theme-aware styles
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarId, alt = 'User Avatar', size, sx }) => {
  const avatarSrc = avatarMap[avatarId] || avatarMap[1];

  return (
    <Avatar
      src={avatarSrc}
      alt={alt}
      sx={{
        width: size ?? 40,
        height: size ?? 40,
        ...sx, // override defaults if sx is provided
      }}
    />
  );
};

export default UserAvatar;
