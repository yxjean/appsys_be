import departmentModel from "../models/departmentModel.js";
import userModel from "../models/userModel.js";

export const addDepartment = async (req, res) => {
  try {
    const { name, facultyId } = req.body;

    if (!facultyId) {
      return res.json({ success: false, message: "Faculty ID is required" });
    }

    const department = new departmentModel({ name, faculty: facultyId });
    await department.save();

    res.json({ success: true, department });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await departmentModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Department removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { facultyId } = req.query;
    const filter = facultyId ? { faculty: facultyId } : {};
    const departments = await departmentModel
      .find(filter)
      .populate("faculty")
      .populate("staff");
    res.json({ success: true, departments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDepartmentStaff = async (req, res) => {
  try {
    const { id } = req.params; // Department ID from the request
    const department = await departmentModel.findById(id).populate("staff"); // Populate staff field

    if (!department) {
      return res.json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, staff: department.staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
