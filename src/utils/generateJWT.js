import jwt from "jsonwebtoken";

const generateJWT = async (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

  return token;
};

export default generateJWT;
