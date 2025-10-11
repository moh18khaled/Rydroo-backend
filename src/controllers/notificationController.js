import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const rows = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  res.json({ data: rows });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "ok" });
});

export default { listNotifications, markAsRead };