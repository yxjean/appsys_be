import performanceEntryModel from "../models/performanceEntryModel.js";
import performanceCategoryModel from "../models/performanceCategoryModel.js";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

export const createPerformanceEntry = async (req, res) => {
  try {
    const { title, area, details, additionalData } = req.body;
    const document = req.file ? req.file.filename : null;
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
    res.json({ success: true, entries });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

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
