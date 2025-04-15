import express from "express";
import multer from "multer";
import path from "path";
import {
  createPerformanceEntry,
  getPerformanceEntries,
  deletePerformanceEntry,
} from "../controllers/performanceEntryController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/performance-entries",
  isAuthenticated,
  upload.single("document"),
  createPerformanceEntry
);
router.get("/performance-entries", isAuthenticated, getPerformanceEntries);
router.delete(
  "/performance-entries/:id",
  isAuthenticated,
  deletePerformanceEntry
);

export default router;
