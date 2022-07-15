import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandeler,
  NotFoundError,
} from '@idigitalbeatzgittix/common';
import { createTicketRouter } from './routes/new';

const app = express();
// tell express to trust nginx proxy that we use for https connections
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // signed means encrypted cookie data, we dnt want that as its hard to decrypt data between different ;anguages incase we build other microservices using different languages, and JWT that will be used inside the cookie is safe already and encrypted
    signed: false,
    // cookie is only to be sent over HTTPS unless testing environment
    secure: process.env.NODE_ENV !== 'test',

    // to test app through http we can uncomment
    // secure: false,
  })
);

// check every incoming request if user is logged in, always after use(cookieSession) as it checks cookie for jwt
// then every route we want user to be authenticated we just add requireAuth middleware to that specific route
app.use(currentUser);

app.use(createTicketRouter);

app.all('/*', async () => {
  throw new NotFoundError();
});

app.use(errorHandeler);

export { app };
