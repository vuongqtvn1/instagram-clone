import { Router } from 'express';

import authModule from './auth/auth.module';

const modules = Router();

modules.use('/', authModule);

export default modules;
