import mongoose from "mongoose";

// email id should be unique
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "staff"],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  privileges: {
    type: String,
    default: "",
  },
  jobInfo: [
    {
      faculty: String,
      designation: String,
      contactNumber: String,
      qualifications: String,
      areaOfExpertise: String,
    },
  ],
  viewableStaff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "",
  },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
