import generateJWT from "../utils/generateJWT.js";
import setCookie from "../utils/setCookie.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

const generateAndSetTokens = asyncHandler(async (user, res) => {
  
  const accessToken = await generateJWT(
    { email: user.email, id: user.id, role: user.role },
    "5m"
  );
  setCookie(res, "access_token", accessToken, 5 * 60 * 1000);

  const refreshToken = await generateJWT(
    { email: user.email, id: user.id, role: user.role },
    "7d"
  );
  setCookie(res, "refresh_token", refreshToken, 7 * 24 * 60 * 60 * 1000);

  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshTokens.push({
    token: hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 d
  });
  console.log("Generating and setting tokens for user:", user.email);

  await user.save();
});
 
export default generateAndSetTokens;
