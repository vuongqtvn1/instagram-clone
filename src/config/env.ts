import dotenv from 'dotenv';

dotenv.config();

export const ConfigEnvironment = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || '',
  mongoDbName: process.env.MONGO_DB || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtAdminSecret: process.env.JWT_ADMIN_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  seedingPermission: process.env.SEEDING_PERMISSION === 'true',
};
