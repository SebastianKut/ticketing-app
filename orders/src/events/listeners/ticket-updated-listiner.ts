import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from '@idigitalbeatzgittix/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data); // using findByEvent custom query that we added to the ticket model
    if (!ticket) throw new Error('Ticket not Found');
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save(); //update-if-current plugin will match the version to the version that was just send to this listener

    msg.ack();
  }
}
