import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import departmentRouter from "./routes/departmentRoutes.js"; // Import department routes
import staffRouter from "./routes/staffRoutes.js"; // Import staff routes
import performanceCategoryRoutes from "./routes/performanceCategoryRoutes.js";
import performanceEntryRoutes from "./routes/performanceEntryRoutes.js"; // Import performance entry routes
import performanceReportRoutes from "./routes/performanceReportRoutes.js"; // Import performance report routes
import facultyRouter from "./routes/facultyRoutes.js"; // Import faculty routes

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/departments", departmentRouter); // Use department routes
app.use("/api/staff", staffRouter); // Use staff routes
app.use("/api", performanceCategoryRoutes);
app.use("/api", performanceEntryRoutes); // Use performance entry routes
app.use("/api/performance-report", performanceReportRoutes); // Use performance report routes
app.use("/api/faculties", facultyRouter); // Register the faculty routes

app.listen(port, () => console.log(`Server is running on port ${port}`));
