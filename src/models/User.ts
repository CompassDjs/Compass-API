import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const User = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  imageUrl: { type: String, required: false },
  voiceTime: { type: Number, default: 0 },
});

User.plugin(uniqueValidator);

export default mongoose.model("User", User);
