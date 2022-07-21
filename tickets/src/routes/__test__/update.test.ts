import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { generateMongoId } from '../../test/util/generate-id';

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title1',
      price: 10,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  // global.sigin() generates different userId everytime is invoked so to keep it for diifferent requests
  // assign to variable
  const userCookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'title1',
      price: -1,
    })
    .expect(400);
});

it('updates the ticket provided valid input ', async () => {
  const userCookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'new title',
      price: 30,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(30);
});

it('publishes an event', async () => {
  const userCookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'new title',
      price: 30,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
