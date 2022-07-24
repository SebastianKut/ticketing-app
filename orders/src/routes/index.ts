import express, { Request, Response } from 'express';
import { requireAuth } from '@idigitalbeatzgittix/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // populate method fetches all documents from Tickets collection associated with our Order query
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };
