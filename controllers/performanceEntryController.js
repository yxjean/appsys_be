import performanceEntryModel from "../models/performanceEntryModel.js";
import performanceCategoryModel from "../models/performanceCategoryModel.js";
import userModel from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

export const createPerformanceEntry = async (req, res) => {
  try {
    const { title, area, details, additionalData } = req.body;
    const document = req.file ? req.file.filename : null;
    const letterFile = req.files.letterFile ? req.files.letterFile[0].filename : null;
    const slipFile = req.files.slipFile ? req.files.slipFile[0].filename : null;
    const user = req.user._id;

    // Validate required fields
    if (!title || !area) {
      return res.status(400).json({
        success: false,
        message: "Title and area are required.",
      });
    }

    let parsedAdditionalData = {};
    try {
      parsedAdditionalData = additionalData ? JSON.parse(additionalData) : {};
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid additionalData format.",
      });
    }

    const entry = new performanceEntryModel({
      title,
      area,
      details: details || "", // Details can be optional
      additionalData: parsedAdditionalData,
      document,
      letterFile,
      slipFile, 
      user,
      date: new Date(),
    });

    await entry.save();
    res.json({ success: true, entry });
  } catch (error) {
    console.error("Error creating performance entry:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceEntries = async (req, res) => {
  try {
    const entries = await performanceEntryModel.find({ user: req.user._id });

    // Add base URL to entries with documents
    const entriesWithDocumentUrls = entries.map((entry) => {
      // Convert Mongoose document to plain object
      const entryObject = entry.toObject();

      // Add document URL if document exists
      if (entryObject.document) {
        entryObject.documentUrl = `http://localhost:4000/uploads/${entryObject.document}`;
      }

      return entryObject;
    });

    res.json({ success: true, entries: entriesWithDocumentUrls });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPerformanceEntriesByUserId = async (req, res)=>{
  try {
    const entries = await performanceEntryModel.find({ user: req.params.id });

    // Add base URL to entries with documents
    const entriesWithDocumentUrls = entries.map((entry) => {
      // Convert Mongoose document to plain object
      const entryObject = entry.toObject();

      // Add document URL if document exists
      if (entryObject.document) {
        entryObject.documentUrl = `http://localhost:4000/uploads/${entryObject.document}`;
      }

      return entryObject;
    });

    res.json({ success: true, entries: entriesWithDocumentUrls });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
}

export const deletePerformanceEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await performanceEntryModel.findById(id);
    if (!entry) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }

    if (entry.document) {
      const filePath = path.join(process.cwd(), "uploads", entry.document);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await performanceEntryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Entry deleted" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceEntriesSummary = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const entries = await performanceEntryModel.find({ user: staffId });

    res.json({ success: true, entries });
  } catch (error) {
    console.error("Error fetching performance entries summary:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllUserPerformanceEntries = async (req, res) => {
  try {
    const allUserPerformanceEntries = await performanceEntryModel.find().lean();

    const performanceCategories = await performanceCategoryModel.find().lean();

    let allUsers;


    if(req.user.userType === "admin"){
      allUsers = await userModel.find({
        userType: { $ne: "admin" },
        /*privileges: { $ne: "view" }*/
      }).lean();
    }
    else if(req.user.privileges === "view"){
      allUsers = req.user.viewableStaff
    }

    
    allUsers = allUsers.map((val)=>{
      let userDesignation = val.jobInfo[0].designation.toLowerCase();
      val["performanceEntries"] = {
        publication: [],
        research: [],
        teaching_and_undergraduate_supervision: [],
        postgraduate_supervision: [],
        vasi: [],
        admin_service: [],
        consultancy: []
      }

      if(userDesignation === "lecturer"){
        userDesignation = 'lecture'
      }


      val["performance_area_score_distribution"] = performanceCategories.filter(val=>val.designation === userDesignation)[0].performance_area_score_distribution

      allUserPerformanceEntries.forEach((value,ind)=>{
        if(val._id.toString() === value.user.toString()){
          if(value.area === 'Administrative Service'){
            val.performanceEntries.admin_service.push(value);
          }
          else if(value.area === "Teaching & Undergraduate Supervision"){
            val.performanceEntries.teaching_and_undergraduate_supervision.push(value);
          }
          else if(value.area === "Postgraduate Supervision"){
            val.performanceEntries.postgraduate_supervision.push(value);
          }
          else if(value.area === "VASI"){
            val.performanceEntries.vasi.push(value);
          }
          else if(value.area === "Consultancy"){
            val.performanceEntries.consultancy.push(value);
          }
          else if(value.area === "Publication"){
            val.performanceEntries.publication.push(value);
          }
          else if(value.area === "Research"){
            val.performanceEntries.research.push(value);
          }
        }
      })

      return val;
    })


    res.json({ success: true, allUserPerformanceEntries: allUsers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getFileContent = async (document) => {
  if (!document) return "";

  try {
    const filePath = path.join(process.cwd(), "uploads", document);
    const fileType = document.split(".").pop().toLowerCase();

    if (fileType === "pdf") {
      const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
      const pages = pdfDoc.getPages();
      let text = "";
      for (const page of pages) {
        const textContent = await page.getTextContent();
        text += textContent.items.map((item) => item.str).join(" ");
      }
      return text;
    } else if (fileType === "docx") {
      const arrayBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: arrayBuffer });
      return result.value;
    }
  } catch (error) {
    console.error("Error reading document content:", error);
    return "";
  }

  return "";
};

const gradeFile = (progress) => {
  if (progress === 100) return "A";
  if (progress >= 80) return "B";
  if (progress >= 60) return "C";
  if (progress >= 40) return "D";
  return "F";
};
