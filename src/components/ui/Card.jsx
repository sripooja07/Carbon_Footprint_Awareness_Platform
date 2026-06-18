import React from 'react';

/**
 * Reusable Glassmorphism Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} [props.title] - Card header title text
 * @param {React.ReactNode} [props.icon] - Optional icon rendering adjacent to the title
 * @param {React.ReactNode} [props.action] - Optional header action button / component
 * @param {string} [props.className=""] - Custom css classes
 * @param {React.ReactNode} props.children - Inner card content elements
 */
export default function Card({
  title,
  icon,
  action,
  className = '',
  children,
  ...rest
}) {
  return (
    <section 
      className={`glass-panel card-content ${className}`} 
      {...rest}
    >
      {(title || icon || action) && (
        <div 
          className="flex-between" 
          style={{ marginBottom: '1.25rem' }}
        >
          {(title || icon) && (
            <h3 className="card-title" style={{ margin: 0 }}>
              {icon && <span className="logo-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
              {title}
            </h3>
          )}
          {action && <div className="card-header-action">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
