import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TickedCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly prevents property from being changed
  readonly subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated;
  queueGroupName = 'orders-service-queue-group';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // this will be the logic of how we want to process received image
    console.log('Event data', data);

    msg.ack();
  }
}
