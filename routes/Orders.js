import express from "express";
import {
  createRazorpayOrder,
  getOrdersByUser,
  saveOrderToDatabaseAfterVerification,
} from "../controllers/razorpay.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create-razorpay-order", auth, createRazorpayOrder);
router.post("/verify-payment-and-save-order", auth, saveOrderToDatabaseAfterVerification);
router.get("/get-orders/:user_id", auth, getOrdersByUser);

export default router;
