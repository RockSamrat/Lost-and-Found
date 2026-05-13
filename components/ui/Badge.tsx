import React from 'react';

type BadgeVariant = 'lost' | 'found' | 'resolved';

export interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const icons: Record<BadgeVariant, string> = {
  lost: '🔴',
  found: '🟢',
  resolved: '✓',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      <span style={{ fontSize: '0.625rem' }}>{icons[variant]}</span>
      {children ?? variant}
    </span>
  );
}
