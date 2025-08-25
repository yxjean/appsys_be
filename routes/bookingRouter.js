import express from "express";
import { createBooking, getCurrUsrBookingByStaffId, getById, updateById, getByStaffId, getBySuperiorId } from "../controllers/bookingController.js";
import userAuth from "../middleware/userAuth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", userAuth, createBooking); 
bookingRouter.get("/getUserBookingWithStaff/:id", userAuth, getCurrUsrBookingByStaffId);
bookingRouter.get("/staff/:id", userAuth, getByStaffId);
bookingRouter.get("/superior/:id", userAuth, getBySuperiorId);
bookingRouter.get("/:id", userAuth, getById);
bookingRouter.put("/:id", userAuth, updateById);
//bookingRoutes.delete("/remove/:id", userAuth, removeDepartment);
//bookingRoutes.get("/", userAuth, getDepartments); 
//bookingRoutes.get("/:id/staff", userAuth, getDepartmentStaff); 

export default bookingRouter;
