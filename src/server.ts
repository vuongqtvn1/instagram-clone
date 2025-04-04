import app from './app';
import { ConfigEnvironment } from './config/env';
import { logger } from './config/logger';

const PORT = ConfigEnvironment.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
