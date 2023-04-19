const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    machineName: {
      type: String,
      unique: true,
    },
    tagGroup: {
      type: mongoose.Types.ObjectId,
      ref: "TagGroup",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
