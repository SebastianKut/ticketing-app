import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
} from '@idigitalbeatzgittix/common';
import { Order } from '../models/order';
import mongoose from 'mongoose';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.orderId)) {
      throw new BadRequestError('Correct ID type must be provided');
    }

    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
