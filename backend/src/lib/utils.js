import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secrete = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, secrete, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: node_mode !== "production",
  });
  console.log("Token generated ans cookie set");
  return token;
};
