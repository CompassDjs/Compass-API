import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const User = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  imageUrl: { type: String, required: false },
  guildStats: [
    {
      type: Object,
      default: {
        guildId: { type: String, required: true, unique: true },
        voiceTime: { type: Number, required: true, default: 0 },
      },
    },
  ],
});

User.plugin(uniqueValidator);

export default mongoose.model("User", User);
