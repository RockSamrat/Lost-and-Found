'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import {
  SignupFormSchema,
  LoginFormSchema,
  type SignupFormState,
  type LoginFormState,
} from '@/lib/definitions';

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  // 1. Validate
  const validated = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password } = validated.data;

  // 2. Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: 'An account with this email already exists.' };
  }

  // 3. Hash password & create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  // 4. Create session & redirect
  await createSession(user.id);
  redirect('/map');
}

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // 1. Validate
  const validated = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  // 2. Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: 'Invalid email or password.' };
  }

  // 3. Compare password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { message: 'Invalid email or password.' };
  }

  // 4. Create session & redirect
  await createSession(user.id);
  redirect('/map');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}
