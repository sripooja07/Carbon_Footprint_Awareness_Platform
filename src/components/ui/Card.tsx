import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Reusable Glassmorphism Card Component (TypeScript)
 */
export default function Card({
  title,
  icon,
  action,
  className = '',
  children,
  ...rest
}: CardProps) {
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
