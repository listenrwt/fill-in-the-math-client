import React from 'react';

import Image from 'next/image';

import { Box, Button, Typography } from '@mui/material';

import UserAvatar from '@/app/components/UserAvatar';

export interface Player {
  id: number;
  username: string;
  avatarId?: number;
}

interface GameActionProfileProps {
  player: Player;
  action: 'heal' | 'attack';
  onClick: () => void;
}

const GameActionProfile: React.FC<GameActionProfileProps> = ({ player, action, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        width: { xs: 100, sm: 120, md: 150 },
        height: { xs: 160, sm: 200, md: 240 },
        borderRadius: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 1,
        textTransform: 'none',
        // Use a conditional background color. You can adjust these colors as needed.
        backgroundColor: '#919191',
        color: '#FFFFFF',
      }}
    >
      {/* Container for the avatar and overlay image */}
      <Box position="relative" display="inline-block">
        <UserAvatar
          avatarId={player.avatarId ?? 1} // fallback to 1 if undefined
          alt={player.username}
          sx={{ width: { xs: 70, sm: 80, md: 100 }, height: { xs: 70, sm: 80, md: 100 } }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -10, sm: -15, md: -20 },
            left: { xs: -10, sm: -15, md: -20 },
            width: { xs: 36, sm: 45, md: 60 }, // width changes with breakpoints
            height: { xs: 36, sm: 45, md: 60 }, // maintain aspect ratio
            overflow: 'hidden', // Ensures the image is clipped within the box
          }}
          margin={1}
        >
          {action === 'heal' ? (
            <>
              <Image src="/game_action/heal.png" alt="heal" fill style={{ objectFit: 'contain' }} />
            </>
          ) : (
            <>
              <Image
                src="/game_action/attack.png"
                alt="attack"
                fill
                style={{ objectFit: 'contain' }}
              />
            </>
          )}
        </Box>
      </Box>
      {/* Subtitles */}
      <Box textAlign="center" mt={1}>
        {action === 'heal' ? (
          <>
            <Typography variant="subtitle1">Heal</Typography>
            <Typography variant="subtitle1">self</Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle1">Attack</Typography>
            <Typography variant="subtitle1">{player.username}</Typography>
          </>
        )}
      </Box>
    </Button>
  );
};

export default GameActionProfile;
