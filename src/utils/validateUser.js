import sendError from "./sendError.js";
import User from "../models/user.js";

const validateUser = async (req, next) => {
  const userId = req.user?.id;

  if (!userId) return next(sendError(404, "user"));

  const user = await User.findById(userId);

  if (!user) return next(sendError(404, "user"));

  return user;
};

export default validateUser;
