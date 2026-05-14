'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import {
  SignupFormSchema,
  LoginFormSchema,
  type SignupFormState,
  type LoginFormState,
} from '@/lib/definitions';

const API = process.env.API_URL;

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validated = SignupFormSchema.safeParse({
    name:     formData.get('name'),
    email:    formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const res = await fetch(`${API}/auth/signup`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(validated.data),
  });

  const body = await res.json();

  if (!res.ok) {
    if (body.errors) return { errors: body.errors };
    return { message: body.message ?? 'Signup failed. Please try again.' };
  }

  await createSession(body.token, new Date(body.expiresAt));
  redirect('/map');
}

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validated = LoginFormSchema.safeParse({
    email:    formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const res = await fetch(`${API}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(validated.data),
  });

  const body = await res.json();

  if (!res.ok) {
    return { message: body.message ?? 'Invalid email or password.' };
  }

  await createSession(body.token, new Date(body.expiresAt));
  redirect('/map');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}
