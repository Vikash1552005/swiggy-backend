import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// absolute upload path
const uploadDir = path.join(process.cwd(), "uploads");

// auto-create uploads folder
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// static uploads
app.use("/uploads", express.static(uploadDir));

// DB
connectDB();

const PORT = process.env.PORT || 5000;


// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "LOADED" : "MISSING");


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
