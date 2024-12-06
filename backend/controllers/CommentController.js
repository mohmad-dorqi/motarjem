const Comment = require("../models/Comment");
const User = require("../models/User");

// گرفتن کامنت‌ها و اطلاعات کاربری که کامنت گذاشته
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "firstName lastName profilePicture");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت کامنت‌ها", error });
  }
};

// تایید یا رد کامنت توسط ادمین
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "کامنت یافت نشد" });

    comment.isApproved = true;
    await comment.save();
    res.status(200).json({ message: "کامنت تایید شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در تایید کامنت", error });
  }
};

// ارسال پاسخ به کامنت
const replyToComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "کامنت یافت نشد" });

    const reply = {
      text: req.body.text,
      admin: req.user.id,
    };
    comment.replies.push(reply);
    await comment.save();
    res.status(200).json({ message: "پاسخ به کامنت ارسال شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در ارسال پاسخ", error });
  }
};

module.exports = { getComments, approveComment, replyToComment };
