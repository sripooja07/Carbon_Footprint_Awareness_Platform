import React from 'react';

/**
 * Reusable, Accessible Button Component
 * 
 * @param {Object} props
 * @param {string} [props.type="button"] - HTML button type ('button', 'submit', 'reset')
 * @param {string} [props.variant="primary"] - Button style variant ('primary', 'secondary', 'danger')
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className=""] - Custom css classes
 * @param {string} [props.ariaLabel] - Accessible aria-label override
 * @param {React.ReactNode} props.children - Button label / inner elements
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
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'btn-danger'; // Let's support danger buttons if we need deletion
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
