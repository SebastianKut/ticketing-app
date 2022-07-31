import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number; // adding version so we can acces like ticket.version without typescript throwing an error, because we change it from __v
  orderId?: string; // this is an optional property as orderId will not exist until there is an order for a ticket
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

// change "__v" property to "version" in mongo database
ticketSchema.set('versionKey', 'version');

// hooking up module that will take care of updating version of records in tickets collection everytime ticket is updated
// This is to solve concurency issues when ticket update is emited to other services that may otherwise update their ticket database in different order
// with version property on a ticket record we can update data in other services in the correct way and order
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
