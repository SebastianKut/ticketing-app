import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // const signupResponse = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email: 'test@test.com',
  //     password: 'password',
  //   })
  //   .expect(201);

  // const cookie = signupResponse.get('Set-Cookie');

  // Insted of the above we can use our global fucntion declared in setup.ts to signup and get cookie

  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  // browser and postman automatically manage cookies and sends them with any folloup request, but supertest doesnt
  // thats why by defaut in response.body we get currentUser: null
  // We have to set up cookies manually

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  // not sending cookie this time
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
