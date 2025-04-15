import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty", // Reference to the Faculty model
    required: true, // Ensure faculty is required
  },
  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const departmentModel =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);

export default departmentModel;
