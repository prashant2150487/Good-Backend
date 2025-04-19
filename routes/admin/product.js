import express from "express";
const router = express.Router();
import { addProduct } from "../../controllers/admin/productController.js";

router.post("/add_product", addProduct);




export default router;
