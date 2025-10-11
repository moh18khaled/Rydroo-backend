import User from "../models/user.js";
import Notification from "../models/notification.js";
import mongoose from "mongoose";
import validator from "validator";
import cloudinaryDelete from "../utils/cloudinaryDelete.js";
import sendEmail from "../utils/sendEmail.js";
import verifyJWT from "../utils/verifyJWT.js";
import sendError from "../utils/sendError.js";
import generateAndSetTokens from "../utils/generateAndSetTokens.js";
import clearCookies from "../utils/clearCookies.js";
import validateUser from "../utils/validateUser.js";
import  { sendOtpToEmail, otpStore, resendMeta, RESEND_COOLDOWN_MS, RESEND_MAX_PER_HOUR } from "../utils/sendOtp.js";
import singleDeviceLogout from "../utils/singleDeviceLogout.js";
import createNotification from "../utils/createNotification.js";


// User signup
const signup = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = req.body;

  const emailLower = email?.toLowerCase();

  const oldUser = await User.findOne({ email: emailLower });

  if (oldUser)
    return next(sendError(409, "userExists"));

  // Local signup
  const user = new User({
    firstName,
    lastName,
    email: emailLower,
    password,
  });

  await user.save();
  // Send OTP verification email to the user
  await sendOtpToEmail(emailLower);

  return res.status(201).json({
    message: "User registered! Please verify your email.",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

// User logout
const logout = async (req, res, next) => {
  const user = await validateUser(req, next);

  const refreshToken = req.cookies.refresh_token;

  // Remove the refresh tokens from the user's array
  await singleDeviceLogout(refreshToken, user);

  // Clear authentication cookies
  clearCookies(res);

  return res.status(200).json({
    message: "Successfully logged out",
  });
};


const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) return next(sendError(400, "missingFields"));

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid — remove it and mark the user verified (by email)
    otpStore.delete(email);

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    return res.json({ message: "OTP verified successfully" });
};

// Resend OTP endpoint (POST /user/resend-otp)
const resendOtp = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const emailLower = email.toLowerCase();
    const now = Date.now();

    const meta = resendMeta.get(emailLower) || { lastSent: 0, count: 0, windowStart: now };

    // Cooldown check
    if (now - meta.lastSent < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - meta.lastSent)) / 1000);
      return res.status(429).json({ message: `Please wait ${wait}s before requesting another OTP.` });
    }

    // Window reset (1 hour)
    if (now - meta.windowStart > 60 * 60 * 1000) {
      meta.count = 0;
      meta.windowStart = now;
    }

    if (meta.count >= RESEND_MAX_PER_HOUR) {
      return res.status(429).json({ message: "Too many resend attempts. Try again later." });
    }

    // Send OTP and update metadata
    await sendOtpToEmail(emailLower);
    meta.lastSent = now;
    meta.count = (meta.count || 0) + 1;
    resendMeta.set(emailLower, meta);

    // Generic response (avoid revealing whether the email exists)
    return res.json({ message: "If an account exists, an OTP has been sent." });
};

// User login
const login = async (req, res, next) => {
  const userId = req.user?.id;

  if (userId) {
    return res.status(200).json({
      message: "User is already logged in.",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) return next(sendError(400, "missingFields"));

  const user = await User.findOne({ email });

  if (!user) return next(sendError(404, "user"));

  // Compare the password with the hashed password in the database
  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(sendError(401, "Invalidcardinalities"));

  if (!user.isVerified) return next(sendError(403, "verifyEmail"));

  // Generate and set tokens
  await generateAndSetTokens(user, res);

  return res.status(200).json({
    message: "User successfully logged In",
    data: {
      user: {
        firstName: user.firstName,
        lastName:user.lastName,
        email: user.email,
        id: user._id,
      },
    },
  });
};

// Notifications section
const getNotifications = async (req, res, next) => {
  const user = await validateUser(req, next);

  // Find notifications for the user
  const notifications = await Notification.find({ userId: user._id }).sort({
    createdAt: -1,
  }); // Sort by most recent

  return res.status(200).json({
    message: "Notifications retrieved successfully",
    notifications,
  });
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId))
    return next(sendError(400, "invalidnotificationId"));

  // Find notification and mark as read
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true } // Return the updated notification
  );

  if (!notification) {
    return next(sendError(404, "notification"));
  }

  return res.status(200).json({
    message: "Notification marked as read",
    notification,
  });
};


