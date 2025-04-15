import { Router } from 'express';

import messageRoutes from './routes/message.routes';
import groupRoutes from './routes/group.routes';

const chatModule = Router();

chatModule.use('/groups', groupRoutes);
chatModule.use('/messages', messageRoutes);

export default chatModule;
