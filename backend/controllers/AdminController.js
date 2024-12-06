const User = require("../models/User");

const getAllUsersAndTranslators = async (req, res) => {
  try {
    const users = await User.find().select("firstName lastName email role isActive");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت کاربران", error });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });
    res.status(200).json({ message: "کاربر غیرفعال شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در غیرفعال کردن کاربر", error });
  }
};

module.exports = { getAllUsersAndTranslators, deactivateUser };
