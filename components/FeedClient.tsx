'use client';

import React, { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface FeedItem {
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

const categories = ['All', 'Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other'];

const categoryIcons: Record<string, string> = {
  All: '🗂️',
  Electronics: '📱',
  Keys: '🔑',
  Wallet: '👛',
  Pet: '🐾',
  Bag: '🎒',
  Documents: '📄',
  Other: '📦',
};

export default function FeedClient({ items }: { items: FeedItem[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLocation = item.locationName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLocation) return false;
      }
      return true;
    });
  }, [items, typeFilter, categoryFilter, search]);

  const lostCount = items.filter((i) => i.type === 'LOST' && !i.resolved).length;
  const foundCount = items.filter((i) => i.type === 'FOUND' && !i.resolved).length;
  const resolvedCount = items.filter((i) => i.resolved).length;

  return (
    <section style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Community Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', margin: '0 0 20px' }}>
          Browse all lost and found reports from the community
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Lost', count: lostCount, color: 'var(--accent)', bg: 'var(--accent-soft)', icon: '🔴' },
            { label: 'Found', count: foundCount, color: 'var(--success)', bg: 'var(--success-soft)', icon: '🟢' },
            { label: 'Resolved', count: resolvedCount, color: 'var(--text-secondary)', bg: 'rgba(59,47,47,0.08)', icon: '✓' },
          ].map((s) => (
            <div
              key={s.label}
              className="neu-flat"
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '120px',
              }}
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                }}
              >
                {s.icon}
              </span>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & filters */}
      <div
        className="animate-fade-in-up"
        style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '100ms', animationFillMode: 'backwards' }}
      >
        {/* Search bar */}
        <div className="neu-pressed" style={{ borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', marginRight: '10px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search items by name, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '14px 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '0.875rem',
                padding: '4px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['ALL', 'LOST', 'FOUND'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={typeFilter === t ? 'neu-pressed' : 'neu-flat'}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.813rem',
                fontWeight: typeFilter === t ? 700 : 500,
                color: typeFilter === t ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                background: 'var(--bg-base)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {t === 'ALL' ? '🗺️ All' : t === 'LOST' ? '🔴 Lost' : '🟢 Found'}
            </button>
          ))}

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }} />

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={categoryFilter === c ? 'neu-pressed' : ''}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: categoryFilter === c ? 700 : 500,
                  color: categoryFilter === c ? 'var(--accent)' : 'var(--text-tertiary)',
                  cursor: 'pointer',
                  background: categoryFilter === c ? 'var(--bg-base)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {categoryIcons[c]} {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '16px', fontSize: '0.813rem', color: 'var(--text-tertiary)' }}>
        Showing {filtered.length} of {items.length} items
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <Card className="animate-fade-in-up" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
            🔍
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            No Items Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 24px' }}>
            {search
              ? `No results matching "${search}". Try a different search term.`
              : 'No items match the current filters. Try changing your selection.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('ALL');
              setCategoryFilter('All');
            }}
            className="neu-button"
          >
            Clear Filters
          </button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${idx * 40}ms`,
                animationFillMode: 'backwards',
                opacity: item.resolved ? 0.65 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Resolved ribbon */}
              {item.resolved && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '-28px',
                    background: 'var(--text-secondary)',
                    color: '#fff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '4px 36px',
                    transform: 'rotate(45deg)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Resolved
                </div>
              )}

              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <Badge variant={item.resolved ? 'resolved' : item.type === 'LOST' ? 'lost' : 'found'}>
                  {item.resolved ? 'RESOLVED' : item.type}
                </Badge>
                <span style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)' }}>{timeAgo(item.createdAt)}</span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: '1.063rem',
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                  textDecoration: item.resolved ? 'line-through' : 'none',
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.813rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </p>

              {/* Meta info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📁 {item.category}
                </span>
                {item.locationName && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 {item.locationName}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📅 {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    className="neu-pressed"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {item.userName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {item.userName}
                  </span>
                </div>
                <a
                  href={`/map`}
                  className="neu-button neu-button--sm neu-button--ghost"
                  style={{ padding: '4px 12px', fontSize: '0.688rem' }}
                >
                  📍 View on Map
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
