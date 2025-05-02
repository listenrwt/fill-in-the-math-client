// File: CompactLeaderboard.tsx
import React, { useEffect, useState } from 'react';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import io, { Socket } from 'socket.io-client';

import UserAvatar from '../UserAvatar';

// Define Player interface
interface Player {
  id: number;
  username: string;
  avatarId: number;
  hp: number; // HP represented as seconds left
  maxHp: number; // Maximum HP value
}

const CompactLeaderboard = () => {
  // State to store player data
  const [players, setPlayers] = useState<Player[]>([]);
  // Connect to the backend server
  const socket: Socket = io('http://localhost:3001');

  useEffect(() => {
    // Connect to game server
    socket.on('connect', () => {
      console.log('Connected to game server');
      // Request initial player data
      socket.emit('getPlayerStats');
    });

    // Listen for player stats updates
    socket.on('playerStats', (data: Player[]) => {
      console.log('Received player stats:', data);
      setPlayers(data);
    });

    // Listen for individual player updates
    socket.on('playerUpdate', (updatedPlayer: Player) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player))
      );
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('playerStats');
      socket.off('playerUpdate');
      socket.disconnect();
    };
  }, [socket]);

  // For testing purposes, temporary data set
  useEffect(() => {
    if (players.length === 0) {
      const samplePlayers: Player[] = [
        { id: 0, username: 'You', hp: 999, maxHp: 1000, avatarId: 2 },
        { id: 1, username: 'Player1', hp: 18, maxHp: 30, avatarId: 3 },
        { id: 2, username: 'Player2', hp: 22, maxHp: 30, avatarId: 5 },
        { id: 3, username: 'Player3', hp: 8, maxHp: 30, avatarId: 0 },
      ];
      setPlayers(samplePlayers);
    }
  }, [players]);

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
              avatarId={player.avatarId ?? 1}
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

export default CompactLeaderboard;
