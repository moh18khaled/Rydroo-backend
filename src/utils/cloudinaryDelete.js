import cloudinary from '../config/cloudinaryConfig.js';
import asyncHandler from "express-async-handler";

// Delete a file from Cloudinary
const cloudinaryDelete = asyncHandler(async (publicId) => {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
});

export default cloudinaryDelete;