import performanceCategoryModel from "../models/performanceCategoryModel.js";
import userModel from "../models/userModel.js";

export const getPerformanceCategoriesByUserId = async (req,res)=>{
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    let designation = user.jobInfo[0].designation.toLowerCase();

    if(designation === "lecturer"){
      designation = 'lecture'
    }


    const categories = await performanceCategoryModel.findOne({ designation: designation })


    res.json({ success: true, categories });
  }
  catch(err){
    res.json({ success: false, message: err.message });
  }
}

export const createPerformanceCategory = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const category = new performanceCategoryModel({
      name,
      quantity,
    });
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updatePerformanceCategory = async (req, res) => {
  try {
    const { designation } = req.params;
    const { performanceArea, quantity } = req.body;
    
    const category = await performanceCategoryModel.findOne({
      designation: designation 
    })


    category.performance_area_score_distribution = category.performance_area_score_distribution.map((val)=>{
      if(val.name === performanceArea) {
        val.quantity = quantity
      }

      return val;
    })


    const updatedCategory = await performanceCategoryModel.findByIdAndUpdate(
      category._id,
      category,
      { 
        new: true
      } 
    );
    res.json({ success: true, updatedCategory });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPerformanceCategories = async (req, res) => {
  try {
    const categories = await performanceCategoryModel.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deletePerformanceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await performanceCategoryModel.deleteCategory(id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
