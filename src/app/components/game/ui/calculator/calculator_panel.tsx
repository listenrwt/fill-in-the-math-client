import React, { useCallback, useEffect } from 'react';

import { Box, Grid } from '@mui/material';

import CalculatorButton from './calculator_button';

interface CalculatorPanelProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onDeleteLast: () => void;
  onSubmit: () => void;
  usedNumbers?: number[];
}

export default function CalculatorPanel({
  onNumberClick,
  onClear,
  onDeleteLast,
  onSubmit,
  usedNumbers = [],
}: CalculatorPanelProps) {
  // Wrap isNumberUsed in useCallback to avoid its reference changing on every render.
  const isNumberUsed = useCallback((num: number) => usedNumbers.includes(num), [usedNumbers]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Handle number keys from 1 to 9
      if (/^[1-9]$/.test(key)) {
        const num = parseInt(key, 10);
        if (!isNumberUsed(num)) {
          onNumberClick(num);
        }
      }
      // Handle "Enter" key for confirm
      else if (key === 'Enter') {
        onSubmit();
      }
      // Handle "Backspace" key for delete last
      else if (key === 'Backspace') {
        onDeleteLast();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNumberClick, onSubmit, onDeleteLast, isNumberUsed]);

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2 }}>
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 1 }}>
        {[1, 2, 3].map((num) => (
          <Grid item key={num}>
            <CalculatorButton
              value={num}
              text={num.toString()}
              onClick={() => onNumberClick(num)}
              disabled={isNumberUsed(num)}
              selected={isNumberUsed(num)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 1 }}>
        {[4, 5, 6].map((num) => (
          <Grid item key={num}>
            <CalculatorButton
              value={num}
              text={num.toString()}
              onClick={() => onNumberClick(num)}
              disabled={isNumberUsed(num)}
              selected={isNumberUsed(num)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 1 }}>
        {[7, 8, 9].map((num) => (
          <Grid item key={num}>
            <CalculatorButton
              value={num}
              text={num.toString()}
              onClick={() => onNumberClick(num)}
              disabled={isNumberUsed(num)}
              selected={isNumberUsed(num)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <CalculatorButton value={'CLR'} text="CLR" variant="clear" onClick={onClear} />
        </Grid>
        <Grid item>
          <CalculatorButton value={'DEL'} text="DEL" variant="delete" onClick={onDeleteLast} />
        </Grid>
        <Grid item>
          <CalculatorButton value={'CON'} text="✔" variant="confirm" onClick={onSubmit} />
        </Grid>
      </Grid>
    </Box>
  );
}
