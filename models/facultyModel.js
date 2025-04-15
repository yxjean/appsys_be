import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
});

const facultyModel =
  mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);

export default facultyModel;
