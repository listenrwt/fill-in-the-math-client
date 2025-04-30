import React from 'react';

import { Box, List, ListItem, Typography } from '@mui/material';

import UserAvatar from '../UserAvatar';

export interface Player {
  id?: number;
  username: string;
  isHost: boolean;
  avatarID?: number;
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
              <Box ml={1} display="flex" alignItems="center">
                <UserAvatar
                  avatarId={player.avatarID ?? 1} // fallback to 1 if undefined
                  alt={player.username}
                  size={40}
                />
                <Box ml={2}>
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
