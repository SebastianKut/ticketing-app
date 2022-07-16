import request from 'supertest';
import { app } from '../../app';
import { generateMongoId } from '../../test/util/generate-id';

it('returns a 404 if the ticket is not found', async () => {
  // Need to pass proper format id otherwise mongoose will throw in an error resullting status 400, not 404
  const id = generateMongoId();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('it returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
