const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyUser } = require("../middleware/authMiddleware");

const router = express.Router();

// ثبت‌نام کاربر جدید
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "کاربر با موفقیت ثبت شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در ثبت‌نام", error });
  }
});

// ورود کاربر و دریافت توکن
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "رمز عبور اشتباه است" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "خطا در ورود", error });
  }
});

// گرفتن اطلاعات کاربری
router.get("/me", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر", error });
  }
});

module.exports = router;
