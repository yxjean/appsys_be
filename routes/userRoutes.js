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
  getUserProfileById
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const userRouter = express.Router();

// Configure multer for profile picture uploads
const profileUploadDir = path.join(process.cwd(), "uploads", "profile");

// Create directory if it doesn't exist
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      req.user.id + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/profile", isAuthenticated, getUserProfile);
userRouter.get("/profile/user/:id",isAuthenticated,getUserProfileById);
userRouter.put(
  "/profile",
  isAuthenticated,
  profileUpload.single("profilePicture"),
  updateUserProfile
);
userRouter.put("/change-password", isAuthenticated, changePassword);
userRouter.get("/admin-exists", checkAdminExists);
userRouter.put("/privileges/:id", isAuthenticated, updateUserPrivileges);
userRouter.post("/create", createUser);

export default userRouter;
