'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const ItemSchema = z.object({
  type: z.enum(['LOST', 'FOUND']),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.enum(['Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationName: z.string().optional(),
  date: z.string().transform((s) => new Date(s)),
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
  const session = await getSession();
  if (!session?.userId) {
    return { message: 'You must be logged in to report an item.' };
  }

  const raw = {
    type: formData.get('type'),
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
    locationName: formData.get('locationName') || undefined,
    date: formData.get('date'),
  };

  const validated = ItemSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await prisma.item.create({
    data: {
      ...validated.data,
      userId: session.userId,
    },
  });

  revalidatePath('/map');
  return { success: true };
}

export async function getItems(filter?: { type?: string }) {
  const where: Record<string, unknown> = {};
  if (filter?.type && filter.type !== 'ALL') {
    where.type = filter.type;
  }

  const items = await prisma.item.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      category: true,
      latitude: true,
      longitude: true,
      locationName: true,
      date: true,
      resolved: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  return items.map((item) => ({
    ...item,
    date: item.date.toISOString(),
    createdAt: item.createdAt.toISOString(),
    userName: item.user.name,
  }));
}

export async function getUserItems() {
  const session = await getSession();
  if (!session?.userId) return [];

  const items = await prisma.item.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      category: true,
      latitude: true,
      longitude: true,
      locationName: true,
      date: true,
      resolved: true,
      createdAt: true,
    },
  });

  return items.map((item) => ({
    ...item,
    date: item.date.toISOString(),
    createdAt: item.createdAt.toISOString(),
  }));
}

export async function toggleResolved(itemId: string) {
  const session = await getSession();
  if (!session?.userId) return;

  const item = await prisma.item.findFirst({
    where: { id: itemId, userId: session.userId },
  });
  if (!item) return;

  await prisma.item.update({
    where: { id: itemId },
    data: { resolved: !item.resolved },
  });

  revalidatePath('/map');
  revalidatePath('/my-posts');
}

export async function deleteItem(itemId: string) {
  const session = await getSession();
  if (!session?.userId) return;

  await prisma.item.deleteMany({
    where: { id: itemId, userId: session.userId },
  });

  revalidatePath('/map');
  revalidatePath('/my-posts');
}
