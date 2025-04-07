import { Router } from 'express';

import authModule from './account/auth.module';
import postModule from './post/post.module';

const modules = Router();

modules.use('/', authModule);
modules.use('/', postModule);

export default modules;
