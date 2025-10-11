import asyncHandler from "express-async-handler";
import Vehicle from "../models/vehicle.js";

export const createVehicle = asyncHandler(async (req, res) => {
  // TODO: validate ownership and create
  res.json({ message: "createVehicle stub" });
});

export const getVehicle = asyncHandler(async (req, res) => {
  const v = await Vehicle.findById(req.params.id);
  res.json({ data: v });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  res.json({ message: "updateVehicle stub" });
});

export default { createVehicle, getVehicle, updateVehicle };

