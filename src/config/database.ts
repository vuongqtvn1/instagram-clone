import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/config/logger';
import { ConfigEnvironment } from './env';

dotenv.config();

const MONGO_URI = `${ConfigEnvironment.mongoUri}/${ConfigEnvironment.mongoDbName}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB Connected');
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
