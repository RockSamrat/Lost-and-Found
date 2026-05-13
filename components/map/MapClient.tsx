'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Badge from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

// Leaflet must be client-only (no SSR)
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

interface MapItem {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  locationName: string | null;
  date: string;
  resolved: boolean;
  createdAt: string;
  userName: string;
}

interface MapClientProps {
  initialItems: MapItem[];
}

export default function MapClient({ initialItems }: MapClientProps) {
  const [items, setItems] = useState<MapItem[]>(initialItems);
  const [filter, setFilter] = useState('ALL');
  const router = useRouter();
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const filtered = items.filter((i) => {
    if (filter === 'ALL') return true;
    return i.type === filter;
  });

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedPos({ lat, lng });
    setSelectedItem(null);
  }, []);

  const handleMarkerClick = useCallback((item: MapItem) => {
    setSelectedItem(item as MapItem);
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          items={filtered}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          selectedPosition={selectedPos}
        />

        {/* Filter pills */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            gap: '6px',
          }}
        >
          {['ALL', 'LOST', 'FOUND'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'neu-pressed' : 'neu-raised-sm'}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: filter === f ? 700 : 500,
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                background: 'var(--bg-base)',
              }}
            >
              {f === 'ALL' ? '🗺️ All' : f === 'LOST' ? '🔴 Lost' : '🟢 Found'}
            </button>
          ))}
        </div>

        {/* FAB */}
        <button
          onClick={() => router.push('/report')}
          className="neu-button neu-button--accent"
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            padding: 0,
            fontSize: '1.5rem',
            zIndex: 1000,
            boxShadow: '4px 4px 12px rgba(192,57,43,0.4), -2px -2px 8px rgba(255,120,100,0.2)',
          }}
          aria-label="Report an item"
        >
          ＋
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          width: '360px',
          background: 'var(--bg-base)',
          borderLeft: '1px solid var(--border-subtle)',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar header */}
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.063rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Nearby Items
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Selected item detail */}
        {selectedItem && (
          <div
            className="animate-fade-in"
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-sunken)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Badge variant={selectedItem.type === 'LOST' ? 'lost' : 'found'}>
                {selectedItem.type}
              </Badge>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {selectedItem.title}
            </h3>
            <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
              {selectedItem.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <span>📁 {selectedItem.category}</span>
              {selectedItem.locationName && <span>📍 {selectedItem.locationName}</span>}
              <span>📅 {new Date(selectedItem.date).toLocaleDateString()}</span>
              <span>👤 {selectedItem.userName}</span>
            </div>
          </div>
        )}

        {/* Item list */}
        <div style={{ flex: 1, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🗺️</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No items to display</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="neu-flat animate-fade-in"
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'backwards',
                  transition: 'all var(--transition-fast)',
                  border: selectedItem?.id === item.id ? '1px solid var(--accent)' : '1px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Badge variant={item.type === 'LOST' ? 'lost' : 'found'}>
                    {item.type}
                  </Badge>
                  <span style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)' }}>
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                {item.locationName && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📍 {item.locationName}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
