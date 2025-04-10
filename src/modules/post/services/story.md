export const createStory = async (req: Request, res: Response) => {
  try {
    const { media, type } = req.body;

    const story = new Story({ user: req.user.id, media, type });
    await story.save();

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};


export const getStories = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    const followings = user.following; // Danh sách người dùng đã follow

    const stories = await Story.find({ user: { $in: followings }, expiresAt: { $gt: new Date() } })
      .populate("user", "username avatar");

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};


export const viewStory = async (req: Request, res: Response) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story không tồn tại" });

    if (!story.viewers.includes(req.user.id)) {
      story.viewers.push(req.user.id);
      await story.save();
    }

    res.status(200).json({ message: "Story đã xem!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};


import cron from "node-cron";
import { Story } from "../models/Story";

// Chạy mỗi 1 tiếng để xóa story đã hết hạn
cron.schedule("0 * * * *", async () => {
  console.log("🕒 Kiểm tra và xóa story hết hạn...");
  await Story.deleteMany({ expiresAt: { $lte: new Date() } });
});


import { io } from "../websocket";

export const createStory = async (req: Request, res: Response) => {
  try {
    const { media, type } = req.body;

    const story = new Story({ user: req.user.id, media, type });
    await story.save();

    io.emit("newStory", story); // Thông báo realtime
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};