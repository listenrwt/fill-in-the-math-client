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

import socketService from '../../../services/socket.service';
import { QuestionDifficulty, Room, RoomConfig, RoomStatus } from '../../../types/game.types';

interface RoomPanelProps {
  username: string;
  setUsername: (name: string) => void;
  roomName: string;
  setRoomName: (name: string) => void;
  roomConfig: RoomConfig;
  handleRoomConfigChange: (
    e: ChangeEvent<HTMLInputElement | { name: string; value: unknown }>
  ) => void;
  roomIdToJoin: string;
  setRoomIdToJoin: (id: string) => void;
  currentRoom: Room | null;
  createRoom: () => void;
  joinRoom: () => void;
  leaveRoom: () => void;
  updateRoomSettings: () => void;
  startGame?: () => void;
  restartGame?: () => void;
}

export const RoomPanel = ({
  username,
  roomName,
  setRoomName,
  roomConfig,
  handleRoomConfigChange,
  roomIdToJoin,
  setRoomIdToJoin,
  currentRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  updateRoomSettings,
  startGame,
  restartGame,
}: RoomPanelProps) => {
  // If we're in a room, show the room management UI
  if (currentRoom) {
    const isHost = currentRoom.hostId === socketService.getSocket()?.id;
    const isWaiting = currentRoom.status === RoomStatus.WAITING;
    const isFinished = currentRoom.status === RoomStatus.FINISHED;

    // Function to update settings and start game
    const handleStartGame = () => {
      if (startGame) {
        // First update room settings, then start the game
        updateRoomSettings();
        startGame();
      }
    };

    // Function to update settings and restart game
    const handleRestartGame = () => {
      if (restartGame) {
        // First update room settings, then restart the game
        updateRoomSettings();
        restartGame();
      }
    };

    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Room: {currentRoom.name} (ID: {currentRoom.id})
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Status: {currentRoom.status}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Players ({currentRoom.players.length}/{currentRoom.config.maxPlayers}):
            </Typography>
            <Box component="ul">
              {currentRoom.players.map((player) => (
                <Box component="li" key={player.id}>
                  {player.username} {player.isHost ? '(Host)' : ''}
                  {player.id === socketService.getSocket()?.id ? ' (You)' : ''}
                </Box>
              ))}
            </Box>
          </Grid>

          {isHost && (isWaiting || isFinished) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">Room Settings</Typography>
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
            </>
          )}

          <Grid item xs={12} container spacing={2}>
            {isHost && isWaiting && startGame && (
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleStartGame}
                  disabled={currentRoom.players.length < 2}
                >
                  Start Game
                </Button>
              </Grid>
            )}
            {isHost && isFinished && restartGame && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRestartGame}
                  disabled={currentRoom.players.length < 2}
                >
                  Restart Game
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button variant="contained" color="error" onClick={leaveRoom}>
                Leave Room
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  // If we're not in a room, show the create/join room UI
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Room Management
      </Typography>

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
