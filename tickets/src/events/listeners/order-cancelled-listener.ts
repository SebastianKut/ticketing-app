import { Listener, Subjects } from '@idigitalbeatzgittix/common';
import { OrderCancelledEvent } from '@idigitalbeatzgittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-gropu-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw err
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // we use undefined not null because option checks ? that we use in the code dnt work well with null in typescript
    ticket.set({ orderId: undefined });

    // save ticket
    await ticket.save();

    // emit ticket updated event - we are passing the client that Listener is already using so we dnt have to import it seperately - it makes testing easier
    // if we dnt put await here before ack we assuming that it will be executed successfully
    // here is probably required to not ack and throw an error if something goes wrong
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message - acknowledges that event was consumed properly. Until its called NATS will keep sending event at a specific time interval
    msg.ack();
  }
}
