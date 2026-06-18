import React from 'react';

/**
 * Reusable, Accessible Range Slider Component
 * 
 * @param {Object} props
 * @param {string} props.id - Unique input node ID (required for a11y labels)
 * @param {string} props.label - User facing slider description
 * @param {number} props.min - Minimum value boundary
 * @param {number} props.max - Maximum value boundary
 * @param {number} [props.step=1] - Numeric increments step
 * @param {number} props.value - Slider current state value
 * @param {string} [props.unit=""] - Unit symbol label (e.g., 'km', 'kWh')
 * @param {function} props.onChange - Value alteration callback
 * @param {string} [props.className=""] - Custom wrapper CSS class
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
}) {
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
