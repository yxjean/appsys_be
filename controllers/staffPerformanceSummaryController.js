import staffPerformanceResultSummaryModel from '../models/staffPerformanceResultSummaryModel.js'

export const updateStaffPerformanceSummary = async (req, res) => {
  try {
    let staffPerformanceResultSummary = await staffPerformanceResultSummaryModel.find({}).lean();
    let newStaffPerformanceResultSummary;

    let confirmedAgreement = req.body.confirmedAgreement.map((val)=>{
      return {
        staffId: val._id,
        publicationEntries: val.performanceEntries.publication.length,
        publicationMarks: val.publication,
        researchEntries: val.performanceEntries.research.length,
        researchMarks: val.research,
        teachingAndUndergraduateSupervisionEntries: val.performanceEntries.teaching_and_undergraduate_supervision.length,
        teachingAndUndergraduateSupervisionMarks: val.teachingAndUndergraduateSupervision,
        postgraduateSupervisionEntries: val.postgraduate_supervision?val.postgraduate_supervision.length:0,
        postgraduateSupervisionMarks: val.postgraduateSupervision,
        vasiEntries: val.performanceEntries.vasi.length,
        vasiMarks: val.vasi,
        adminServiceEntries: val.performanceEntries.admin_service.length,
        adminServiceMarks: val.admin_service,
        consultancyEntries: val.performanceEntries.consultancy.length,
        consultancyMarks: val.consultancy,
        totalMarks: val.total_marks,
        grade: val.grade
      }
    })
  
    if(staffPerformanceResultSummary.length){
      staffPerformanceResultSummary[0].confirmedAgreement = staffPerformanceResultSummary[0].confirmedAgreement.filter(val => {
        let isExists = false;
        confirmedAgreement.forEach((vle)=>{
          if(val.staffId.toString() === vle.staffId.toString()){
            isExists = true;
            return false;
          }
        })

        return !isExists;
      });


      confirmedAgreement = [...staffPerformanceResultSummary[0].confirmedAgreement,...confirmedAgreement];

      newStaffPerformanceResultSummary = await staffPerformanceResultSummaryModel.findByIdAndUpdate(
        staffPerformanceResultSummary[0]._id.toString(),
        {
          $set: { confirmedAgreement: confirmedAgreement }
        },
        { new: true })
    }
    else{
      newStaffPerformanceResultSummary = new staffPerformanceResultSummaryModel({ confirmedAgreement: confirmedAgreement});
      await newStaffPerformanceResultSummary.save();
    }

    res.json({ success: true, newStaffPerformanceResultSummary});

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getStaffPerformanceSummary = async (req, res)=>{
  try{
    const confirmedAgreement = await staffPerformanceResultSummaryModel.find({}).populate("confirmedAgreement.staffId").lean();


    res.json({ success: true, confirmedAgreement });
  }
  catch (err){
    res.json({ success: false, errMsg: err.message });
  }
}

