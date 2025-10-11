import DriverProfile from "../models/driverProfile.js";

export default async function ensureDriverAvailable(req, res, next) {
  const profile = await DriverProfile.findOne({ user: req.user.id });
  if (!profile || profile.status !== "available") return res.status(409).json({ message: "Driver not available" });
  next();
}
