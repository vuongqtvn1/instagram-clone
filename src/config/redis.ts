/* eslint-disable import/no-extraneous-dependencies */
import { Server } from 'socket.io';
import Redis from 'ioredis';

import { logger } from './logger';

const redisClient = new Redis();
const io = new Server({ cors: { origin: '*' } });

const onlineUsers = new Map();

io.on('connection', (socket) => {
  logger.info('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    redisClient.set(`user:${userId}:online`, 'true', 'EX', 60 * 5);
  });

  socket.on('disconnect', () => {
    const userId = [...onlineUsers.keys()].find((key) => onlineUsers.get(key) === socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      redisClient.del(`user:${userId}:online`);
    }
    logger.info('User disconnected:', socket.id);
  });
});

export { io, onlineUsers };
