import mongoose from 'mongoose';

import { MONGO_DB_URI } from '../config/env.js';

export const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log('✅ Successfully Connected to MongoDB Atlas');
  } catch (error) {
    console.log('❌ Error Connecting to MongoDB Atlas', error);
    process.exit(1);
  }
};