// Get user's account
const getUserAccount = async (req, res, next) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  //await  createNotification(userId,"your account");
  if (!userId) {
    return next(sendError(404, "user"));
  }

  const user = await User.findById(userId)
    .select("username email profilePicture.url")
    .lean();

  if (!user) return next(sendError(404, "user"));


  return res.status(200).json({
    success: true,
    data: {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture?.url,
      role: userRole,
    },
  });
};


// Modify user's data
const updateAccount = async (req, res, next) => {
  const { firstName, lastName, profilePictureUrl, profilePicturePublic_id } = req.body;
  const user = await validateUser(req, next);

    user.firstName = firstName;
    user.lastName = lastName;

  // Update profilePicture
  if (profilePictureUrl && profilePicturePublic_id) {
    const oldPublic_id = user.profilePicture.public_id;

    // Update user with the new profile picture info
    user.profilePicture.url = profilePictureUrl;
    user.profilePicture.public_id = profilePicturePublic_id;

    if (oldPublic_id !== process.env.DEFAULT_PROFILE_PICTURE_PUBLIC_ID) {
      await cloudinaryDelete(oldPublic_id); // Delete the old Picture
    }
  }

  await user.save();
  return res.status(200).json({
    message: "Account successfully updated",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });
};

// Modify user's Password
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) return next(sendError(404, "user"));

  const session = await mongoose.startSession();
  session.startTransaction();
  const user = await User.findById(userId).session(session);
  if (!user) {
    await session.abortTransaction();
    session.endSession();
    return next(sendError(404, "user"));
  }

  // Check if the current password is correct
  // Compare the password with the hashed password in the database
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    await session.abortTransaction();
    session.endSession();
    return next(sendError(401, "CurrentPassword"));
  }

  // Update the password
  user.password = newPassword; // The pre("save") hook will hash this password

  // Clear all refresh tokens
  user.refreshTokens = [];

  // Save the user (this will trigger schema validation and password hashing)
  await user.save({ session });

  // Commit the transaction
  await session.commitTransaction();
  session.endSession();

  clearCookies(res);

  return res.status(200).json({
    message: "Password updated, please log in again.",
  });
};

const requestPasswordReset = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) return next(sendError(404, "user"));

  // Generate reset token

  const resetToken = await generateJWT({ id: user._id }, "1h");
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  // Send reset email
  await sendEmail(
    user.email,
    "Password Reset Request",
    `Click to reset: ${resetUrl}`
  );

  res.status(200).json({ message: "Password reset link sent" });
};

const confirmPasswordReset = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    // Verify token

    const decoded = verifyJWT(token); // Extracts { id }

    if (!decoded) return next(sendError(404, "token"));

    // Find user & update password
    const user = await User.findById(decoded.id);
    if (!user) return next(sendError(404, "user"));

    user.password = newPassword;
    await user.save();

    user.refreshTokens = [];
    clearCookies(res);

    res
      .status(200)
      .json({ message: "Password reset successful. Please log in again." });
  } catch (err) {
    return next(sendError(400, "invalidToken"));
  }
};

// Delete user's account
const deleteAccount = async (req, res, next) => {
  const user = await validateUser(req, next);

  const session = await mongoose.startSession();
  session.startTransaction();

  const public_id = user.profilePicture.public_id;
  const defaultPicturePublicId = process.env.DEFAULT_PROFILE_PICTURE_PUBLIC_ID;

  // If the user has a profile photo and it's not the default one, delete it from the filesystem

  if (public_id !== defaultPicturePublicId) {
    await cloudinaryDelete(public_id); // Delete the old Picture
  }




  await User.findByIdAndDelete(user._id, { session });

  // Commit transaction
  await session.commitTransaction();
  session.endSession();

  // Clear authentication cookies
  clearCookies(res);

  return res.status(200).json({
    message: "Account successfully deleted",
  });
};

// Contact support (send email)
const contactSupport = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!validator.isEmail(email)) return next(sendError(400, "InvalidEmail"));

  const emailContent = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

  await sendEmail(
    process.env.SUPPORT_EMAIL,
    `Support Request: ${subject}`,
    message,
    emailContent
  );

  res.status(201).json({ message: "Your message has been sent successfully." });
};

export default { signup, login, logout, verifyOtp, resendOtp, getUserAccount, updateAccount, changePassword, requestPasswordReset, confirmPasswordReset, deleteAccount, contactSupport , getNotifications, markAsRead };