import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@idigitalbeatzgittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
}
