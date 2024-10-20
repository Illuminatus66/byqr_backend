import express from "express";
import { fetchCart, addToCart, removeFromCart, updateQty } from "../controllers/cart.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/fetch", auth, fetchCart);
router.post("/add", auth, addToCart);
router.post("/remove",auth, removeFromCart);
router.patch("/updateqty", auth, updateQty);

export default router;