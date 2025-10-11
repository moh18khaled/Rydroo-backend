import asyncHandler from "express-async-handler";
import Trip from "../models/trip.js";
import { findNearbyDrivers } from "../services/matchingService.js";

export const requestTrip = asyncHandler(async (req, res) => {
  // create trip, estimate fare, notify drivers via matchingService
  res.json({ message: "requestTrip stub" });
});

export const getTrip = asyncHandler(async (req, res) => {
  const t = await Trip.findById(req.params.id).populate("rider driver vehicle");
  res.json({ data: t });
});

export const assignDriver = asyncHandler(async (req, res) => {
  // transactional assign driver
  res.json({ message: "assignDriver stub" });
});

export const startTrip = asyncHandler(async (req, res) => {
  res.json({ message: "startTrip stub" });
});

export const completeTrip = asyncHandler(async (req, res) => {
  res.json({ message: "completeTrip stub" });
});

export default { requestTrip, getTrip, assignDriver, startTrip, completeTrip };