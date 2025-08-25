import notificationsModel from "../models/notificationsModel.js";
import mongoose from "mongoose";

export const getNotificationsByUserId = async (req, res) => {
  try {

    const { id } = req.params;

    const notifications = await notificationsModel.find({targetUser: new mongoose.Types.ObjectId(id) });


    notifications.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

