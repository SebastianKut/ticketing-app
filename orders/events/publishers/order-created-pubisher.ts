import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@idigitalbeatzgittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
}
