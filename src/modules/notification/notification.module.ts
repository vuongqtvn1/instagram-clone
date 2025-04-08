import { Router } from 'express';

import postRouter from './routes/post.routes';
import commentRouter from './routes/comment.routes';

const postModule = Router();

postModule.use('/posts', postRouter);
postModule.use('/comments', commentRouter);

export default postModule;
