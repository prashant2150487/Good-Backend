




import express from "express";
import { checkUser } from "../../controllers/admin/authController.js";
const router=express.Router();

// Include routes
router.post("/checkUser",checkUser)
export default router






