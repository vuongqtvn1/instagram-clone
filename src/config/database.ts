import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/config/logger';
import { ConfigEnvironment } from './env';
import { RoleRepository } from '~/modules/auth/repositories/role.repository';

dotenv.config();

const MONGO_URI = `${ConfigEnvironment.mongoUri}/${ConfigEnvironment.mongoDbName}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await RoleRepository.seedingDB();
    logger.info('✅ MongoDB Connected');
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
