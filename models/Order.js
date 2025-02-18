import { Schema, model } from "mongoose";

const productSchema = new Schema({
  pr_id: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

const orderSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  orders: [
    {
      receipt: { type: String, required: true },
      razorpay_payment_id: { type: String, required: true },
      razorpay_order_id: { type: String, required: true },
      razorpay_signature: { type: String, required: true },
      products: [productSchema],
      total_amount: { type: Number, required: true },
      created_at: { type: Date, default: Date.now },
    },
  ],
});

export default model("Order", orderSchema);
