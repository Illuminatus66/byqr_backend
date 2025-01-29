import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  cart_no: { type: String, required: true },
  products: [
    {
      pr_id: { type: String, required: true },
      qty: { type: Number, required: true },
    },
  ],
});

export default model("Cart", cartSchema);
