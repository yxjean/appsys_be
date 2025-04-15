import express from "express";
import {
  addFaculty,
  removeFaculty,
  getFaculties,
  addDepartmentToFaculty,
} from "../controllers/facultyController.js";
import userAuth from "../middleware/userAuth.js";

const facultyRouter = express.Router();

facultyRouter.post("/add", userAuth, addFaculty);
facultyRouter.delete("/remove/:id", userAuth, removeFaculty);
facultyRouter.get("/", userAuth, getFaculties);
facultyRouter.post(
  "/:facultyId/departments/add",
  userAuth,
  addDepartmentToFaculty
);

export default facultyRouter;
