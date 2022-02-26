import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://mongodb:27017/dev');
    console.log('Mongoose connected');
  } catch (err) {
    console.log('Failed to connect to db', err);
  }
};
