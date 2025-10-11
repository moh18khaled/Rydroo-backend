import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  provider: String,
  providerPaymentId: String,
  amount: Number,
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["pending","succeeded","failed","refunded"], default: "pending" },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);