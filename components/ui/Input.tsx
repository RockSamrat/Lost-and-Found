'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.813rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`neu-input ${error ? 'neu-input--error' : ''} ${className}`}
          style={icon ? { paddingLeft: '42px' } : undefined}
          {...props}
        />
      </div>
      {error && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--accent)',
            fontWeight: 500,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
