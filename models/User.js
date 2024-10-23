import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phno: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  wishlist: [{ type: String, default: null }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export default model('User', userSchema);
