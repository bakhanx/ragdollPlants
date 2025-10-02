import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${className} rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};
