'use client';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import { useGameEventsContext } from '@/app/contexts/GameEventsContext';

import UserAvatar from '../userAvatar';

const InGameLeaderboard = () => {
  const { currentRoom } = useGameEventsContext();

  // Current players from the context - ensure non-null values
  const players =
    currentRoom?.players.map((player) => ({
      id: player.id,
      username: player.username,
      avatarId: player.avatarId ?? 1,
      hp: player.health ?? 0,
      maxHp: currentRoom.config.timeLimit ?? 30,
    })) || [];

  // Function to determine the color of the HP bar based on remaining HP percentage
  const getHpColor = (hp: number, maxHp: number): string => {
    const hpPercentage = (hp / maxHp) * 100;
    if (hpPercentage <= 25) return '#FF0000'; // Red for low HP
    if (hpPercentage <= 50) return '#FF8800'; // Orange for medium HP
    return '#009900'; // Green for high HP
  };

  return (
    <Box
      display="flex"
      alignItems="flex-end"
      justifyContent="flex-end"
      sx={{ mb: { xs: '1px', md: '10px' } }}
    >
      <Stack mb={1} sx={{ width: { xs: 320, md: 465 } }}>
        {players.map((player) => (
          <Box
            key={player.id}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              mb: 0.6,
            }}
          >
            <Typography
              align="right"
              variant="caption"
              width="100px"
              sx={{ fontSize: { xs: '14px', md: '16px' } }}
            >
              {player.username}&nbsp;
            </Typography>
            <UserAvatar
              avatarId={player.avatarId}
              alt={player.username}
              sx={{ width: { xs: 20, md: 24 }, height: { xs: 20, md: 24 } }}
            />
            <LinearProgress
              variant="determinate"
              value={(player.hp / player.maxHp) * 100}
              sx={{
                ml: { xs: 1, md: 1.5 },
                width: { xs: 200, md: 300 },
                margin: '0 auto',
                height: { xs: 12, md: 15 },
                borderRadius: 0.6,
                backgroundColor: '#909090',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHpColor(player.hp, player.maxHp),
                },
              }}
            />
            <Typography
              align="center"
              variant="caption"
              width="30px"
              sx={{ fontSize: { xs: '14px', md: '16px' } }}
            >
              {player.hp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default InGameLeaderboard;
