import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@idigitalbeatzgittix/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error('Order not found');

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // Should probably for good practice publish event of order updated for versioning purposes

    msg.ack();
  }
}
