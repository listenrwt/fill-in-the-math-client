// You can add more props to the component if needed.
interface CalculatorButtonProps {
  value: number;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

// TODO: Implement the CalculatorButton component
const CalculatorButton: React.FC<CalculatorButtonProps> = ({ value, text, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} value={value}>
      {text}
    </button>
  );
};

export default CalculatorButton;
