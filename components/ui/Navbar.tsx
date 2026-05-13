'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

interface NavbarProps {
  user?: { id: string; name: string; email: string } | null;
}

const navLinks = [
  { href: '/map', label: 'Map', icon: '🗺️' },
  { href: '/feed', label: 'Feed', icon: '📰' },
  { href: '/report', label: 'Report', icon: '📌' },
  { href: '/my-posts', label: 'My Posts', icon: '📋' },
];

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '12px 24px',
        boxShadow: '0 4px 12px rgba(201, 191, 182, 0.5)',
        background: 'var(--bg-base)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <span
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: '2px 2px 6px rgba(192,57,43,0.35), -2px -2px 6px rgba(255,120,100,0.15)',
            }}
          >
            📍
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Lost<span style={{ color: 'var(--accent)' }}>&amp;</span>Found
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'neu-pressed' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'var(--bg-base)' : 'transparent',
                }}
              >
                <span style={{ fontSize: '0.938rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 8px' }} />

          {user ? (
            /* Logged-in state */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="neu-pressed"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {initials}
              </div>
              <form action={logout}>
                <button type="submit" className="neu-button neu-button--sm neu-button--ghost">
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            /* Logged-out state */
            <>
              <Link href="/login" className="neu-button neu-button--sm">Log In</Link>
              <Link href="/signup" className="neu-button neu-button--accent neu-button--sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="neu-button neu-button--ghost md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ padding: '8px 12px', fontSize: '1.25rem' }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden animate-fade-in" style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={isActive ? 'neu-pressed' : 'neu-flat'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.938rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
            {user ? (
              <form action={logout} style={{ flex: 1 }}>
                <button type="submit" className="neu-button neu-button--sm" style={{ width: '100%' }}>
                  Log Out ({user.name.split(' ')[0]})
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="neu-button neu-button--sm" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>Log In</Link>
                <Link href="/signup" className="neu-button neu-button--accent neu-button--sm" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
