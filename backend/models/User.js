import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: email,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
});
