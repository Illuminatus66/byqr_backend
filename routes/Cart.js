import express from "express";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
} from "../controllers/cart.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/fetch/:cart_no", auth, fetchCart);
router.post("/add", auth, addToCart);
router.post("/remove", auth, removeFromCart);
router.patch("/updateqty", auth, updateQty);
router.patch("/clearcart/:cart_no", auth, clearCart)

export default router;
