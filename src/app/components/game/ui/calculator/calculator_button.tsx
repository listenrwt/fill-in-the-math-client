import { keyframes } from '@emotion/react';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';

interface CalculatorButtonProps {
  value?: number | string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  variant?: 'number' | 'delete' | 'clear' | 'confirm';
}

// Define a rotational shake keyframes animation
const rotateShake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

export default function CalculatorButton({
  text,
  onClick,
  disabled,
  selected = false,
  variant = 'number',
}: CalculatorButtonProps) {
  const getButtonStyle = () => {
    let style = {};

    switch (variant) {
      case 'delete':
        style = { bgcolor: '#555555', color: '#FFFFFF' };
        break;
      case 'clear':
        style = { bgcolor: '#FF0000', color: '#FFFFFF' };
        break;
      case 'confirm':
        style = { bgcolor: '#009900', color: '#FFFFFF' };
        break;
      default:
        style = { bgcolor: '#919191', color: '#FFFFFF' };
    }

    if (selected) {
      style = { ...style, bgcolor: '#6C6C6C' };
    }

    return style;
  };

  return (
    <Button
      variant="text"
      sx={{
        width: 60,
        height: 60,
        fontSize: '1.5rem',
        borderRadius: 2,
        ...getButtonStyle(),
        '&:hover': { opacity: disabled ? 1 : 0.8, animation: `${rotateShake} 0.4s ease` },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'confirm' ? <CheckIcon /> : text}
    </Button>
  );
}
