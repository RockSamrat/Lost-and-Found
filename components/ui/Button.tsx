'use client';

import React from 'react';

type ButtonVariant = 'default' | 'accent' | 'outlined' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'neu-button',
  accent: 'neu-button neu-button--accent',
  outlined: 'neu-button neu-button--outlined',
  ghost: 'neu-button neu-button--ghost',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'neu-button--sm',
  md: '',
  lg: 'neu-button--lg',
};

export default function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}
