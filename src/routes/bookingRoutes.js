import express from "express";
import bookingController from "../controllers/bookingController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, bookingController.createBooking);
router.get("/:id", verifyToken, bookingController.getBooking);
export default router;