import React from 'react';

import { Box, List, ListItem, Typography } from '@mui/material';

export interface Player {
  id?: string;
  name: string;
  isHost: boolean;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Players</Typography>
      <List>
        {players.map((player, index) => (
          <ListItem key={player.id || index}>
            {player.name} {player.isHost ? '(Host)' : ''}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlayerList;
