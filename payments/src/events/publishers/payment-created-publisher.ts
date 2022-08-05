import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@idigitalbeatzgittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
}
