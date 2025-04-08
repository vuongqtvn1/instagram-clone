import { Router } from 'express';

import authModule from './account/auth.module';
import postModule from './post/post.module';
import uploadModule from './upload/upload.module';

const modules = Router();

modules.use('/', authModule);
modules.use('/', postModule);
modules.use('/', uploadModule);

export default modules;
