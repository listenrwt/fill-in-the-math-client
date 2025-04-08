import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';

interface CalculatorButtonProps {
  value?: number | string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  variant?: 'number' | 'delete' | 'back' | 'confirm';
}

export default function CalculatorButton({
  text,
  onClick,
  disabled,
  selected = false,
  variant = 'number',
}: CalculatorButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'delete':
        return { bgcolor: 'red', color: 'white' };
      case 'back':
        return { bgcolor: '#555', color: 'white' };
      case 'confirm':
        return { bgcolor: 'green', color: 'white' };
      default:
        return {
          bgcolor: selected ? '#444' : '#777',
          color: 'white',
          opacity: disabled ? 0.5 : 1,
        };
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
        '&:hover': { opacity: disabled ? 0.5 : 0.8 },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'confirm' ? <CheckIcon /> : text}
    </Button>
  );
}
