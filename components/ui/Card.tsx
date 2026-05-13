import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className = '',
  hover = true,
  style,
}: CardProps) {
  return (
    <div
      className={`neu-card ${className}`}
      style={{
        ...style,
        transition: hover ? 'box-shadow var(--transition-base)' : undefined,
      }}
    >
      {children}
    </div>
  );
}
