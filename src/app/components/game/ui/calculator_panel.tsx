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
  const isNumberUsed = (num: number) => usedNumbers.includes(num);

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
