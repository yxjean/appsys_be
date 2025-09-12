import express from "express";
import { getStaffPerformanceSummary, updateStaffPerformanceSummary } from "../controllers/staffPerformanceSummaryController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const staffPerformanceSummaryRouter = express.Router();

staffPerformanceSummaryRouter.get("/", isAuthenticated, getStaffPerformanceSummary);
staffPerformanceSummaryRouter.post("/", isAuthenticated, updateStaffPerformanceSummary);

export default staffPerformanceSummaryRouter;
