// File: CompactLeaderboard.tsx
import React, { useEffect, useState } from 'react';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import io, { Socket } from 'socket.io-client';

// Define Player interface
interface Player {
  id: number;
  username: string;
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
  }, []);

  // For testing purposes, temporary data set
  useEffect(() => {
    if (players.length === 0) {
      const samplePlayers: Player[] = [
        { id: 0, username: 'You', hp: 999, maxHp: 1000 },
        { id: 1, username: 'Player1', hp: 18, maxHp: 30 },
        { id: 2, username: 'Player2', hp: 22, maxHp: 30 },
        { id: 3, username: 'Player3', hp: 8, maxHp: 30 },
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
    <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
      <Stack mb={1} sx={{ width: 220 }}>
        {players.map((player) => (
          <Box
            key={player.id}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography align="right" variant="caption" width="70px">
              {player.username}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(player.hp / player.maxHp) * 100}
              sx={{
                maxWidth: 120,
                width: '100%',
                margin: '0 auto',
                height: 6,
                borderRadius: 0.2,
                backgroundColor: '#909090',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHpColor(player.hp, player.maxHp),
                },
              }}
            />
            <Typography align="center" width="15px" variant="caption">
              {player.hp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default CompactLeaderboard;
