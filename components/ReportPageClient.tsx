'use client';

import React, { useActionState, useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createItem } from '@/app/actions/items';
import { useRouter } from 'next/navigation';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

const categories = [
  { value: 'Electronics', icon: '📱', label: 'Electronics' },
  { value: 'Keys', icon: '🔑', label: 'Keys' },
  { value: 'Wallet', icon: '👛', label: 'Wallet' },
  { value: 'Pet', icon: '🐾', label: 'Pet' },
  { value: 'Bag', icon: '🎒', label: 'Bag' },
  { value: 'Documents', icon: '📄', label: 'Documents' },
  { value: 'Other', icon: '📦', label: 'Other' },
];

export default function ReportPageClient() {
  const [state, action, pending] = useActionState(createItem, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [itemType, setItemType] = useState<'LOST' | 'FOUND'>('LOST');
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition({ lat, lng });
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.push('/feed');
    }
  }, [state?.success, router]);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <section style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📍</div>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Report an Item
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
          Pin it on the map so the community can help you find it — or return it to its owner.
        </p>
      </div>

      {/* Status message */}
      {state?.message && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Hidden fields */}
        <input type="hidden" name="latitude" value={position?.lat ?? ''} />
        <input type="hidden" name="longitude" value={position?.lng ?? ''} />
        <input type="hidden" name="type" value={itemType} />
        <input type="hidden" name="category" value={selectedCategory} />

        {/* ═══ Step 1: Type ═══ */}
        <div className="neu-card animate-fade-in-up" style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              className="neu-pressed"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.813rem',
                fontWeight: 800,
                color: 'var(--accent)',
              }}
            >
              1
            </span>
            <h2 style={{ fontWeight: 700, fontSize: '1.063rem', color: 'var(--text-primary)', margin: 0 }}>
              What happened?
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {([
              { value: 'LOST' as const, label: 'I Lost Something', icon: '🔴', desc: 'Report a missing item' },
              { value: 'FOUND' as const, label: 'I Found Something', icon: '🟢', desc: 'Help return an item' },
            ]).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setItemType(t.value)}
                className={itemType === t.value ? 'neu-pressed' : 'neu-flat'}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: itemType === t.value ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)',
                  background: 'var(--bg-base)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.label}</span>
                <span style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)' }}>{t.desc}</span>
              </button>
            ))}
          </div>
          {state?.errors?.type && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '8px' }}>{state.errors.type[0]}</p>}
        </div>

        {/* ═══ Step 2: Item Details ═══ */}
        <div className="neu-card animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              className="neu-pressed"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.813rem',
                fontWeight: 800,
                color: 'var(--accent)',
              }}
            >
              2
            </span>
            <h2 style={{ fontWeight: 700, fontSize: '1.063rem', color: 'var(--text-primary)', margin: 0 }}>
              Describe the item
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="What did you lose / find?"
              name="title"
              placeholder="e.g. Black leather wallet, iPhone 15, car keys..."
              required
              error={state?.errors?.title?.[0]}
            />

            {/* Category pills */}
            <div>
              <label style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedCategory(c.value)}
                    className={selectedCategory === c.value ? 'neu-pressed' : 'neu-flat'}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedCategory === c.value ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                      fontSize: '0.75rem',
                      fontWeight: selectedCategory === c.value ? 700 : 500,
                      color: selectedCategory === c.value ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      background: 'var(--bg-base)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span>{c.icon}</span> {c.label}
                  </button>
                ))}
              </div>
              {state?.errors?.category && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '6px' }}>{state.errors.category[0]}</p>}
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.813rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Description
              </label>
              <div className="neu-pressed" style={{ borderRadius: 'var(--radius-md)', padding: 0 }}>
                <textarea
                  name="description"
                  rows={3}
                  required
                  placeholder="Describe the item in detail — color, brand, distinguishing features..."
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                  }}
                />
              </div>
              {state?.errors?.description && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '6px' }}>{state.errors.description[0]}</p>}
            </div>

            <Input
              label="When did it happen?"
              name="date"
              type="date"
              required
              defaultValue={today}
              error={state?.errors?.date?.[0]}
            />
          </div>
        </div>

        {/* ═══ Step 3: Location ═══ */}
        <div className="neu-card animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              className="neu-pressed"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.813rem',
                fontWeight: 800,
                color: 'var(--accent)',
              }}
            >
              3
            </span>
            <h2 style={{ fontWeight: 700, fontSize: '1.063rem', color: 'var(--text-primary)', margin: 0 }}>
              Where was it?
            </h2>
          </div>

          {/* GPS + Location name row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input
                label="Location name (optional)"
                name="locationName"
                placeholder="e.g. Near the Central Park fountain"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button type="button" variant="outlined" size="sm" onClick={detectLocation} loading={detecting}>
                📍 Use My Location
              </Button>
            </div>
          </div>

          {/* Map */}
          <div
            className="neu-pressed"
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '320px',
              position: 'relative',
            }}
          >
            <LocationPicker
              onMapClick={handleMapClick}
              selectedPosition={position}
            />
          </div>

          {/* Location status */}
          {position ? (
            <div
              className="neu-flat animate-fade-in"
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.813rem',
                color: 'var(--success)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>✅</span>
              Location set: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </div>
          ) : (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.813rem',
                color: 'var(--text-tertiary)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-soft)',
              }}
            >
              <span>👆</span>
              Tap the map or use &quot;Use My Location&quot; to set the pin
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            loading={pending}
            disabled={!position}
            style={{ width: '100%', fontSize: '1rem' }}
          >
            {pending ? 'Submitting...' : '📌 Post Report'}
          </Button>
          {!position && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
              Set a location on the map to enable posting
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
