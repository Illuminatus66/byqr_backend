import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  imgs: [{ type: String, required: true }],
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  frameMaterial: { type: String, required: true },
  weight: { type: Number, required: true },
  wheelSize: { type: Number, required: true },
  gearSystem: { type: String, required: true },
  brakeType: { type: String, required: true },
  suspension: { type: String, required: true },
  tyreType: { type: String, required: true },
  warranty: { type: String, required: true },
  stores: [{
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  }],
  date_added: { type: Date, default: Date.now }
});

export default model('Product', productSchema);
