import express from "express";
import asyncHandler from "express-async-handler";
import userController from "../controllers/userController.js";
import validateRequiredFields from "../middlewares/validateRequiredFields.js";
import verifyToken from "../middlewares/verifyToken.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequiredFields("user"),
  asyncHandler(userController.signup)
);
router.post(
  "/login",
  optionalAuth, // If the user is already logged in add add his id
  asyncHandler(userController.login)
);

router.post("/logout", verifyToken, asyncHandler(userController.logout));

router.post("/resend-otp", validateRequiredFields("resendOtp"), asyncHandler(userController.resendOtp));

router.post("/verify-otp", asyncHandler(userController.verifyOtp));

router
  .route("/account")
  .get(verifyToken, asyncHandler(userController.getUserAccount))
  .patch(verifyToken, asyncHandler(userController.updateAccount))
  .delete(verifyToken, asyncHandler(userController.deleteAccount));

router.patch(
  "/account/password",
  verifyToken,
  asyncHandler(userController.changePassword)
);

router.post(
  "/reset-password",
  asyncHandler(userController.requestPasswordReset)
);
router.post(
  "/reset-password/confirm",
  asyncHandler(userController.confirmPasswordReset)
);

router.post(
  "/contact",
  validateRequiredFields("emailContent"),
  asyncHandler(userController.contactSupport)
);

// Get all notifications
router.get(
  "/notifications",
  verifyToken,
  asyncHandler(userController.getNotifications)
);

router.patch(
  "/notifications/:notificationId",
  verifyToken,
  asyncHandler(userController.markAsRead)
);


export default router;