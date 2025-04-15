import express from "express";
import {
  getPerformanceReport,
  getStaffPerformanceReport,
} from "../controllers/performanceReportController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getPerformanceReport);
router.get("/:id", isAuthenticated, getStaffPerformanceReport);

export default router;
