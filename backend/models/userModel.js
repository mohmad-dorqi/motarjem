const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  address: { type: String }, // مخصوص مترجمین
  description: { type: String }, // توضیحات مترجم
  skills: { type: [String] }, // مهارت‌ها
  role: { type: String, enum: ["user", "translator", "admin"], default: "user" },
  ratings: { type: [Number], default: [] }, // امتیازات
  isActive: { type: Boolean, default: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("User", UserSchema);
