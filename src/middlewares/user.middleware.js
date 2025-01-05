import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
const userverify =async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_KEY);
    const user =  await User.findById(decodedToken._id).select("-password -refreshToken")
     req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, "Token is not verified");
  }
};
export { userverify };
