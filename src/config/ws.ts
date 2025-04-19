import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { MessageService } from '~/modules/chat/services/message.service';
import { logger } from './logger';

const onlineUsers = new Map(); // userId => socketId

const httpServer = createServer();
const io = new SocketServer(httpServer, { cors: { origin: 'http://localhost:5173' } });

io.on('connection', (socket) => {
  onlineUsers.set('67f36d0f9ffdeb1751a965f5', socket.id);

  logger.info('🔵 Người dùng kết nối:', socket.id);

  socket.on('join-group', (groupId) => {
    console.log('join-group', groupId);
    socket.join(groupId);
  });

  socket.on('send-message', async ({ groupId, message }) => {
    console.log({ groupId, message });
    io.to(groupId).emit('send-message', { groupId, message });
  });

  socket.on('send-message-ws', async ({ groupId, senderId, data }) => {
    console.log('send-message-ws', { groupId, senderId, data });
    const message = await MessageService.sendMessage(senderId, { ...data, groupId });

    io.to(groupId).emit('send-message', { groupId, message });
  });

  socket.on('typing', ({ groupId, name }) => {
    console.log({ groupId, name });
    socket.to(groupId).emit('typing', { groupId, name });
  });

  socket.on('remove-typing', ({ groupId, name }) => {
    console.log({ groupId, name });
    socket.to(groupId).emit('remove-typing', { groupId, name });
  });

  socket.on('disconnect', () => {
    logger.info('🔴 Người dùng rời khỏi:', socket.id);
  });
});

httpServer.listen(4050, () => {
  logger.info('🚀 Server Socket is running on http://localhost:4050');
});

export const sendNotifyToWS = (receivers: string[], notification: any) => {
  const socketIds: string[] = [];

  receivers.forEach((id) => {
    const socketId = onlineUsers.get(String(id));

    if (socketId) socketIds.push(socketId);
  });

  if (socketIds.length > 0) {
    io.to(socketIds).emit('new_notification', notification);
  }
};

export default io;
