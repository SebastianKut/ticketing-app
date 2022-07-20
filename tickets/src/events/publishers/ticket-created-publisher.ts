import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@idigitalbeatzgittix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated;
}
