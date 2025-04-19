import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import adminAuthRoutes from "./routes/admin/auth.js";
import countryStateCityRoutes from "./routes/admin/user.js";
import verifyOtpRoutes from "./routes/admin/auth.js";
import productRoutes from "./routes/admin/product.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON body
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://good-backend-two.vercel.app"], // React frontend
    credentials: true, // allow cookies if you're using sessions or JWT with cookies
  })
);

// Connect to MongoDB
connectDB();

// API Routes

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/user", countryStateCityRoutes);
app.use("/api/admin/auth", verifyOtpRoutes);
app.use("/api/admin/product", productRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node.js with Mongoose!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
