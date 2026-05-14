import React from 'react';

type BadgeVariant = 'lost' | 'found' | 'resolved';

export interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const dots: Record<BadgeVariant, React.CSSProperties> = {
  lost:     { background: 'var(--accent)' },
  found:    { background: 'var(--success)' },
  resolved: { background: 'var(--text-tertiary)' },
};

const labels: Record<BadgeVariant, string> = {
  lost: 'Lost', found: 'Found', resolved: 'Resolved',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, ...dots[variant] }} />
      {children ?? labels[variant]}
    </span>
  );
}
