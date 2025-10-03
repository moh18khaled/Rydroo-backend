import crypto from "crypto";
import nodemailer from "nodemailer";

// Temporary in-memory store (for demo)
// In production, use a DB or Redis
export const otpStore = new Map(); // key: email/phone, value: { otp, expires }

// Resend metadata (in-memory). Production: use Redis.
export const resendMeta = new Map(); // key: email, value: { lastSent, count, windowStart }

// Resend policy defaults (can be tuned)
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds between resends
export const RESEND_MAX_PER_HOUR = 5; // max resends per hour

/**
 * Send an OTP to a given email address and store it in otpStore.
 * Returns the generated OTP (useful for testing) or null on failure.
 */
export const sendOtpToEmail = async (email) => {
  if (!email) return null;

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Set expiry time (5 minutes)
  const expires = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { otp, expires });

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Rydroo" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is ${otp}. It expires in 5 minutes.`,
  });

  return otp;
};

// Express handler wrapper (keeps old behavior)
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await sendOtpToEmail(email);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

export default sendOtp;
