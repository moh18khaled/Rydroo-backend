import DriverProfile from "../models/driverProfile.js";

// find nearby available drivers (simple)
export const findNearbyDrivers = async (lng, lat, radiusMeters = 5000) => {
  // TODO: driver location field required; placeholder queries driver profiles/vehicles
  return DriverProfile.find({ status: "available" }).limit(10).lean();
};

export default { findNearbyDrivers };