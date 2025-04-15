import mongoose from "mongoose";

const performanceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

performanceCategorySchema.statics.deleteCategory = async function (id) {
  return this.findByIdAndDelete(id);
};

const performanceCategoryModel =
  mongoose.models.PerformanceCategory ||
  mongoose.model("PerformanceCategory", performanceCategorySchema);

export default performanceCategoryModel;
