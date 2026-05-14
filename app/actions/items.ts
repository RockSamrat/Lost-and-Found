'use server';

import { getSession, getSessionToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const API = process.env.API_URL;

const ItemSchema = z.object({
  type:         z.enum(['LOST', 'FOUND']),
  title:        z.string().min(3, 'Title must be at least 3 characters').max(100),
  description:  z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category:     z.enum(['Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other']),
  latitude:     z.number().min(-90).max(90),
  longitude:    z.number().min(-180).max(180),
  locationName: z.string().optional(),
  date:         z.string(),
});

export type ItemFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
} | undefined;

export async function createItem(
  state: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  const token = await getSessionToken();
  if (!token) return { message: 'You must be logged in to report an item.' };

  const raw = {
    type:         formData.get('type'),
    title:        formData.get('title'),
    description:  formData.get('description'),
    category:     formData.get('category'),
    latitude:     Number(formData.get('latitude')),
    longitude:    Number(formData.get('longitude')),
    locationName: formData.get('locationName') || undefined,
    date:         formData.get('date'),
  };

  const validated = ItemSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const res = await fetch(`${API}/items`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      Authorization:   `Bearer ${token}`,
    },
    body: JSON.stringify(validated.data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (body.errors) return { errors: body.errors };
    return { message: body.message ?? 'Failed to create item. Please try again.' };
  }

  revalidatePath('/feed');
  revalidatePath('/map');
  return { success: true };
}

export async function getItems() {
  const res = await fetch(`${API}/items`, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getUserItems() {
  const token = await getSessionToken();
  if (!token) return [];

  const res = await fetch(`${API}/items/mine`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function toggleResolved(itemId: string) {
  const token = await getSessionToken();
  if (!token) return;

  await fetch(`${API}/items/${itemId}/resolve`, {
    method:  'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath('/feed');
  revalidatePath('/map');
  revalidatePath('/my-posts');
}

export async function deleteItem(itemId: string) {
  const token = await getSessionToken();
  if (!token) return;

  await fetch(`${API}/items/${itemId}`, {
    method:  'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath('/feed');
  revalidatePath('/map');
  revalidatePath('/my-posts');
}
