'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createItem } from '@/app/actions/items';

interface ReportFormProps {
  open: boolean;
  onClose: () => void;
  position: { lat: number; lng: number } | null;
}

const categories = ['Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other'];

export default function ReportForm({ open, onClose, position }: ReportFormProps) {
  const [state, action, pending] = useActionState(createItem, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Report an Item">
      {!position && (
        <div style={{
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.813rem',
          fontWeight: 500,
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          📍 Click on the map first to set the location
        </div>
      )}

      {state?.message && (
        <div style={{
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.813rem',
          fontWeight: 500,
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          {state.message}
        </div>
      )}

      <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Hidden location fields */}
        <input type="hidden" name="latitude" value={position?.lat ?? ''} />
        <input type="hidden" name="longitude" value={position?.lng ?? ''} />

        {/* Type toggle */}
        <div>
          <label style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Type
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['LOST', 'FOUND'] as const).map((t) => (
              <label
                key={t}
                className="neu-flat"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input type="radio" name="type" value={t} defaultChecked={t === 'LOST'} style={{ display: 'none' }} />
                <span>{t === 'LOST' ? '🔴' : '🟢'}</span>
                {t === 'LOST' ? 'I Lost It' : 'I Found It'}
              </label>
            ))}
          </div>
          {state?.errors?.type && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{state.errors.type[0]}</p>}
        </div>

        <Input
          label="Title"
          name="title"
          placeholder="e.g. Black leather wallet"
          required
          error={state?.errors?.title?.[0]}
        />

        {/* Category */}
        <div>
          <label style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Category
          </label>
          <div className="neu-pressed" style={{ borderRadius: 'var(--radius-md)', padding: '0' }}>
            <select
              name="category"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {state?.errors?.category && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{state.errors.category[0]}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <div className="neu-pressed" style={{ borderRadius: 'var(--radius-md)', padding: '0' }}>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe the item in detail..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
          {state?.errors?.description && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '4px' }}>{state.errors.description[0]}</p>}
        </div>

        <Input
          label="Location Name (optional)"
          name="locationName"
          placeholder="e.g. Near Central Park fountain"
        />

        <Input
          label="Date"
          name="date"
          type="date"
          required
          error={state?.errors?.date?.[0]}
        />

        {/* Location preview */}
        {position && (
          <div className="neu-flat" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
            📍 Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          size="lg"
          loading={pending}
          disabled={!position}
          style={{ width: '100%', marginTop: '4px' }}
        >
          Submit Report
        </Button>
      </form>
    </Modal>
  );
}
