import mongoose from "mongoose";

// User model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    cars: { type: Array, default: [] },
  },
  { collection: "userdata" }
);

const User = mongoose.model("userdata", userSchema);

export default User;
