import { Grid, Grid2 } from '@mui/material';

import CalculatorButton from './calculator_button';

interface CalculatorPanelProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  onDeleteLast: () => void;
  onSubmit: () => void;
}

export default function CalculatorPanel({
  onNumberClick,
  onDelete,
  onDeleteLast,
  onSubmit,
}: CalculatorPanelProps) {
  return (
    <Grid2 container justifyContent="center" alignItems="center" spacing={1}>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item>
          <CalculatorButton value={1} text="1" onClick={() => onNumberClick(1)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={2} text="2" onClick={() => onNumberClick(2)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={3} text="3" onClick={() => onNumberClick(3)} />
        </Grid>
      </Grid>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item>
          <CalculatorButton value={4} text="4" onClick={() => onNumberClick(4)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={5} text="5" onClick={() => onNumberClick(5)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={6} text="6" onClick={() => onNumberClick(6)} />
        </Grid>
      </Grid>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item>
          <CalculatorButton value={7} text="7" onClick={() => onNumberClick(7)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={8} text="8" onClick={() => onNumberClick(8)} />
        </Grid>
        <Grid item>
          <CalculatorButton value={9} text="9" onClick={() => onNumberClick(9)} />
        </Grid>
      </Grid>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item>
          <CalculatorButton value={0} text="0" onClick={() => onNumberClick(0)} />
        </Grid>
      </Grid>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item>
          <CalculatorButton value={'DEL'} text="DEL" variant="delete" onClick={onDelete} />
        </Grid>
        <Grid item>
          <CalculatorButton value={'BCK'} text="BCK" variant="back" onClick={onDeleteLast} />
        </Grid>
        <Grid item>
          <CalculatorButton value={'CON'} text="CON" variant="confirm" onClick={onSubmit} />
        </Grid>
      </Grid>
    </Grid2>
  );
}
