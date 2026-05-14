'use client';

import React, { useActionState, useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createItem } from '@/app/actions/items';
import { useRouter } from 'next/navigation';
import {
  MapPin, Smartphone, KeyRound, Wallet, PawPrint,
  ShoppingBag, FileText, Package, LocateFixed,
  CheckCircle2, MousePointerClick, Send, AlertCircle,
} from 'lucide-react';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

const CATEGORIES = [
  { value: 'Electronics', Icon: Smartphone,  label: 'Electronics' },
  { value: 'Keys',        Icon: KeyRound,    label: 'Keys' },
  { value: 'Wallet',      Icon: Wallet,      label: 'Wallet' },
  { value: 'Pet',         Icon: PawPrint,    label: 'Pet' },
  { value: 'Bag',         Icon: ShoppingBag, label: 'Bag' },
  { value: 'Documents',   Icon: FileText,    label: 'Documents' },
  { value: 'Other',       Icon: Package,     label: 'Other' },
];

export default function ReportPageClient() {
  const [state, action, pending] = useActionState(createItem, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const router  = useRouter();

  const [itemType,          setItemType]          = useState<'LOST' | 'FOUND'>('LOST');
  const [selectedCategory,  setSelectedCategory]  = useState('Electronics');
  const [position,          setPosition]          = useState<{ lat: number; lng: number } | null>(null);
  const [locationName,      setLocationName]      = useState('');
  const [detecting,         setDetecting]         = useState(false);
  const [geoError,          setGeoError]          = useState(false);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition({ lat, lng });
    setGeoError(false);
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { setGeoError(true); return; }
    setDetecting(true);
    setGeoError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetecting(false);
      },
      () => { setDetecting(false); setGeoError(true); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { if (state?.success) { formRef.current?.reset(); router.push('/feed'); } }, [state?.success, router]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { detectLocation(); }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <section style={{ padding: '40px 24px 80px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>

      {/* Page header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', marginBottom: 16 }}>
          <MapPin size={22} color="var(--accent)" />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Report an Item
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
          Pin the location, describe what you lost or found, and let the community help.
        </p>
      </div>

      {/* Server error banner */}
      {state?.message && !state?.success && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 24, border: '1px solid rgba(192,57,43,0.2)' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          {state.message}
        </div>
      )}

      <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input type="hidden" name="latitude"  value={position?.lat ?? ''} />
        <input type="hidden" name="longitude" value={position?.lng ?? ''} />
        <input type="hidden" name="type"      value={itemType} />
        <input type="hidden" name="category"  value={selectedCategory} />

        {/* ── Step 1: Type ── */}
        <fieldset style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', margin: 0, background: 'var(--bg-raised)', boxShadow: 'var(--shadow-xs)' }}>
          <legend style={{ padding: '0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step 1
          </legend>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
            What happened?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {([
              { value: 'LOST'  as const, label: 'I Lost Something',  sub: 'Report a missing item',  dot: 'var(--accent)' },
              { value: 'FOUND' as const, label: 'I Found Something', sub: 'Help return an item',    dot: 'var(--success)' },
            ]).map((t) => {
              const active = itemType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setItemType(t.value)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: active ? '2px solid var(--accent)' : '1px solid var(--border-medium)',
                    background: active ? 'var(--accent-soft)' : 'var(--bg-base)',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{t.sub}</span>
                </button>
              );
            })}
          </div>
          {state?.errors?.type && <FieldError msg={state.errors.type[0]} />}
        </fieldset>

        {/* ── Step 2: Item details ── */}
        <fieldset style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', margin: 0, background: 'var(--bg-raised)', boxShadow: 'var(--shadow-xs)' }}>
          <legend style={{ padding: '0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step 2
          </legend>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Describe the item
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="What did you lose or find?"
              name="title"
              placeholder="e.g. Black leather wallet, iPhone 15, car keys..."
              required
              error={state?.errors?.title?.[0]}
            />

            {/* Category */}
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                Category
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CATEGORIES.map(({ value, Icon, label }) => {
                  const active = selectedCategory === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedCategory(value)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: active ? '1.5px solid var(--accent)' : '1px solid var(--border-medium)',
                        fontSize: '0.8125rem', fontWeight: active ? 700 : 500,
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        background: active ? 'var(--accent-soft)' : 'var(--bg-base)',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  );
                })}
              </div>
              {state?.errors?.category && <FieldError msg={state.errors.category[0]} />}
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="Color, brand, distinguishing features..."
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.9375rem', color: 'var(--text-primary)',
                  resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--border-medium)'; e.target.style.boxShadow = 'none'; }}
              />
              {state?.errors?.description && <FieldError msg={state.errors.description[0]} />}
            </div>

            <Input label="When did it happen?" name="date" type="date" required defaultValue={today} error={state?.errors?.date?.[0]} />
          </div>
        </fieldset>

        {/* ── Step 3: Location ── */}
        <fieldset style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', margin: 0, background: 'var(--bg-raised)', boxShadow: 'var(--shadow-xs)' }}>
          <legend style={{ padding: '0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step 3
          </legend>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
            Where was it?
          </h2>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input
                label="Location name (optional)"
                name="locationName"
                placeholder="e.g. Near the Central Park fountain"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
            <Button type="button" variant="outlined" size="sm" onClick={detectLocation} loading={detecting}>
              <LocateFixed size={14} /> Use my location
            </Button>
          </div>

          {/* THE FIX: position:relative so the absolute Leaflet div renders inside */}
          <div style={{ position: 'relative', height: 300, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <LocationPicker onMapClick={handleMapClick} selectedPosition={position} />
          </div>

          {/* Location status */}
          <div style={{ marginTop: 10 }}>
            {position ? (
              <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600, background: 'var(--success-soft)', border: '1px solid rgba(39,174,96,0.18)' }}>
                <CheckCircle2 size={14} />
                Pin set: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                <button
                  type="button"
                  onClick={() => setPosition(null)}
                  style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', opacity: 0.7, fontSize: '0.75rem', padding: 0 }}
                >
                  Clear
                </button>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
                <MousePointerClick size={14} style={{ flexShrink: 0 }} />
                {geoError ? 'Location access denied — tap the map to set a pin manually.' : 'Tap the map to place a pin, or use the button above.'}
              </div>
            )}
          </div>
        </fieldset>

        {/* ── Submit ── */}
        <div style={{ paddingTop: 4 }}>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            loading={pending}
            disabled={!position}
            style={{ width: '100%', gap: 8, justifyContent: 'center' }}
          >
            {!pending && <Send size={16} />}
            {pending ? 'Posting...' : 'Post Report'}
          </Button>
          {!position && (
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
              Place a pin on the map to enable posting
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 500, marginTop: 5, margin: '5px 0 0' }}>
      <AlertCircle size={12} /> {msg}
    </p>
  );
}
