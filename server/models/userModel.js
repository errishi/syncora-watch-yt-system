import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
  },

  avatar: {
    type: String,
    default: "",
  },
}, { timestamps: true, });

const userModel = mongoose.model("User", userSchema);

export default userModel;