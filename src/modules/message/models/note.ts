// export const createChat = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;
//     const existingChat = await Chat.findOne({ members: { $all: [req.user.id, userId] } });

//     if (existingChat) return res.status(200).json(existingChat);

//     const newChat = new Chat({ members: [req.user.id, userId] });
//     await newChat.save();

//     res.status(201).json(newChat);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi server!' });
//   }
// };

// export const getUserChats = async (req: Request, res: Response) => {
//   try {
//     const chats = await Chat.find({ members: req.user.id })
//       .populate("members", "username avatar")
//       .populate("lastMessage");

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server!" });
//   }
// };

// import { io } from "../websocket";

// export const sendMessage = async (req: Request, res: Response) => {
//   try {
//     const { chatId, text, image } = req.body;

//     const message = new Message({ chatId, sender: req.user.id, text, image });
//     await message.save();

//     await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

//     io.to(chatId).emit("newMessage", message); // Gửi tin nhắn đến chatId

//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server!" });
//   }
// };

// import { Server } from "socket.io";
// import { createServer } from "http";
// import app from "./app";

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: { origin: "*" },
// });

// io.on("connection", (socket) => {
//   console.log("🔵 Người dùng kết nối:", socket.id);

//   socket.on("joinChat", (chatId) => {
//     socket.join(chatId);
//   });

//   socket.on("sendMessage", async ({ chatId, sender, text }) => {
//     const message = new Message({ chatId, sender, text });
//     await message.save();

//     await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

//     io.to(chatId).emit("newMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Người dùng rời khỏi:", socket.id);
//   });
// });

// httpServer.listen(5000, () => console.log("Server chạy trên cổng 5000"));

// io.on("connection", (socket) => {
//   const userId = socket.handshake.auth.userId;
//   if (!userId) return;

//   redisClient.set(`online_${userId}`, "true");

//   socket.on("disconnect", async () => {
//     await redisClient.del(`online_${userId}`);
//   });
// });
