import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  make: String,
  model: String,
  year: Number,
  color: String,
  plateNumber: { type: String, required: true, index: true },
  capacity: { type: Number, default: 4 },
  vehicleType: { type: String, enum: ["car", "van", "bike", "suv"], default: "car" },
  photo: { url: String, public_id: String },
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);