import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// this is a ticket model for orders service, essentially duplication of data so the service is independent from tickets and has all the data needed for tickets inside its own database
// we only want certain properties on ticket inside our service, not all of them. There may be extra props on ticket collection in tickkets service

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attr: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// This adds method to a model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// This adds method to a document (so each individual record)
// Run query to look at all orders to find order that the ticket is the ticket we just found and the order status is not cancelled
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called isReserved on that why we use function and not => because that gives us acces to keyword this
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      //is ticket status created, awaiting or complete
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  // We want to return boolean not null or true
  // if it is null it will be flipped to true with first ! then to false with second !
  // if it is true it will be false then back to true.
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
