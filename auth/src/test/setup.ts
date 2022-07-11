import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

// declaration of the global.signin that we are adding to use in tests
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// Specify what to do in beforeAll hook - runs before all of our tests

beforeAll(async () => {
  // we need to specify JWT secret key because this only exists inside of our conteiner and not in the test environment
  process.env.JWT_KEY = 'asdfhh';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// beforeEach runs before each of our tests
// Delete all collections from our in memory instance of mongoDb
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after all test close in memory mongo connection
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Global signin property (function), for convinience so we dnt have to export it all the time
// this will only be available in the test environment not in our express app and used inside tests
// to sign up and return cookie

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
