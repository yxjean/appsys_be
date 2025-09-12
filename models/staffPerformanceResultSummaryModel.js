import mongoose from "mongoose";

const staffPerformanceResultSummarySchema = new mongoose.Schema({
  confirmedAgreement: [{
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true
    },
    publicationEntries: {
      type: Number,
      required: true,
    },
    publicationMarks: {
      type: Number,
      required: true,
    },
    researchEntries: {
      type: Number,
      required: true
    },
    researchMarks: {
      type: Number,
      required: true
    },
    teachingAndUndergraduateSupervisionEntries: {
      type: Number,
      required: true
    },
    teachingAndUndergraduateSupervisionMarks: {
      type: Number,
      required: true
    },
    postgraduateSupervisionEntries: {
      type: Number,
      required: true
    },
    postgraduateSupervisionMarks: {
      type: Number,
      required: true
    },
    vasiEntries: {
      type: Number,
      required: true
    },
    vasiMarks: {
      type: Number,
      required: true
    },
    adminServiceEntries: {
      type: Number,
      required: true
    },
    adminServiceMarks: {
      type: Number,
      required: true
    },
    consultancyEntries: {
      type: Number,
      required: true
    },
    consultancyMarks: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      required: true
    }
  }]
});


const staffPerformanceResultSummaryModel =
  mongoose.models.StaffPerformanceResultSummary || mongoose.model("StaffPerformanceResultSummary", staffPerformanceResultSummarySchema, "staffperformanceresultsummary" );

export default staffPerformanceResultSummaryModel;
