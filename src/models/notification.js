import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

// optional TTL:
// notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60*60*24*30 });

export default mongoose.model("Notification", notificationSchema);
