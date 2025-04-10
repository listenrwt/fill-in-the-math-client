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
        p: 2,
        borderRadius: 2,
      }}
    >
      {question.map((item, index) => (
        <Box
          key={index}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: item === MathSymbol.Blank ? '#262626' : 'transparent',
            color: item === MathSymbol.Blank ? '#ffffff' : '#000000',
            width: '60px',
            height: '60px',
          }}
        >
          <Typography sx={{ fontSize: '2rem', textAlign: 'center' }}>
            {item === MathSymbol.Blank ? '?' : item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CalculatorDisplay;
