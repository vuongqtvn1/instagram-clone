import app from './app';
import { connectDB } from './config/database';
import { ConfigEnvironment } from './config/env';
import { logger } from './config/logger';
import io from './config/ws';

const PORT = ConfigEnvironment.port;

const main = async () => {
  try {
    await connectDB();

    app.set('io', io);

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

main();
