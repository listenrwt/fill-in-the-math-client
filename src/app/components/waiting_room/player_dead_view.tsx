'use client';

import React from 'react';

import { Box, Typography } from '@mui/material';

import { Player } from '@/lib/game.types';

import UserAvatar from '../UserAvatar';
import InGameLeaderboard from '../game/in_game_health_bar';
import Stroke from '../game/ui/stroke';
import LivePlayerStats from './live_player_stats';

interface PlayerDeadViewProps {
  players: Player[];
  username: string;
  avatarId: number;
}

const PlayerDeadView: React.FC<PlayerDeadViewProps> = ({ players, avatarId }) => {
  // Filter only active players (those with health > 0)
  const activePlayers = players.filter((player) => player.health > 0);

  return (
    <Box
      sx={{
        bgcolor: '#D9D9D9',
        color: '#000',
        width: '95%',
        p: 3,
        borderRadius: 2,
        minWidth: { xs: 300, sm: 500, md: 900 },
        maxWidth: { xs: 500, sm: 900 },
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <UserAvatar avatarId={avatarId} size={64} />
        <Typography variant="h4" ml={2} color="error">
          You were eliminated!
        </Typography>
      </Box>

      <Stroke sx={{ width: '95%', mb: 3 }} />

      <Typography variant="h5" mb={2}>
        Game in progress - Spectator View
      </Typography>

      {/* Display the in-game leaderboard/health bar */}
      <InGameLeaderboard />

      {/* Show detailed player stats with our new component */}
      <LivePlayerStats players={players} />

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
        <Typography variant="h6" mb={1}>
          Remaining Active Players: {activePlayers.length}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          Wait for the game to finish to join the next round
        </Typography>
      </Box>
    </Box>
  );
};

export default PlayerDeadView;
