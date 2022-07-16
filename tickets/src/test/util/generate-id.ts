import mongoose from 'mongoose';

const generateMongoId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

export { generateMongoId };
