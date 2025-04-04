import { Router } from 'express';

import authRoutes from './routes/auth.routes';

const authModule = Router();

authModule.use('/auth', authRoutes);

export default authModule;
