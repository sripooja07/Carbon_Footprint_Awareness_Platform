import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  description?: string;
  options: SelectOption[];
}

/**
 * Reusable, Accessible Select Dropdown Component (TypeScript)
 */
export default function Select({
  id,
  label,
  description,
  value,
  onChange,
  options = [],
  className = '',
  ...rest
}: SelectProps) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {description && <span className="form-label-desc">{description}</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
