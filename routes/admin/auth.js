import express from "express";
import {
  checkUser,
  registerUser,
} from "../../controllers/admin/authController.js";
const router = express.Router();

// Include routes
router.post("/checkUser", checkUser);
router.post("/register", registerUser);
export default router;
