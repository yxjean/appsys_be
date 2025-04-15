import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export default userAuth;
