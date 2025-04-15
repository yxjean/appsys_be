import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from req.user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        userType: user.userType,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("faculty") // Populate the faculty field
      .populate("department"); // Optionally populate the department field

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const {
      faculty,
      designation,
      contactNumber,
      qualifications,
      areaOfExpertise,
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.jobInfo = [
      {
        faculty,
        designation,
        contactNumber,
        qualifications,
        areaOfExpertise,
      },
    ];

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const checkAdminExists = async (req, res) => {
  try {
    const admin = await userModel.findOne({ userType: "admin" });
    if (admin) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserPrivileges = async (req, res) => {
  try {
    const { id } = req.params;
    const { privileges } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.privileges = privileges || "";
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, userType, department, faculty } = req.body;

    if (userType === "admin") {
      const existingAdmin = await userModel.findOne({ userType: "admin" });
      if (existingAdmin) {
        return res.json({
          success: false,
          message:
            "An admin account already exists. Only one admin is allowed.",
        });
      }
    }

    // Validate required fields for admin
    if (userType === "admin") {
      if (!name || !email || !password) {
        return res.json({
          success: false,
          message: "Name, email, and password are required for admin.",
        });
      }
    }

    // Validate required fields for staff
    if (userType === "staff") {
      if (!name || !email || !password || !department || !faculty) {
        return res.json({
          success: false,
          message:
            "Name, email, password, department, and faculty are required for staff.",
        });
      }
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      userType,
      department: userType === "staff" ? department : undefined,
      faculty: userType === "staff" ? faculty : undefined,
    });

    await user.save();

    res.json({
      success: true,
      message: `${userType} account created successfully`,
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
