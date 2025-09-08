import express from "express";
import { createEvent, getEventsByUserId, getEventById, updateEventById, deleteEventById } from "../controllers/eventController.js";
import userAuth from "../middleware/userAuth.js";

const eventRouter = express.Router();

eventRouter.post("/create", userAuth, createEvent); 
eventRouter.get("/user/:id", userAuth, getEventsByUserId);
eventRouter.get("/:id",userAuth, getEventById);
eventRouter.put("/:id",userAuth, updateEventById);
eventRouter.delete("/:id",userAuth, deleteEventById);

export default eventRouter;
