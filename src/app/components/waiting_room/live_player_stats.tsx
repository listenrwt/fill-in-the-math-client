'use client';

import React from 'react';

import { Box, CircularProgress, Grid, Typography } from '@mui/material';

import { Player } from '@/lib/game.types';

import UserAvatar from '../UserAvatar';

interface LivePlayerStatsProps {
  players: Player[];
}

const LivePlayerStats: React.FC<LivePlayerStatsProps> = ({ players }) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h6" mb={2}>
        Live Player Stats
      </Typography>

      <Grid container spacing={2}>
        {sortedPlayers.map((player) => {
          // Calculate health percentage
          const healthPercentage = player.health <= 0 ? 0 : player.health;
          const healthColor =
            healthPercentage > 70 ? '#4caf50' : healthPercentage > 40 ? '#ff9800' : '#f44336';

          return (
            <Grid item xs={12} sm={6} md={4} key={player.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: player.health <= 0 ? '#f5f5f5' : '#ffffff',
                  borderRadius: 2,
                  p: 1,
                  border: '1px solid #e0e0e0',
                  opacity: player.health <= 0 ? 0.7 : 1,
                }}
              >
                <Box sx={{ mr: 2, position: 'relative' }}>
                  <UserAvatar avatarId={player.avatarId} size={48} />
                  <Box sx={{ position: 'absolute', bottom: -5, right: -5 }}>
                    <CircularProgress
                      variant="determinate"
                      value={healthPercentage}
                      size={20}
                      sx={{
                        color: healthColor,
                        backgroundColor: '#e0e0e0',
                        borderRadius: '50%',
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      color: player.health <= 0 ? '#9e9e9e' : 'inherit',
                    }}
                  >
                    {player.username} {player.isHost ? '(Host)' : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Score: {player.score}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: player.health <= 0 ? '#9e9e9e' : healthColor,
                        fontWeight: 'bold',
                      }}
                    >
                      HP: {player.health}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LivePlayerStats;
