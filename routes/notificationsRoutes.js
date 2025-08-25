import express from "express";
import {
  getNotificationsByUserId,
} from "../controllers/notificationsController.js";

const notificationsRouter = express.Router();

notificationsRouter.get("/user/:id", getNotificationsByUserId);

export default notificationsRouter;
