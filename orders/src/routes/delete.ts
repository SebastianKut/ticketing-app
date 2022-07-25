import express, { Request, Response } from 'express';
import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
} from '@idigitalbeatzgittix/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    // publishing an event that order was cancelled

    // when you send status 204 then it sends empty object anyway as it means "no content"
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
