import userModel from "../models/userModel.js";
import departmentModel from "../models/departmentModel.js"; // Import department model
import bcrypt from "bcryptjs";

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, department, faculty, jobInfo } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = new userModel({
      name,
      email,
      password: hashedPassword,
      userType: "staff",
      department,
      faculty,
      jobInfo: jobInfo || [],
    });
    await staff.save();

    // Add staff to department's staff list
    const dept = await departmentModel.findById(department);
    if (dept) {
      dept.staff.push(staff._id);
      await dept.save();
    }

    // Populate department and faculty
    const populatedStaff = await userModel
      .findById(staff._id)
      .populate("department")
      .populate("faculty");

    res.json({ success: true, staff: populatedStaff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: "Invalid staff ID" });
    }
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Staff account deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const searchStaff = async (req, res) => {
  try {
    const { query } = req.query;
    const staff = await userModel
      .find({
        userType: "staff",
        name: { $regex: query, $options: "i" },
      })
      .populate("department"); // Populate department field
    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getStaffProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: "Invalid staff ID" });
    }

    // Ensure profilePicture is included in the response
    const staff = await userModel
      .findById(id)
      .populate("department")
      .populate("faculty")
      .select("name email department faculty jobInfo profilePicture");

    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }

    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateStaffRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { accomplishments } = req.body;
    if (!id) {
      return res.json({ success: false, message: "Invalid staff ID" });
    }
    const staff = await userModel.findById(id);
    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }
    staff.accomplishments = accomplishments;
    await staff.save();
    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const assignPrivileges = async (req, res) => {
  try {
    const { id } = req.params;
    const { privileges } = req.body;
    if (!id) {
      return res.json({ success: false, message: "Invalid staff ID" });
    }
    const staff = await userModel.findById(id);
    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }
    staff.privileges = privileges;
    await staff.save();
    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPrivilegedStaff = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const staff = await userModel
      .find({ privileges: { $ne: "" }, department: departmentId })
      .populate("department");

    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const assignPrivilegesToMultipleStaff = async (req, res) => {
  try {
    const { staffIds, role, unassign } = req.body;

    if (!staffIds || staffIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No staff selected" });
    }

    if (unassign) {
      // Clear privileges, role, and viewableStaff for unassigned staff
      await userModel.updateMany(
        { _id: { $in: staffIds } },
        { $set: { privileges: "", role: "", viewableStaff: [] } }
      );
      return res.json({
        success: true,
        message: "Privileges and viewable staff unassigned successfully",
      });
    }

    // Assign privileges and role for selected staff
    await userModel.updateMany(
      { _id: { $in: staffIds } },
      { $set: { privileges: "view", role } }
    );

    res.json({
      success: true,
      message: "Privileges assigned successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveViewableStaff = async (req, res) => {
  try {
    const { staffIds, privilegedStaffId } = req.body;

    if (!staffIds || staffIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No staff selected" });
    }

    if (!privilegedStaffId) {
      return res
        .status(400)
        .json({ success: false, message: "Privileged staff ID is required" });
    }

    const privilegedStaff = await userModel.findById(privilegedStaffId);
    if (!privilegedStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Privileged staff not found" });
    }

    privilegedStaff.viewableStaff = staffIds;
    await privilegedStaff.save();

    res.json({ success: true, message: "Viewable staff saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
