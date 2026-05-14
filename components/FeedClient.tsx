'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Search, X, Smartphone, KeyRound, Wallet, PawPrint,
  ShoppingBag, FileText, Package, FolderOpen,
  Folder, MapPin, Calendar, Map,
} from 'lucide-react';

interface FeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  latitude: number;
  longitude: number;
  locationName: string | null;
  date: string;
  resolved: boolean;
  createdAt: string;
  userName: string;
}

const categories = ['All', 'Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other'];

const CategoryIcon: Record<string, React.ElementType> = {
  All: FolderOpen, Electronics: Smartphone, Keys: KeyRound,
  Wallet, Pet: PawPrint, Bag: ShoppingBag, Documents: FileText, Other: Package,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function FeedClient({ items }: { items: FeedItem[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = useMemo(() => items.filter((item) => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locationName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }), [items, typeFilter, categoryFilter, search]);

  const lostCount     = items.filter((i) => i.type === 'LOST'  && !i.resolved).length;
  const foundCount    = items.filter((i) => i.type === 'FOUND' && !i.resolved).length;
  const resolvedCount = items.filter((i) => i.resolved).length;

  const hasFilters = search.trim() || typeFilter !== 'ALL' || categoryFilter !== 'All';
  const clearAll   = () => { setSearch(''); setTypeFilter('ALL'); setCategoryFilter('All'); };

  return (
    <section style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Community Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', margin: '0 0 20px' }}>
          Browse all lost and found reports from the community
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Lost',     count: lostCount,     color: 'var(--accent)',         bg: 'var(--accent-soft)' },
            { label: 'Found',    count: foundCount,    color: 'var(--success)',        bg: 'var(--success-soft)' },
            { label: 'Resolved', count: resolvedCount, color: 'var(--text-secondary)', bg: 'rgba(59,47,47,0.06)' },
          ].map((s) => (
            <div key={s.label} className="neu-flat" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px', animationDelay: '80ms', animationFillMode: 'backwards' }}>

        {/* Search */}
        <div className="neu-pressed" style={{ borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px' }}>
          <Search size={15} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search by name, description, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search items"
            style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', padding: '4px' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type + category */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {(['ALL', 'LOST', 'FOUND'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              aria-pressed={typeFilter === t}
              className={typeFilter === t ? 'neu-pressed' : 'neu-flat'}
              style={{ padding: '7px 18px', borderRadius: 'var(--radius-full)', border: typeFilter === t ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)', fontSize: '0.813rem', fontWeight: typeFilter === t ? 700 : 500, color: typeFilter === t ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', background: 'var(--bg-base)', transition: 'all var(--transition-fast)' }}
            >
              {t === 'ALL' ? 'All' : t === 'LOST' ? 'Lost' : 'Found'}
            </button>
          ))}

          <div style={{ width: '1px', height: '22px', background: 'var(--border-subtle)', margin: '0 2px' }} />

          {categories.map((c) => {
            const Icon = CategoryIcon[c];
            const active = categoryFilter === c;
            return (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                aria-pressed={active}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: active ? '1px solid var(--accent)' : '1px solid transparent', fontSize: '0.75rem', fontWeight: active ? 700 : 500, color: active ? 'var(--accent)' : 'var(--text-tertiary)', cursor: 'pointer', background: active ? 'var(--accent-soft)' : 'transparent', transition: 'all var(--transition-fast)' }}
              >
                <Icon size={12} />
                {c}
              </button>
            );
          })}

          {hasFilters && (
            <button onClick={clearAll} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid transparent', fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent)', cursor: 'pointer', background: 'var(--accent-soft)', transition: 'all var(--transition-fast)' }}>
              <X size={11} /> Clear all
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.813rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        {hasFilters ? `${filtered.length} of ${items.length} items` : `${items.length} items`}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '56px 32px' }}>
          <Search size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '8px', color: 'var(--text-primary)' }}>No items found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 20px' }}>
            {search ? `Nothing matches "${search}". Try a different term or clear the filters.` : 'No items match the current filters.'}
          </p>
          <button onClick={clearAll} className="neu-button">Clear filters</button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(idx * 40, 320)}ms`, animationFillMode: 'backwards', opacity: item.resolved ? 0.65 : 1, position: 'relative', overflow: 'hidden', padding: 0 }}
            >
              {/* Resolved ribbon */}
              {item.resolved && (
                <div aria-label="Resolved" style={{ position: 'absolute', top: '12px', right: '-26px', background: 'var(--text-secondary)', color: '#fff', fontSize: '0.563rem', fontWeight: 700, padding: '3px 32px', transform: 'rotate(45deg)', letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 1 }}>
                  Resolved
                </div>
              )}

              {/* Image or placeholder */}
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '148px', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '64px', background: item.type === 'LOST' ? 'var(--accent-soft)' : 'var(--success-soft)', display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                  {(() => { const Icon = CategoryIcon[item.category] ?? Package; return <Icon size={22} color={item.type === 'LOST' ? 'var(--accent)' : 'var(--success)'} />; })()}
                </div>
              )}

              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Badge variant={item.resolved ? 'resolved' : item.type === 'LOST' ? 'lost' : 'found'}>
                    {item.resolved ? 'Resolved' : item.type === 'LOST' ? 'Lost' : 'Found'}
                  </Badge>
                  <span style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)' }}>{timeAgo(item.createdAt)}</span>
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', color: 'var(--text-primary)', textDecoration: item.resolved ? 'line-through' : 'none', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Folder size={12} /> {item.category}
                  </span>
                  {item.locationName && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={12} /> {item.locationName}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} /> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div className="neu-pressed" style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent)' }} title={item.userName}>
                      {item.userName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.userName}</span>
                  </div>
                  <Link href="/map" className="neu-button neu-button--ghost neu-button--sm" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', fontSize: '0.75rem' }}>
                    <Map size={13} /> Map
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
