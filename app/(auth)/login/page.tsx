'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        className="neu-card animate-fade-in-up"
        style={{ maxWidth: '420px', width: '100%', padding: '40px 32px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            className="neu-pressed"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '16px',
            }}
          >
            👋
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Log in to your account to continue
          </p>
        </div>

        {/* Global error */}
        {state?.message && (
          <div
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.813rem',
              fontWeight: 500,
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {state.message}
          </div>
        )}

        {/* Form */}
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            error={state?.errors?.email?.[0]}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            error={state?.errors?.password?.[0]}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />
          <Button type="submit" variant="accent" size="lg" loading={pending} style={{ width: '100%', marginTop: '8px' }}>
            Log In
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
