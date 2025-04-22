import React from 'react';

import { Avatar, Box, List, ListItem, Typography } from '@mui/material';

export interface Player {
  id?: number;
  username: string;
  isHost: boolean;
  avatarUrl?: string;
}

interface PlayerListProps {
  players: Player[];
  maxPlayers: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, maxPlayers }) => {
  return (
    <Box alignItems="center" justifyContent="center" sx={{ width: 250, textAlign: 'center' }}>
      <Box
        bgcolor={'#ffffff'}
        p={1.5}
        sx={{
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography variant="h6">
          Players ({players.length}/{maxPlayers})
        </Typography>
      </Box>
      <Box sx={{ maxHeight: { xs: 180, sm: 'none' }, overflowY: { xs: 'auto', sm: 'visible' } }}>
        <List>
          {players.map((player, index) => (
            <ListItem key={player.id || index}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={player.avatarUrl}
                  alt={player.username}
                  sx={{
                    width: 40,
                    height: 40,
                    marginRight: 2, // spacing between avatar and name
                  }}
                />
                <Box>
                  {player.username} {player.isHost ? '(Host)' : ''}
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PlayerList;
