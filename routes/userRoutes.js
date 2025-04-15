import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getUserData,
  getUserProfile,
  updateUserProfile,
  changePassword,
  checkAdminExists,
  updateUserPrivileges,
  createUser,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/profile", isAuthenticated, getUserProfile);
userRouter.put("/profile", isAuthenticated, updateUserProfile);
userRouter.put("/change-password", isAuthenticated, changePassword);
userRouter.get("/admin-exists", checkAdminExists);
userRouter.put("/privileges/:id", isAuthenticated, updateUserPrivileges);
userRouter.post("/create", createUser);

export default userRouter;
