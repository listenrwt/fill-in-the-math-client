// You can add more props to the component if needed.
// Display the question to the user properly with provided question]
// Example: [1, MathSymbol.Addition , 2, MathSymbol.Multiplication, MathSymbol.Blank, MathSymbol.Equals, 4]
// Result: 1 + 2 * ? = 4
import { Box, Typography } from '@mui/material';

import { MathSymbol } from '@/lib/question.enum';
import { Question } from '@/lib/question.types';

interface CalculatorDisplayProps {
  question: Question;
}

const CalculatorDisplay = ({ question }: CalculatorDisplayProps) => {
  if (!question) {
    return <Typography color="error">Error: No question provided</Typography>;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#D9D9D9',
        p: 2,
        borderRadius: 2,
        fontSize: '2rem',
        fontWeight: 'bold',
        gap: 1,
        color: '#000',
        fontFamily: 'Andale Mono, monospace',
      }}
    >
      {question.map((item, index) => (
        <Typography
          key={index}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: item === MathSymbol.Blank ? '#262626' : 'transparent',
            color: item === MathSymbol.Blank ? '#fff' : '#000',
            fontSize: '2rem',
            minWidth: 30,
            textAlign: 'center',
            fontFamily: 'Andale Mono, monospace',
          }}
        >
          {item === MathSymbol.Blank ? '?' : item}
        </Typography>
      ))}
    </Box>
  );
};

export default CalculatorDisplay;
