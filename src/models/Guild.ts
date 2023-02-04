import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Guild = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: false },
  owner: { type: String, required: true },
});

Guild.plugin(uniqueValidator);

export default mongoose.model("Guild", Guild);
