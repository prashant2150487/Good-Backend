import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import adminAuthRoutes from "./routes/admin/auth.js";
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node.js with Mongoose!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
