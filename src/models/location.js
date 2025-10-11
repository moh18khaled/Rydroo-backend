import mongoose from "mongoose";

export const GeoPointSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], required: true }, // [lng, lat]
}, { _id: false });

// index is created where embedded is used (e.g., trip)
export default GeoPointSchema;