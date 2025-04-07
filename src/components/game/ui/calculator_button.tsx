// You can add more props to the component if needed.
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';

interface CalculatorButtonProps {
  value?: number | string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'number' | 'delete' | 'back' | 'confirm';
}

export default function CalculatorButton({
  // value,
  text,
  onClick,
  disabled,
  variant = 'number',
}: CalculatorButtonProps) {
  // Define styles based on button variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'delete':
        return { bgcolor: 'red', color: 'white' };
      case 'back':
        return { bgcolor: '#262626', color: 'white' };
      case 'confirm':
        return { bgcolor: 'green', color: 'white' };
      default:
        return { bgcolor: '#5E5E5E', color: 'white' };
    }
  };

  return (
    <Button
      variant="contained"
      sx={{
        width: 60,
        height: 60,
        fontSize: '1.5rem',
        borderRadius: 2,
        ...getButtonStyle(),
        '&:hover': { opacity: 0.8 },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'confirm' ? <CheckIcon /> : text}
    </Button>
  );
}
