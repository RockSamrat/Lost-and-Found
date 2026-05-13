'use client';

import React, { useEffect, useCallback } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = '480px',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="neu-card animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth,
          width: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '32px',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: title ? '24px' : '0',
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="neu-button neu-button--ghost neu-button--sm"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.125rem',
              lineHeight: 1,
              minWidth: 'auto',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
