import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending","confirmed","cancelled","completed"], default: "pending" },
  paymentStatus: { type: String, enum: ["not_paid","paid","refunded"], default: "not_paid" },
  amount: Number,
  paymentRef: String,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);