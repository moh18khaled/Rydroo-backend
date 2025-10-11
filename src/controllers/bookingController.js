import asyncHandler from "express-async-handler";

export const createBooking = asyncHandler(async (req, res) => res.json({ message: "createBooking stub" }));
export const getBooking = asyncHandler(async (req, res) => res.json({ message: "getBooking stub" }));

export default { createBooking, getBooking };