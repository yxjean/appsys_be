import express from "express";
import {
  addDepartment,
  removeDepartment,
  getDepartments,
  getDepartmentStaff,
} from "../controllers/departmentController.js";
import userAuth from "../middleware/userAuth.js";

const departmentRouter = express.Router();

departmentRouter.post("/add", userAuth, addDepartment); // Ensure facultyId is passed in the request body
departmentRouter.delete("/remove/:id", userAuth, removeDepartment);
departmentRouter.get("/", userAuth, getDepartments); // Supports facultyId query parameter
departmentRouter.get("/:id/staff", userAuth, getDepartmentStaff); // Fetch staff for a department

export default departmentRouter;
