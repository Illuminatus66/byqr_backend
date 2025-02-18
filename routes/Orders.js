import express from "express";
import {
  createRazorpayOrder,
  getOrdersByUser,
  saveOrderToDatabaseAfterVerification,
} from "../controllers/razorpay.js";

const router = express.Router();

router.post("/create-razorpay-order", createRazorpayOrder);
router.get("/get-orders/:user_id", getOrdersByUser);
router.post("/verify-payment-and-save-order", saveOrderToDatabaseAfterVerification);

export default router;
