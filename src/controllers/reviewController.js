import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(async (req, res) => res.json({ message: "createReview stub" }));
export const listReviews = asyncHandler(async (req, res) => res.json({ message: "listReviews stub" }));

export default { createReview, listReviews };