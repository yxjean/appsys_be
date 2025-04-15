import express from "express";
import {
  createStaff,
  deleteStaff,
  searchStaff,
  getStaffProfile,
  updateStaffRecords,
  assignPrivileges,
  getPrivilegedStaff,
  assignPrivilegesToMultipleStaff,
  saveViewableStaff,
} from "../controllers/staffController.js";
import userAuth from "../middleware/userAuth.js";

const staffRouter = express.Router();

staffRouter.post("/create", userAuth, createStaff);
staffRouter.delete("/delete/:id", userAuth, deleteStaff);
staffRouter.get("/search", userAuth, searchStaff);
staffRouter.get("/profile/:id", userAuth, getStaffProfile);
staffRouter.put("/update/:id", userAuth, updateStaffRecords);
staffRouter.put("/privileges/:id", userAuth, assignPrivileges);
staffRouter.get("/privileged", userAuth, getPrivilegedStaff);
staffRouter.put(
  "/assign-privileges",
  userAuth,
  assignPrivilegesToMultipleStaff
);
staffRouter.put("/save-viewable-staff", userAuth, saveViewableStaff);

export default staffRouter;
