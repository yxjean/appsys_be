import performanceEntryModel from "../models/performanceEntryModel.js";
import userModel from "../models/userModel.js";

export const getPerformanceReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const publications = await performanceEntryModel.find({ user: userId });
    const supervision = publications.filter(
      (entry) => entry.area === "Supervision"
    );

    const reportData = {
      publications,
      supervision,
    };

    res.json({ success: true, reportData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getStaffPerformanceReport = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    const publications = await performanceEntryModel.find({ user: user._id });
    const supervision = publications.filter(
      (entry) => entry.area === "Supervision"
    );
    const completed = publications.filter((entry) => entry.completed === true);

    const reportData = {
      publications,
      supervision,
      completed,
    };

    res.json({ success: true, reportData });
  } catch (error) {
    console.log(`Error fetching report data: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};


export const getStaffPerformanceReportByStaffId = async (req, res)=>{
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    const publications = await performanceEntryModel.find({ user: user._id });
    const supervision = publications.filter(
      (entry) => entry.area === "Supervision"
    );
    const completed = publications.filter((entry) => entry.completed === true);

    const reportData = {
      publications,
      supervision,
      completed,
    };

    res.json({ success: true, reportData });
  } catch (error) {
    console.log(`Error fetching report data: ${error.message}`);
    res.json({ success: false, message: error.message });
  }

}
