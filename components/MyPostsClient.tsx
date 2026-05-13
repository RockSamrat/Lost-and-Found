'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toggleResolved, deleteItem } from '@/app/actions/items';

interface UserItem {
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
}

export default function MyPostsClient({ items }: { items: UserItem[] }) {
  const [tab, setTab] = useState('All');
  const tabs = ['All', 'Lost', 'Found', 'Resolved'];

  const filtered = items.filter((i) => {
    if (tab === 'All') return true;
    if (tab === 'Resolved') return i.resolved;
    return i.type === tab.toUpperCase() && !i.resolved;
  });

  return (
    <section style={{ padding: '32px 24px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          My Posts
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', margin: 0 }}>
          Manage your lost and found reports
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'neu-pressed' : 'neu-flat'}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.813rem',
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--bg-base)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="animate-fade-in-up" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📭</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            No Posts Yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 24px' }}>
            {tab === 'All'
              ? "You haven't reported any items yet. Head to the map to create your first report!"
              : `No ${tab.toLowerCase()} items to show.`}
          </p>
          <a href="/map" className="neu-button neu-button--accent">📍 Go to Map</a>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards', opacity: item.resolved ? 0.7 : 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Badge variant={item.resolved ? 'resolved' : item.type === 'LOST' ? 'lost' : 'found'}>
                  {item.resolved ? 'RESOLVED' : item.type}
                </Badge>
                <span style={{ fontSize: '0.688rem', color: 'var(--text-tertiary)' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', color: 'var(--text-primary)', textDecoration: item.resolved ? 'line-through' : 'none' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                <span>📁 {item.category}</span>
                {item.locationName && <span>📍 {item.locationName}</span>}
                <span>📅 {new Date(item.date).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <form action={() => toggleResolved(item.id)} style={{ flex: 1 }}>
                  <Button type="submit" variant={item.resolved ? 'default' : 'accent'} size="sm" style={{ width: '100%' }}>
                    {item.resolved ? '↩ Unresolve' : '✓ Resolve'}
                  </Button>
                </form>
                <form action={() => deleteItem(item.id)}>
                  <Button type="submit" variant="ghost" size="sm" style={{ color: 'var(--accent)' }}>
                    🗑️
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
