import assessmentPeriodModel from "../models/assessmentPeriodModel.js";

async function getAssessmentPeriod(req, res) {
  try {
    const assessmentPeriod = await assessmentPeriodModel.find().sort({ createdAt: -1 });

    res.json({ success: true, assessmentPeriod });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

async function createAssessmentPeriod(req, res) {
  try {
    const assessmentPeriod = new assessmentPeriodModel(req.body)
    await assessmentPeriod.save()

    res.json({ success: true, assessmentPeriod });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 


export { getAssessmentPeriod, createAssessmentPeriod };
