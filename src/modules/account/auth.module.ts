import { Router } from 'express';

import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import rolesRouter from './routes/role.routes';

const authModule = Router();

authModule.use('/users', userRouter);
authModule.use('/admins', adminRouter);
authModule.use('/roles', rolesRouter);

export default authModule;
