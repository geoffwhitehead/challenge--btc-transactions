import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config';

export const connect = async () => {
  if (process.env.NODE_ENV === 'test') {
    const instance = await MongoMemoryServer.create();
    (global as any).__MONGOINSTANCE = instance;
    const uri = instance.getUri();
    process.env.MONGO_URI = uri;
  } else {
    process.env.MONGO_URI = config.mongoUri;
  }

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Mongoose connected to ', process.env.MONGO_URI);
    })
    .catch((err) => {
      console.log(
        `Failed to connect to db connection to ${process.env.MONGO_URI} `,
        err
      );
    });

  await mongoose.connection.db.dropDatabase();
};
