import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
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
    // cookie is only to be sent over HTTPS unless testing environment
    secure: process.env.NODE_ENV !== 'test',

    // to test app through http we can uncomment
    // secure: false,
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

export { app };
