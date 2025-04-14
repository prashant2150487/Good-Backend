import express from "express";
import {
  checkUser,
  registerUser,
  verifyOTP,
} from "../../controllers/admin/authController.js";
const router = express.Router();

// Include routes
router.post("/checkUser", checkUser);
router.post("/register", registerUser);
router.post("/verifyOTP", verifyOTP);

export default router;
