import express from "express";
import reviewController from "../controllers/reviewController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, reviewController.createReview);
router.get("/trip/:tripId", reviewController.listReviews);
export default router;