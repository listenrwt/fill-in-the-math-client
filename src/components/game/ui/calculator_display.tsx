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
        bgcolor: 'grey.300',
        p: 2,
        borderRadius: 2,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        gap: 1,
      }}
    >
      {question.map((item, index) => (
        <Typography
          key={index}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: item === MathSymbol.Blank ? 'black' : 'transparent',
            color: item === MathSymbol.Blank ? 'white' : 'black',
            fontSize: '1.8rem',
          }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
};

export default CalculatorDisplay;
