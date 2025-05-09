'use client';

import { Box, Typography } from '@mui/material';

import { MathSymbol } from '@/lib/question.enum';

interface CalculatorDisplayProps {
  equation: (number | MathSymbol)[];
  answer?: number[]; // Add answer array as optional prop
}

const CalculatorDisplay = ({ equation, answer = [] }: CalculatorDisplayProps) => {
  if (!equation || equation.length === 0) {
    return <Typography color="error">Error: No question provided</Typography>;
  }

  // Helper function to convert MathSymbol to display character
  const getDisplayValue = (item: number | MathSymbol): string => {
    switch (item) {
      case MathSymbol.Addition:
        return '+';
      case MathSymbol.Subtraction:
        return '-';
      case MathSymbol.Multiplication:
        return '×';
      case MathSymbol.Division:
        return '÷';
      case MathSymbol.Equals:
        return '=';
      case MathSymbol.Blank:
        return '?';
      default:
        return String(item);
    }
  };

  // Create a display version of the equation with answers filled in
  const displayEquation = [...equation];
  let answerIndex = 0;

  for (let i = 0; i < displayEquation.length; i++) {
    if (displayEquation[i] === MathSymbol.Blank && answerIndex < answer.length) {
      // Replace the blank with the corresponding answer
      displayEquation[i] = answer[answerIndex];
      answerIndex++;
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        flexWrap: 'wrap',
      }}
    >
      {displayEquation.map((item, index) => {
        const isFilledBlank = equation[index] === MathSymbol.Blank;

        // Determine if this blank has been filled with an answer
        const hasAnswer = isFilledBlank && answer.length > 0;

        return (
          <Box
            key={index}
            sx={{
              p: 1,
              borderRadius: 1,
              // For filled blanks, apply animation, otherwise use static colors
              bgcolor: isFilledBlank ? '#262626' : 'transparent',
              // Apply a pulsing animation only to filled blanks
              animation: hasAnswer ? 'pulse 2s infinite ease-in-out' : 'none',
              // Define the pulse animation keyframes
              '@keyframes pulse': {
                '0%': { backgroundColor: '#262626' },
                '50%': { backgroundColor: '#4CAF50' },
                '100%': { backgroundColor: '#262626' },
              },
              transition: 'background-color 0.8s ease-in-out',
              color: isFilledBlank ? '#ffffff' : '#000000',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: '2rem', textAlign: 'center' }}>
              {getDisplayValue(item)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CalculatorDisplay;
