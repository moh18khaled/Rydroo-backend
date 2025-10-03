import sendError from "../utils/sendError.js";

const requiredFieldsByEntity = {
  user: {
    local: ["firstName", "lastName", "email", "password"],
    google: ["username", "age", "interests", "heardAboutUs"], // no password
  },
  resendOtp: {
    local: ["email"],
  },
};

const validateRequiredFields = (entityType) => {
  return (req, res, next) => {
    const body = req.body;

    let requiredFields;

    const provider = body.authProvider || "local";
    requiredFields = requiredFieldsByEntity[entityType][provider];

    const missingFields = requiredFields.filter((field) => {
      const value = body[field];

      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return next(sendError(400, "missingFields"));
    }

    next();
  };
};

export default validateRequiredFields;
