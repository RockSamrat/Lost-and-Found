'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toggleResolved, deleteItem } from '@/app/actions/items';
import { Inbox, Folder, MapPin, Calendar, Check, RotateCcw, Trash2 } from 'lucide-react';

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
    if (tab === 'All')      return true;
    if (tab === 'Resolved') return i.resolved;
    return i.type === tab.toUpperCase() && !i.resolved;
  });

  return (
    <section style={{ padding: '32px 24px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          My Posts
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', margin: 0 }}>
          Manage your lost and found reports
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            style={{
              padding: '7px 18px', borderRadius: 'var(--radius-full)',
              fontSize: '0.813rem', fontWeight: tab === t ? 700 : 500,
              color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
              border: tab === t ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background: tab === t ? 'var(--bg-sunken)' : 'var(--bg-raised)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="animate-fade-in-up" style={{ textAlign: 'center', padding: '56px 32px' }}>
          <Inbox size={40} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            No Posts Yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 20px' }}>
            {tab === 'All'
              ? "You haven't reported any items yet."
              : `No ${tab.toLowerCase()} items to show.`}
          </p>
          <a href="/report" className="neu-button neu-button--accent">Start a report</a>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards', opacity: item.resolved ? 0.7 : 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Badge variant={item.resolved ? 'resolved' : item.type === 'LOST' ? 'lost' : 'found'}>
                  {item.resolved ? 'Resolved' : item.type === 'LOST' ? 'Lost' : 'Found'}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Folder size={12} /> {item.category}</span>
                {item.locationName && <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} /> {item.locationName}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <form action={() => toggleResolved(item.id)} style={{ flex: 1 }}>
                  <Button type="submit" variant={item.resolved ? 'default' : 'accent'} size="sm" style={{ width: '100%', gap: '6px' }}>
                    {item.resolved ? <><RotateCcw size={13} /> Unresolve</> : <><Check size={13} /> Resolve</>}
                  </Button>
                </form>
                <form action={() => deleteItem(item.id)}>
                  <Button type="submit" variant="ghost" size="sm" style={{ color: 'var(--accent)', padding: '7px 12px' }} aria-label="Delete">
                    <Trash2 size={14} />
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
