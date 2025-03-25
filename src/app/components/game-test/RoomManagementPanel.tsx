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

import { QuestionDifficulty } from '../../../types/game.types';

interface RoomManagementPanelProps {
  roomName: string;
  setRoomName: (name: string) => void;
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
  roomIdToJoin: string;
  setRoomIdToJoin: (id: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
}

export const RoomManagementPanel = ({
  roomName,
  setRoomName,
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
  roomIdToJoin,
  setRoomIdToJoin,
  createRoom,
  joinRoom,
}: RoomManagementPanelProps) => {
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
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Attack Damage"
              value={attackDamage}
              onChange={(e) => setAttackDamage(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={createRoom} fullWidth>
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
            <Button variant="contained" color="secondary" onClick={joinRoom} fullWidth>
              Join Room
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
