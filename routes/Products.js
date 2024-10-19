import express from "express";
import { fetchAllProducts, addProduct, deleteProduct, editProduct } from "../controllers/products.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/fetchall", fetchAllProducts);
router.post("/admin/add", authAdmin, addProduct);
router.delete("/admin/delete/:id", authAdmin, deleteProduct);
router.patch("/admin/edit", authAdmin, editProduct);

export default router;