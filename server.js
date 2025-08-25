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
import departmentRouter from "./routes/departmentRoutes.js";
import staffRouter from "./routes/staffRoutes.js";
import performanceCategoryRoutes from "./routes/performanceCategoryRoutes.js";
import performanceEntryRoutes from "./routes/performanceEntryRoutes.js";
import performanceReportRoutes from "./routes/performanceReportRoutes.js";
import facultyRouter from "./routes/facultyRoutes.js";
import bookingRouter from "./routes/bookingRouter.js";
import eventRouter from "./routes/eventRoutes.js";
import notificationsRouter from "./routes/notificationsRoutes.js";

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

// Set up static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/staff", staffRouter);
app.use("/api", performanceCategoryRoutes);
app.use("/api", performanceEntryRoutes);
app.use("/api/performance-report", performanceReportRoutes);
app.use("/api/faculties", facultyRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/event", eventRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
