import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // optimistic concurrency control is basically versioning updates to the records in databases
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'cconcert',
    price: 5,
    userId: '123',
  });
  // save ticket to database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make 2 seperate changes to the tickets fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first fetched ticked
  await firstInstance!.save();
  // save the second fetched ticked and expect an error cuz outdated version
  try {
    await secondInstance!.save();
  } catch (error) {
    // we should reach this point and return as secondInsatnce.save()will throw an error due to version number 0, where the record version is 1 becasue updated by firstnstance
    return;
  }

  throw new Error('Should not reach this point');
});
