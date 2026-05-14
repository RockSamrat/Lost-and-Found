'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { MapPin, Map, Newspaper, ClipboardList, Menu, X } from 'lucide-react';

interface NavbarProps {
  user?: { id: string; name: string; email: string } | null;
}

const navLinks = [
  { href: '/map',      label: 'Map',      Icon: Map },
  { href: '/feed',     label: 'Feed',     Icon: Newspaper },
  { href: '/report',   label: 'Report',   Icon: MapPin },
  { href: '/my-posts', label: 'My Posts', Icon: ClipboardList },
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
        background: 'var(--bg-raised)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <span
            style={{
              width: '34px', height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <MapPin size={17} color="#fff" />
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.063rem', letterSpacing: '-0.01em' }}>
            Lost<span style={{ color: 'var(--accent)' }}>&amp;</span>Found
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
          {navLinks.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-sunken)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }} />
          {user ? (
            <>
              <div
                className="neu-pressed"
                title={user.name}
                style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.688rem', fontWeight: 700, color: 'var(--accent)', cursor: 'default' }}
              >
                {initials}
              </div>
              <form action={logout}>
                <button type="submit" className="neu-button neu-button--sm neu-button--ghost">Log Out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login"  className="neu-button neu-button--sm">Log In</Link>
              <Link href="/signup" className="neu-button neu-button--accent neu-button--sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — hidden on md+ via wrapper div to avoid .neu-button display:inline-flex specificity conflict */}
        <div className="md:hidden">
          <button
            className="neu-button neu-button--ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{ padding: '7px 10px' }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden animate-fade-in" style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.938rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                  background: isActive ? 'var(--bg-sunken)' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', marginTop: '6px' }}>
            {user ? (
              <form action={logout} style={{ flex: 1 }}>
                <button type="submit" className="neu-button neu-button--sm" style={{ width: '100%' }}>
                  Log Out ({user.name.split(' ')[0]})
                </button>
              </form>
            ) : (
              <>
                <Link href="/login"  className="neu-button neu-button--sm" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>Log In</Link>
                <Link href="/signup" className="neu-button neu-button--accent neu-button--sm" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
