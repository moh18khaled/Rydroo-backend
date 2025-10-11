import asyncHandler from "express-async-handler";
import DriverProfile from "../models/driverProfile.js";

export const createProfile = asyncHandler(async (req, res) => {
  // TODO: create or update profile
  res.json({ message: "createProfile stub" });
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await DriverProfile.findById(req.params.id).populate("user vehicle");
  res.json({ data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  // TODO: update profile
  res.json({ message: "updateProfile stub" });
});

export default { createProfile, getProfile, updateProfile };