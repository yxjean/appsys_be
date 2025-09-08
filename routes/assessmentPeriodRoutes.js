import express from "express";
import { getAssessmentPeriod, createAssessmentPeriod } from "../controllers/assessmentPeriodController.js";
import userAuth from "../middleware/userAuth.js";

const assessmentPeriodRouter = express.Router();

assessmentPeriodRouter.post("/",userAuth, createAssessmentPeriod); 
assessmentPeriodRouter.get("/",userAuth, getAssessmentPeriod); 

export default assessmentPeriodRouter;
