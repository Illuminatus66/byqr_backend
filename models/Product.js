import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  imgs: [{ type: String, required: true }],
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  date_added: { type: Date, default: Date.now }
});

export default model('Product', productSchema);
