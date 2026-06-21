import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable, Accessible Range Slider Component (TypeScript)
 */
export default function Slider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  onChange,
  className = '',
  ...rest
}: SliderProps) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        <span className="form-label-value" data-testid={`${id}-badge`}>
          {value} {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <div 
        className="flex-between" 
        style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}
      >
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
