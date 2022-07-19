// lists out all the valid NATS channels (subjects that we will use)
// this will save loads of typos
export enum Subjects {
  TicketCreated = 'ticked:created',
  OrderUpdated = 'order:updated',
}
