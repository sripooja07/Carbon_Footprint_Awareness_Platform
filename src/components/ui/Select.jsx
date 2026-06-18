import React from 'react';

/**
 * Reusable, Accessible Select Dropdown Component
 * 
 * @param {Object} props
 * @param {string} props.id - Unique select node ID (required for a11y labels)
 * @param {string} props.label - User facing label text
 * @param {string} [props.description] - Optional subtitle helping users understand select parameters
 * @param {string|number} props.value - Selected option value
 * @param {function} props.onChange - Selection change callback
 * @param {Array<{value: string|number, label: string}>} props.options - Selectable options list
 * @param {string} [props.className=""] - Custom wrapper CSS class
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
}) {
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
