import mongoose from "mongoose";

const assessmentPeriodSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
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


const assessmentPeriodModel =
  mongoose.models.AssessmentPeriod || mongoose.model("AssessmentPeriod", assessmentPeriodSchema, "assessmentPeriod" );

export default assessmentPeriodModel;
