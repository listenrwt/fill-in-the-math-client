import { ChangeEvent, useEffect, useRef } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { Room, RoomConfig, RoomStatus } from '@/lib/game.types';
import { Difficulty } from '@/lib/question.enum';
import socketService from '@/services/socket.service';

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
  quickJoin: () => void;
  leaveRoom: () => void;
  updateRoomSettings: () => void;
  startGame?: () => void;
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
  quickJoin,
  leaveRoom,
  updateRoomSettings,
  startGame,
}: RoomPanelProps) => {
  // Use a ref to track if the change was initiated by the user
  const userInitiatedChange = useRef(false);

  // Function to handle public toggle change
  const handlePublicToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Flag that this change was initiated by user action
    userInitiatedChange.current = true;

    // Create a synthetic event that matches the format expected by handleRoomConfigChange
    const syntheticEvent = {
      target: {
        name: 'isPublic',
        value: e.target.checked,
      },
    };
    // Use the object directly as it matches the second type in the union
    handleRoomConfigChange(syntheticEvent as ChangeEvent<{ name: string; value: boolean }>);
  };

  // Effect to ensure roomConfig stays in sync with currentRoom config
  // but only when not modified by the user
  useEffect(() => {
    if (currentRoom && !userInitiatedChange.current) {
      // Only sync from server when the values differ and it's not a user-initiated change
      if (roomConfig.isPublic !== currentRoom.config.isPublic) {
        const syntheticEvent = {
          target: {
            name: 'isPublic',
            value: currentRoom.config.isPublic,
          },
        };
        handleRoomConfigChange(syntheticEvent as ChangeEvent<{ name: string; value: boolean }>);
      }
    }

    // Reset the flag after each render
    userInitiatedChange.current = false;
  }, [currentRoom, roomConfig.isPublic, handleRoomConfigChange]);

  // If we're in a room, show the room management UI
  if (currentRoom) {
    const isHost = currentRoom.hostId === socketService.getSocket()?.id;
    const isWaiting = currentRoom.status === RoomStatus.WAITING;

    // Function to update settings and start game
    const handleStartGame = () => {
      if (startGame) {
        // First update room settings, then start the game
        updateRoomSettings();
        startGame();
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

          {isHost && isWaiting && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">Room Settings</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={roomConfig.isPublic}
                      onChange={handlePublicToggleChange}
                      name="isPublic"
                    />
                  }
                  label="Public Room"
                />
                <Typography variant="caption" display="block" gutterBottom>
                  When enabled, players can join without a room code via Quick Join
                </Typography>
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
                    value={roomConfig.Difficulty}
                    label="Difficulty"
                    name="Difficulty"
                    onChange={handleRoomConfigChange as (e: SelectChangeEvent) => void}
                  >
                    <MenuItem value={Difficulty.EASY}>Easy</MenuItem>
                    <MenuItem value={Difficulty.MEDIUM}>Medium</MenuItem>
                    <MenuItem value={Difficulty.HARD}>Hard</MenuItem>
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
            <FormControlLabel
              control={
                <Switch
                  checked={roomConfig.isPublic}
                  onChange={handlePublicToggleChange}
                  name="isPublic"
                />
              }
              label="Public Room"
            />
            <Typography variant="caption" display="block" gutterBottom>
              When enabled, players can join without a room code via Quick Join
            </Typography>
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
          <Grid item xs={12}>
            <Typography variant="subtitle2" align="center" sx={{ mt: 1, mb: 1 }}>
              OR
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="info"
              onClick={quickJoin}
              disabled={!username}
              fullWidth
            >
              Quick Join
            </Button>
            <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1 }}>
              Join an available public room without a room code
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
