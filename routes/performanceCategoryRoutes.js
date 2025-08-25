import express from "express";
import {
  createPerformanceCategory,
  updatePerformanceCategory,
  getPerformanceCategories,
  deletePerformanceCategory,
  getPerformanceCategoriesByUserId
} from "../controllers/performanceCategoryController.js";

const router = express.Router();

router.post("/performance-categories", createPerformanceCategory);
router.put("/performance-categories/:designation", updatePerformanceCategory);
router.get("/performance-categories", getPerformanceCategories);
router.get("/performance-categories/user/:id", getPerformanceCategoriesByUserId);
router.delete("/performance-categories/:id", deletePerformanceCategory);

export default router;
