import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@idigitalbeatzgittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
}
