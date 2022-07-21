import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@idigitalbeatzgittix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
}
