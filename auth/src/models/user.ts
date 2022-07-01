import mongoose from 'mongoose';

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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User };
