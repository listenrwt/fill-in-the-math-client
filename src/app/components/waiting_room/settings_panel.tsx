import React from 'react';

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

interface SettingsPanelProps {
  timeLimit: number;
  difficulty: string;
  maxPlayers: number;
  attackDamage: number;
  healAmount: number;
  wrongAnswerPenalty: number;
  disabled: boolean;
  onTimeLimitChange: (value: number) => void;
  onDifficultyChange: (value: string) => void;
  onMaxPlayersChange: (value: number) => void;
  onAttackDamageChange: (value: number) => void;
  onHealAmountChange: (value: number) => void;
  onWrongAnswerPenaltyChange: (value: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  timeLimit,
  difficulty,
  maxPlayers,
  attackDamage,
  healAmount,
  wrongAnswerPenalty,
  disabled,
  onTimeLimitChange,
  onDifficultyChange,
  onMaxPlayersChange,
  onAttackDamageChange,
  onHealAmountChange,
  onWrongAnswerPenaltyChange,
}) => {
  // The style objects copied from the original page for a consistent appearance.
  const textFieldSX = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'black' },
      '&:hover fieldset': { borderColor: 'black' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
    '& input': { color: 'black' },
    '& label': { color: 'black' },
  };

  const FormControlSX = {
    '& .MuiSelect-icon': { color: 'black' },
    '& .MuiSelect-select': { color: 'black' },
    '& .MuiFormLabel-root': { color: 'black' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'black' },
      '&:hover fieldset': { borderColor: 'black' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
  };

  return (
    <Box sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6">Settings</Typography>
      <Grid container mt={2} spacing={2}>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Time Limit"
            type="number"
            value={timeLimit}
            onChange={(e) => onTimeLimitChange(parseInt(e.target.value))}
            disabled={disabled}
            fullWidth
            sx={textFieldSX}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth disabled={disabled} sx={FormControlSX}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty"
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Max Players"
            type="number"
            value={maxPlayers}
            onChange={(e) => onMaxPlayersChange(parseInt(e.target.value))}
            disabled={disabled}
            fullWidth
            sx={textFieldSX}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Attack Damage"
            type="number"
            value={attackDamage}
            onChange={(e) => onAttackDamageChange(parseInt(e.target.value))}
            disabled={disabled}
            fullWidth
            sx={textFieldSX}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Heal Amount"
            type="number"
            value={healAmount}
            onChange={(e) => onHealAmountChange(parseInt(e.target.value))}
            disabled={disabled}
            fullWidth
            sx={textFieldSX}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label="Wrong Answer Penalty"
            type="number"
            value={wrongAnswerPenalty}
            onChange={(e) => onWrongAnswerPenaltyChange(parseInt(e.target.value))}
            disabled={disabled}
            fullWidth
            sx={textFieldSX}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPanel;
