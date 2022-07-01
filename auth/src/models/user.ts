import mongoose from 'mongoose';
import { Password } from '../utilities/password';

// Properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// Properties that User Model (collection) will require
// <UserDoc> is essentialy like arguments that are passed to the function but instead we are passing a type of UserDoc.
// Generics <> essentially allow us to customise types inside of a class, a function or an interface
interface UserModel extends mongoose.Model<UserDoc> {
  // build property will return instance of UserDoc (another words single user)
  build(attrs: UserAttrs): UserDoc;
}

// Properties that User Document (or a single user record in the database) will require

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
// This is middleware that mongoose has that we can call before saving to database
// done() works similar to next() in express, you have to call it in the callback function of this pre hook from mongoose to mark end of aynchronous operation
userSchema.pre('save', async function (done) {
  // Hashing password before saving to DB. isModified returns true to any new password as well. We dnt want to hash already hashed password
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User };
