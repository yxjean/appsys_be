import mongoose from "mongoose";

const performanceCategorySchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true
  },
  performance_area_score_distribution: [
    {
      name: { type: String, required: true  },
      quantity: { type: Number, required: true }
    }
  ]
});

performanceCategorySchema.statics.deleteCategory = async function (id) {
  return this.findByIdAndDelete(id);
};

const performanceCategoryModel =
  mongoose.models.PerformanceCategory ||
  mongoose.model("PerformanceCategory", performanceCategorySchema);

export default performanceCategoryModel;
