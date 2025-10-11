import express from "express";
import notificationController from "../controllers/notificationController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/", verifyToken, notificationController.listNotifications);
router.patch("/:id/read", verifyToken, notificationController.markAsRead);
export default router;