import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import socketService from '../../../services/socket.service';
import { QuestionDifficulty, Room, RoomStatus } from '../../../types/game.types';

interface RoomPanelProps {
  currentRoom: Room;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
  difficulty: QuestionDifficulty;
  setDifficulty: (difficulty: QuestionDifficulty) => void;
  maxPlayers: number;
  setMaxPlayers: (count: number) => void;
  attackDamage: number;
  setAttackDamage: (damage: number) => void;
  healAmount: number;
  setHealAmount: (amount: number) => void;
  wrongAnswerPenalty: number;
  setWrongAnswerPenalty: (penalty: number) => void;
  leaveRoom: () => void;
  startGame: () => void;
}

export const RoomPanel = ({
  currentRoom,
  timeLimit,
  setTimeLimit,
  difficulty,
  setDifficulty,
  maxPlayers,
  setMaxPlayers,
  attackDamage,
  setAttackDamage,
  healAmount,
  setHealAmount,
  wrongAnswerPenalty,
  setWrongAnswerPenalty,
  leaveRoom,
  startGame,
}: RoomPanelProps) => {
  const isHost = currentRoom.hostId === socketService.getSocket()?.id;
  const isWaiting = currentRoom.status === RoomStatus.WAITING;

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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Time Limit (seconds)"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
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
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Attack Damage"
                value={attackDamage}
                onChange={(e) => setAttackDamage(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Heal Amount"
                value={healAmount}
                onChange={(e) => setHealAmount(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Wrong Answer Penalty"
                value={wrongAnswerPenalty}
                onChange={(e) => setWrongAnswerPenalty(Number(e.target.value))}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} container spacing={2}>
          {isHost && isWaiting && (
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={startGame}
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
};
