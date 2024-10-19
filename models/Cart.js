import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  cart_no: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      pr_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true }
    }
  ]
});

export default model('Cart', cartSchema);
