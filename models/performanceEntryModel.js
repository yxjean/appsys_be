import mongoose from "mongoose";

const performanceEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  document: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  additionalData: {
    type: mongoose.Schema.Types.Mixed, // Store category-specific fields as a flexible object
  },
});

const performanceEntryModel =
  mongoose.models.PerformanceEntry ||
  mongoose.model("PerformanceEntry", performanceEntrySchema);

export default performanceEntryModel;
