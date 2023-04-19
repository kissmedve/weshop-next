import mongoose from "mongoose";

const tagGroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    machineName: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.TagGroup || mongoose.model("TagGroup", tagGroupSchema);
