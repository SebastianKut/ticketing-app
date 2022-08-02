import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@idigitalbeatzgittix/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Bull will use redis (in memory db) to process queue (job) to it, after specified time of for example 15 minutes redis will send back the queue(job)
    // back to bull, that is on our expiration server to process then we can listen for it and publish event of order expired
    // bull is essentially doing the work of notifing us after 15 minutes that the order has expired
    await expirationQueue.add({
      orderId: data.id,
    });
    msg.ack();
  }
}
