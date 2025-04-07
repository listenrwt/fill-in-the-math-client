import { Paper, TextField, Typography } from '@mui/material';

import { Room } from '../../../lib/game.types';

interface PlayerInfoPanelProps {
  username: string;
  setUsername: (username: string) => void;
  currentRoom: Room | null;
}

export const PlayerInfoPanel = ({ username, setUsername, currentRoom }: PlayerInfoPanelProps) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Player Info
      </Typography>
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={currentRoom !== null}
        sx={{ mb: 2 }}
      />
    </Paper>
  );
};
