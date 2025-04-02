import { ChangeEvent } from 'react';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';

import { QuestionDifficulty, RoomConfig } from '../../../types/game.types';

interface RoomManagementPanelProps {
  roomName: string;
  setRoomName: (name: string) => void;
  roomConfig: RoomConfig;
  handleRoomConfigChange: (
    e: ChangeEvent<HTMLInputElement | { name: string; value: unknown }>
  ) => void;
  roomIdToJoin: string;
  setRoomIdToJoin: (id: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
  username: string;
  setUsername: (name: string) => void;
}

export const RoomManagementPanel = ({
  roomName,
  setRoomName,
  roomConfig,
  handleRoomConfigChange,
  roomIdToJoin,
  setRoomIdToJoin,
  createRoom,
  joinRoom,
  username,
  setUsername,
}: RoomManagementPanelProps) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Room Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Room
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Time Limit (seconds)"
              name="timeLimit"
              value={roomConfig.timeLimit}
              onChange={handleRoomConfigChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={roomConfig.questionDifficulty}
                label="Difficulty"
                name="questionDifficulty"
                onChange={handleRoomConfigChange as (e: SelectChangeEvent) => void}
              >
                <MenuItem value={QuestionDifficulty.EASY}>Easy</MenuItem>
                <MenuItem value={QuestionDifficulty.MEDIUM}>Medium</MenuItem>
                <MenuItem value={QuestionDifficulty.HARD}>Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Max Players"
              name="maxPlayers"
              value={roomConfig.maxPlayers}
              onChange={handleRoomConfigChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Attack Damage"
              name="attackDamage"
              value={roomConfig.attackDamage}
              onChange={handleRoomConfigChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Heal Amount"
              name="healAmount"
              value={roomConfig.healAmount}
              onChange={handleRoomConfigChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Wrong Answer Penalty"
              name="wrongAnswerPenalty"
              value={roomConfig.wrongAnswerPenalty}
              onChange={handleRoomConfigChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={createRoom}
              disabled={!username}
              fullWidth
            >
              Create Room
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Join Room
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room ID"
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={joinRoom}
              disabled={!roomIdToJoin || !username}
              fullWidth
            >
              Join Room
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
