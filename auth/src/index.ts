import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandeler } from './middlewares/error-handeler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// tell express to trust nginx proxy that we use for https connections
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // signed means encrypted cookie data, we dnt want that as its hard to decrypt data between different ;anguages incase we build other microservices using different languages, and JWT that will be used inside the cookie is safe already and encrypted
    signed: false,
    // cookie is only to be sent over HTTPS
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('/*', async () => {
  throw new NotFoundError();
});

app.use(errorHandeler);

const start = async () => {
  try {
    // auth in the url string is the name of the mongodb database if we dnt have it mongoose we will create one with that name
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
