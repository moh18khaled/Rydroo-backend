import mongoose from "mongoose";
import GeoPointSchema from "./location.js";

const tripSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  vehicleSnapshot: {
    plateNumber: String,
    make: String,
    model: String,
    vehicleType: String,
  },
  pickup: {
    address: String,
    location: GeoPointSchema,
  },
  dropoff: {
    address: String,
    location: GeoPointSchema,
  },
  status: { type: String, enum: ["requested","accepted","enroute","in_progress","completed","cancelled"], default: "requested" },
  fare: Number,
  distanceMeters: Number,
  durationSeconds: Number,
  estimatedArrivalAt: Date,
  startedAt: Date,
  completedAt: Date,
  canceledBy: { type: String, enum: ["rider","driver","system", null], default: null },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

tripSchema.index({ "pickup.location": "2dsphere" });
tripSchema.index({ "dropoff.location": "2dsphere" });

export default mongoose.model("Trip", tripSchema);