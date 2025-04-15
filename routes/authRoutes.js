import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import { checkAdminExists } from "../controllers/userController.js";

const authRouter = express.Router();

// send a response to register, login and logout
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/admin-exists", checkAdminExists);

export default authRouter;
