import Notification from "../models/notification.js";
import asyncHandler from "express-async-handler";
import { getSocketIOInstance } from "./initializeSocket.js";

const createNotification = asyncHandler(async (userId, message) => {
  const notification = new Notification({
    userId,
    message,
  });

  console.log(message, " ", userId);

  // 🔹 Send real-time notification event to the frontend
  const io = getSocketIOInstance();
  if (io && typeof io.to === "function") {
    io.to(userId.toString()).emit("new-notification", { message });
  }

  // Save the notification to the database
  await notification.save();
  return notification;
});

export default createNotification;
