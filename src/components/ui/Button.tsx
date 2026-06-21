import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  ariaLabel?: string;
}

/**
 * Reusable, Accessible Button Component (TypeScript)
 */
export default function Button({
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  children,
  ...rest
}: ButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'btn-danger';
      case 'primary':
      default:
        return 'btn-primary';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
}
