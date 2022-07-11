import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // make sure we have JWT enviorment variable set
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
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
