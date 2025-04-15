import performanceCategoryModel from "../models/performanceCategoryModel.js";

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
    const { id } = req.params;
    const { quantity } = req.body;
    const category = await performanceCategoryModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    res.json({ success: true, category });
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
