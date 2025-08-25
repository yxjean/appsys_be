import express from "express";
import { createEvent, getEventsByUserId } from "../controllers/eventController.js";
import userAuth from "../middleware/userAuth.js";

const eventRouter = express.Router();

eventRouter.post("/create", userAuth, createEvent); 
eventRouter.get("/user/:id", userAuth, getEventsByUserId);

export default eventRouter;
