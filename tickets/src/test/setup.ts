import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { generateMongoId } from './util/generate-id';

// declaration of the global.signin that we are adding to use in tests
declare global {
  var signin: () => string[];
}

// instead of creating real instance of nats client in the test we will create a fake instance
// by putting file with the same name as the one we are trying to fake in __mocks__ directory
// then giving realtive path to the real file to jest.mock()
jest.mock('../nats-wrapper');

let mongo: any;
// Specify what to do in beforeAll hook - runs before all of our tests

beforeAll(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  // We dnt want to make a request to auth service to log in as tickets service should be self contained
  // so we will fake a cookie for tests - this is how auth middleware check if we are authenticated
  // Build JWT payload {id, email}
  const payload = {
    id: generateMongoId(),
    email: 'test@test.com',
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as BASE64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return the string that looks like cookie - supertest requires cookies to be an array
  return [`session=${base64}`];
};
