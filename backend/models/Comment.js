const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isApproved: { type: Boolean, default: false },
  replies: [
    {
      text: String,
      admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

module.exports = mongoose.model("Comment", CommentSchema);
