import facultyModel from "../models/facultyModel.js";
import departmentModel from "../models/departmentModel.js";

export const addFaculty = async (req, res) => {
  try {
    const { name } = req.body;
    const faculty = new facultyModel({ name, departments: [] }); // Initialize departments as an empty array
    await faculty.save();
    res.json({ success: true, faculty });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await facultyModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Faculty removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getFaculties = async (req, res) => {
  try {
    const faculties = await facultyModel.find().populate({
      path: "departments",
      populate: { path: "staff" },
    }); // Populate departments field
    res.json({ success: true, faculties });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addDepartmentToFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name } = req.body;

    const department = new departmentModel({ name, faculty: facultyId }); // Associate department with faculty
    await department.save();

    const faculty = await facultyModel
      .findByIdAndUpdate(
        facultyId,
        { $push: { departments: department._id } },
        { new: true }
      )
      .populate({
        path: "departments",
        populate: { path: "staff" }, // Populate staff within departments
      });

    res.json({ success: true, faculty });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
