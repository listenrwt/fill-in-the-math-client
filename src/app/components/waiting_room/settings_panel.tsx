import React from 'react';

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
  // New props for the public room toggle
  isRoomPublic: boolean;
  onRoomPublicChange: (value: boolean) => void;
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
  isRoomPublic,
  onRoomPublicChange,
}) => {
  // Style objects for consistent appearance.
  const textFieldSX = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'black' },
      '&:hover fieldset': { borderColor: 'black' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
    '& input': { color: 'black' },
    '& label': { color: 'black' },
    '& label.Mui-focused': { color: 'black' },
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
    <Box sx={{ borderRadius: 2 }}>
      <Box p={2} bgcolor="#ffffff" sx={{ borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
        <Typography variant="h6">Settings</Typography>
      </Box>
      <Grid container p={2} spacing={3}>
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
        {/* Toggle button for setting the room to public */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="flext-start">
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Allow public joins:
            </Typography>
            <Switch
              checked={isRoomPublic}
              onChange={(e) => onRoomPublicChange(e.target.checked)}
              disabled={disabled}
              sx={{
                width: 62,
                height: 34,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                '& .MuiSwitch-switchBase': {
                  padding: 1,
                  top: '50%',
                  transform: 'translate(-4px, -50%)',
                  '&.Mui-checked': {
                    transform: 'translate(20px, -50%)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                      backgroundColor: 'green',
                      opacity: 1,
                    },
                  },
                },
                '& .MuiSwitch-thumb': {
                  width: 32,
                  height: 32,
                  boxShadow: 'none',
                },
                '& .MuiSwitch-track': {
                  borderRadius: 20,
                  backgroundColor: '#ccc',
                  opacity: 1,
                  height: '100%',
                  border: '1px solid black',
                  boxSizing: 'border-box',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPanel;
