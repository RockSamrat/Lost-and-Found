import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/authenticate.js';
import { sendMatchNotification } from '../lib/email.js';

const router = Router();

const ItemSchema = z.object({
  type:         z.enum(['LOST', 'FOUND']),
  title:        z.string().min(3, 'Title must be at least 3 characters').max(100),
  description:  z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category:     z.enum(['Electronics', 'Keys', 'Wallet', 'Pet', 'Bag', 'Documents', 'Other']),
  latitude:     z.number().min(-90).max(90),
  longitude:    z.number().min(-180).max(180),
  locationName: z.string().optional(),
  date:         z.string().transform((s) => new Date(s)),
});

function serializeItem(item: Record<string, unknown> & { date: Date; createdAt: Date }) {
  return { ...item, date: item.date.toISOString(), createdAt: item.createdAt.toISOString() };
}

// GET /items — public
router.get('/', async (_req, res: Response) => {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, type: true, title: true, description: true, category: true,
      latitude: true, longitude: true, locationName: true, date: true,
      resolved: true, createdAt: true,
      user: { select: { name: true } },
    },
  });

  res.json(items.map((i) => ({ ...serializeItem(i), userName: i.user.name })));
});

// GET /items/mine — authenticated
router.get('/mine', authenticate, async (req: AuthRequest, res: Response) => {
  const items = await prisma.item.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, type: true, title: true, description: true, category: true,
      latitude: true, longitude: true, locationName: true, date: true,
      resolved: true, createdAt: true,
    },
  });

  res.json(items.map(serializeItem));
});

// POST /items — authenticated, triggers email on FOUND
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data;
  const founder = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { name: true, email: true },
  });
  if (!founder) { res.status(401).json({ message: 'User not found' }); return; }

  const item = await prisma.item.create({
    data: { ...data, userId: req.userId! },
  });

  // Fire-and-forget: notify LOST item owners when a matching FOUND report is posted
  if (data.type === 'FOUND') {
    notifyLostOwners({
      category:     data.category,
      foundTitle:   data.title,
      locationName: data.locationName,
      founderName:  founder.name,
      founderEmail: founder.email,
    }).catch((err) => console.error('[email] notification failed:', err));
  }

  res.status(201).json(serializeItem(item));
});

// PATCH /items/:id/resolve — authenticated, owner only
router.patch('/:id/resolve', authenticate, async (req: AuthRequest, res: Response) => {
  const existing = await prisma.item.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!existing) { res.status(404).json({ message: 'Item not found' }); return; }

  const updated = await prisma.item.update({
    where: { id: req.params.id },
    data: { resolved: !existing.resolved },
  });

  res.json(serializeItem(updated));
});

// DELETE /items/:id — authenticated, owner only
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const deleted = await prisma.item.deleteMany({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (deleted.count === 0) { res.status(404).json({ message: 'Item not found' }); return; }

  res.status(204).send();
});

async function notifyLostOwners(params: {
  category: string;
  foundTitle: string;
  locationName?: string;
  founderName: string;
  founderEmail: string;
}) {
  const lostItems = await prisma.item.findMany({
    where: { type: 'LOST', category: params.category, resolved: false },
    select: { title: true, user: { select: { name: true, email: true } } },
  });

  await Promise.allSettled(
    lostItems.map((lost) =>
      sendMatchNotification({
        to:             lost.user.email,
        ownerName:      lost.user.name,
        foundItemTitle: params.foundTitle,
        foundCategory:  params.category,
        founderName:    params.founderName,
        founderEmail:   params.founderEmail,
        locationName:   params.locationName,
      })
    )
  );
}

export default router;
