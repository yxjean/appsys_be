import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  },
  deletedAt: {
    type: Date,
    defaut: null
  }
});

const notificationsModel =
  mongoose.models.Notifications || mongoose.model("Notifications", notificationsSchema);

export default notificationsModel;
