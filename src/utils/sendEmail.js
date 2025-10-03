import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default asyncHandler(async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
});
