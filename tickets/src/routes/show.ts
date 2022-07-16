import { NotFoundError } from '@idigitalbeatzgittix/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }
  // sends status 200 automatically
  res.send(ticket);
});

export { router as showTicketRouter };
