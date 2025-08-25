import departmentModel from "../models/departmentModel.js";
import facultyModel from "../models/facultyModel.js";
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

export const bulkAddDepartment = async (req, res) => {
  try {
    const departments = await departmentModel.insertMany(req.body);

    res.json({ success: true, departments });
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
    const department = await departmentModel.findById(id).populate("staff").lean(); // Populate staff field
    const faculty = await facultyModel.find({});


    
    department.staff = department.staff.map((val)=>{
      val.departmentName = department.name;
      val.jobInfo = val.jobInfo.map((value)=>{
        value.facultyName = faculty.filter((vle)=> { return vle._id.toString() === value.faculty})[0].name;
        return value;
      })
      
      return val;
    });


    if (!department) {
      return res.json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, staff: department.staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
