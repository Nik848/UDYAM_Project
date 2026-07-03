import React from 'react';
import type { RawButton } from '../../types/schema';

interface ButtonFieldProps {
  button: RawButton;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({ 
  button, 
  onClick, 
  type = 'button',
  className
}) => {
  return (
    <button
      id={button.id || undefined}
      name={button.name || undefined}
      type={type}
      onClick={onClick}
      disabled={button.disabled}
      className={`px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${className || ''} ${button.className || ''}`}
    >
      {button.text || button.value || 'Submit'}
    </button>
  );
};
