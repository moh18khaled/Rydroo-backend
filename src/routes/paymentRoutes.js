import express from "express";
import paymentController from "../controllers/paymentController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/charge", verifyToken, paymentController.createPaymentIntent);
router.post("/webhook", paymentController.webhookHandler); // use raw body in server.js for this route
export default router;