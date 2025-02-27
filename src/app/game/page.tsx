'use client';

import React, { useEffect, useState } from 'react';

import HelpIcon from '@mui/icons-material/Help';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Define types for our equation
type Operator = '+' | '-' | '*' | '/';
type Blank = {
  position: number;
  value: number | null;
  userInput: number | null;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  minWidth: '60px',
  height: '60px',
  fontSize: '1.25rem',
  '@media (max-width: 600px)': {
    minWidth: '48px',
    height: '48px',
    fontSize: '1rem',
  },
}));

const StyledTextField = styled(TextField)(() => ({
  width: '40px',
  '& input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '8px 0',
  },
  '@media (max-width: 600px)': {
    width: '30px',
    '& input': {
      fontSize: '1.25rem',
      padding: '4px 0',
    },
  },
}));

export default function CalculatorGame() {
  const [equation, setEquation] = useState<string>('');
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Generate a random equation with blanks
  const generateEquation = () => {
    // Reset state
    setIsCorrect(null);

    // Generate random operators
    const operators: Operator[] = ['+', '-', '*', '/'];
    const numOperations = Math.floor(Math.random() * 2) + 2; // 2-3 operations
    const selectedOperators: Operator[] = [];

    for (let i = 0; i < numOperations; i++) {
      const randomIndex = Math.floor(Math.random() * operators.length);
      selectedOperators.push(operators[randomIndex]);
    }

    // Generate numbers to use in the equation
    const numbers: number[] = [];
    for (let i = 0; i < numOperations + 1; i++) {
      // Ensure division operations result in whole numbers
      if (i > 0 && selectedOperators[i - 1] === '/') {
        // Find divisors of the previous number
        const divisors = [];
        for (let j = 1; j <= 9; j++) {
          if (numbers[i - 1] % j === 0) {
            divisors.push(j);
          }
        }
        if (divisors.length > 0) {
          const randomDivisor = divisors[Math.floor(Math.random() * divisors.length)];
          numbers.push(randomDivisor);
        } else {
          // If no proper divisors, change the operation
          selectedOperators[i - 1] = '+';
          numbers.push(Math.floor(Math.random() * 9) + 1);
        }
      } else {
        numbers.push(Math.floor(Math.random() * 9) + 1);
      }
    }

    // Calculate the result
    let result = numbers[0];
    for (let i = 0; i < selectedOperators.length; i++) {
      const op = selectedOperators[i];
      const num = numbers[i + 1];

      switch (op) {
        case '+':
          result += num;
          break;
        case '-':
          result -= num;
          break;
        case '*':
          result *= num;
          break;
        case '/':
          result /= num;
          break;
      }
    }

    // Create the equation string
    let equationStr = numbers[0].toString();
    for (let i = 0; i < selectedOperators.length; i++) {
      equationStr += ` ${selectedOperators[i]} ${numbers[i + 1]}`;
    }
    equationStr += ` = ${result}`;

    // Decide how many blanks to create (1-3)
    const numBlanks = Math.floor(Math.random() * 3) + 1;

    // Create blanks array with positions and values
    const newBlanks: Blank[] = [];
    const allPositions = [];

    // Collect all possible positions for blanks (each single digit in the equation)
    let pos = 0;
    for (const char of equationStr) {
      if (/\d/.test(char)) {
        allPositions.push(pos);
      }
      pos++;
    }

    // Randomly select positions for blanks
    const selectedPositions = [];
    for (let i = 0; i < numBlanks; i++) {
      if (allPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allPositions.length);
        const position = allPositions[randomIndex];
        selectedPositions.push(position);
        allPositions.splice(randomIndex, 1);
      }
    }

    // Create blanks with positions and values
    for (const position of selectedPositions) {
      const value = parseInt(equationStr[position]);
      newBlanks.push({ position, value, userInput: null });
    }

    setBlanks(newBlanks);
    setEquation(equationStr);

    // Reset available numbers
    setAvailableNumbers([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  useEffect(() => {
    generateEquation();
  }, []);

  // Get the displayed equation with blanks
  const getDisplayedEquation = () => {
    if (!equation) return [];

    const parts = [];
    let lastPos = 0;

    // Sort blanks by position
    const sortedBlanks = [...blanks].sort((a, b) => a.position - b.position);

    for (const blank of sortedBlanks) {
      // Add text before the blank
      if (blank.position > lastPos) {
        parts.push(
          <Typography
            key={`text-${lastPos}`}
            component="span"
            variant="h4"
            sx={{ fontFamily: 'monospace' }}
          >
            {equation.substring(lastPos, blank.position)}
          </Typography>
        );
      }

      // Add the blank input field
      parts.push(
        <StyledTextField
          key={`blank-${blank.position}`}
          variant="outlined"
          inputProps={{ maxLength: 1, readOnly: true }}
          value={blank.userInput !== null ? blank.userInput : ''}
        />
      );

      lastPos = blank.position + 1;
    }

    // Add any remaining text
    if (lastPos < equation.length) {
      parts.push(
        <Typography
          key={`text-${lastPos}`}
          component="span"
          variant="h4"
          sx={{ fontFamily: 'monospace' }}
        >
          {equation.substring(lastPos)}
        </Typography>
      );
    }

    return parts;
  };

  // Handle number button click
  const handleNumberClick = (num: number) => {
    const blankToFill = blanks.find((blank) => blank.userInput === null);

    if (blankToFill) {
      // Update the blank
      const updatedBlanks = blanks.map((blank) =>
        blank.position === blankToFill.position ? { ...blank, userInput: num } : blank
      );

      setBlanks(updatedBlanks);

      // Remove number from available numbers
      setAvailableNumbers(availableNumbers.filter((n) => n !== num));

      // Check if all blanks are filled
      const allFilled = updatedBlanks.every((blank) => blank.userInput !== null);
      if (allFilled) {
        // Check if the answer is correct
        const isCorrect = updatedBlanks.every((blank) => blank.userInput === blank.value);
        setIsCorrect(isCorrect);
        if (isCorrect) {
          setShowSuccess(true);
        }
      }
    }
  };

  // Clear user inputs
  const clearInputs = () => {
    setBlanks(blanks.map((blank) => ({ ...blank, userInput: null })));
    setAvailableNumbers([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setIsCorrect(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3 },
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: '600px',
            width: '100%',
            padding: { xs: 2, sm: 4 },
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Equation Puzzle
            </Typography>
            <Box>
              <IconButton color="primary" onClick={() => setShowHelp(true)}>
                <HelpIcon />
              </IconButton>
              <IconButton color="secondary" onClick={generateEquation}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              minHeight: '100px',
              backgroundColor: '#e8f4ff',
              borderRadius: '8px',
            }}
          >
            {getDisplayedEquation()}
          </Paper>

          {isCorrect !== null && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h6"
                color={isCorrect ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Available Numbers:
            </Typography>
            <Grid container justifyContent="center">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Grid item key={num}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleNumberClick(num)}
                    disabled={!availableNumbers.includes(num)}
                  >
                    {num}
                  </StyledButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" color="secondary" onClick={clearInputs} sx={{ mr: 2 }}>
              Clear
            </Button>
            <Button variant="contained" color="primary" onClick={generateEquation}>
              New Equation
            </Button>
          </Box>
        </Paper>

        {/* Help Dialog */}
        <Dialog open={showHelp} onClose={() => setShowHelp(false)}>
          <DialogTitle>How to Play</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography>Fill in the blanks with digits 0-9 to make the equation true.</Typography>
              <Typography>
                Each digit can only be used once, and each blank requires exactly one digit.
              </Typography>
              <Typography>
                The equation contains 2-3 mathematical operations. Think carefully!
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHelp(false)} color="primary">
              Got it!
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <DialogContentText>You solved the equation correctly!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowSuccess(false);
                generateEquation();
              }}
              color="primary"
              variant="contained"
            >
              Next Puzzle
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
