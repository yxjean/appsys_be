import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
