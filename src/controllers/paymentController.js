import asyncHandler from "express-async-handler";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  // TODO: call stripe helper, return client secret or result
  res.json({ message: "createPaymentIntent stub" });
});

export const webhookHandler = asyncHandler(async (req, res) => {
  // TODO: verify webhook signature and update payment/trip
  res.sendStatus(200);
});

export default { createPaymentIntent, webhookHandler };