import React, { useCallback, useEffect } from 'react';

import { Box, Grid } from '@mui/material';

import { MathSymbol } from '@/lib/question.enum';
import { Equation } from '@/lib/question.types';

import CalculatorButton from './calculator_button';

interface CalculatorPanelProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onDeleteLast: () => void;
  onSubmit: () => void;
  usedNumbers?: number[];
  equation?: Equation; // Add equation as optional prop
}

export default function CalculatorPanel({
  onNumberClick,
  onClear,
  onDeleteLast,
  onSubmit,
  usedNumbers = [],
  equation = [],
}: CalculatorPanelProps) {
  // Helper function to count the number of blanks in the equation
  const countBlanks = useCallback((): number => {
    return equation.filter((item) => item === MathSymbol.Blank).length;
  }, [equation]);

  // Get the maximum number of inputs allowed
  const maxInputs = useCallback((): number => {
    return countBlanks();
  }, [countBlanks]);

  // Wrap isNumberUsed in useCallback to avoid its reference changing on every render.
  const isNumberUsed = useCallback((num: number) => usedNumbers.includes(num), [usedNumbers]);

  // Check if we've reached the maximum number of inputs
  const isMaxInputsReached = useCallback((): boolean => {
    return usedNumbers.length >= maxInputs();
  }, [usedNumbers, maxInputs]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Handle number keys from 1 to 9
      if (/^[1-9]$/.test(key)) {
        const num = parseInt(key, 10);
        if (!isNumberUsed(num) && !isMaxInputsReached()) {
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
  }, [onNumberClick, onSubmit, onDeleteLast, isNumberUsed, isMaxInputsReached]);

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2 }}>
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 1 }}>
        {[1, 2, 3].map((num) => (
          <Grid item key={num}>
            <CalculatorButton
              value={num}
              text={num.toString()}
              onClick={() => onNumberClick(num)}
              disabled={isNumberUsed(num) || isMaxInputsReached()}
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
              disabled={isNumberUsed(num) || isMaxInputsReached()}
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
              disabled={isNumberUsed(num) || isMaxInputsReached()}
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
