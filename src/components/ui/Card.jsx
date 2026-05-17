import React from 'react';

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default'
}) {
  const baseStyles = `
    p-[var(--space-5)]
    rounded-[var(--radius-lg)]
    transition-all var(--duration-base) var(--ease-out)
    ${className}
  `;

  const variantStyles = {
    default: 'bg-[var(--bg-card)] border border-[var(--border-subtle)]',
    elevated: 'bg-[var(--bg-elevated)]',
    accent: 'border border-[var(--border-accent)] border-width-1px',
  };

  const hoverStyles = hoverable
    ? 'hover:bg-[var(--bg-card-hover)] hover:shadow-lg hover:shadow-[var(--shadow-accent)]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles}`}
    >
      {children}
    </div>
  );
}
