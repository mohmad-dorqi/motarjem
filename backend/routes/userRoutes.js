const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyUser } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();



router.post("/register", async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            password, 
            role, 
            skills, 
            description, 
            address 
        } = req.body;

        // بررسی اطلاعات اضافی برای مترجم‌ها
        if (role === "translator") {
            if (!skills || !description || !address) {
                return res.status(400).json({
                    message: "لطفاً اطلاعات کامل مترجم را وارد کنید."
                });
            }
        }

        // بررسی وجود کاربر با ایمیل یا شماره تماس تکراری
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber }
            ]
        });

        if (existingUser) {
            // بررسی نوع تکراری بودن اطلاعات
            if (existingUser.email === email) {
                return res.status(409).json({
                    message: "ایمیل وارد شده قبلاً ثبت شده است."
                });
            } else if (existingUser.phoneNumber === phoneNumber) {
                return res.status(409).json({
                    message: "شماره تماس وارد شده قبلاً ثبت شده است."
                });
            }
        }

        // هش کردن رمز عبور
        const hashedPassword = await bcrypt.hash(password, 10);

        // ایجاد کاربر جدید با اطلاعات دریافتی
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: role || "user", // نقش پیش‌فرض: کاربر ساده
            skills: role === "translator" ? skills : undefined, // اضافه کردن مهارت‌ها فقط برای مترجمین
            description: role === "translator" ? description : undefined, // اضافه کردن توضیحات فقط برای مترجمین
            address: role === "translator" ? address : undefined, // اضافه کردن آدرس فقط برای مترجمین
        });

        // ذخیره کاربر جدید در پایگاه داده
        await newUser.save();

        res.status(201).json({
            message: "کاربر با موفقیت ثبت شد."
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "خطا در ثبت‌نام. لطفاً بعداً تلاش کنید.",
            error: error.message
        });
    }
});

// ورود کاربر و دریافت توکن
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // بررسی که آیا ایمیل و رمز عبور ارسال شده است
    if (!email || !password) {
      return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است." });
    }

    // جستجوی کاربر در دیتابیس
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "کاربر با این ایمیل یافت نشد." });
    }

    // مقایسه رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است." });
    }

    // ایجاد توکن JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ارسال توکن به همراه پیام موفقیت
    res.status(200).json({
      message: "ورود موفقیت‌آمیز بود.",
      token,
    });
  } catch (error) {
    console.error(error);

    // مدیریت خطاهای پایگاه داده یا توکن
    if (error.name === "JsonWebTokenError") {
      return res.status(500).json({ message: "خطا در تولید توکن JWT." });
    }

    // در صورتی که خطای غیرمنتظره‌ای رخ دهد
    return res.status(500).json({
      message: "خطا در ورود به سیستم. لطفاً دوباره تلاش کنید.",
      error: error.message || "خطای نامشخص.",
    });
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
  
  router.put("/edit-profile", verifyUser, async (req, res) => {
    try {
      const { firstName, lastName, phoneNumber, profilePicture, address, description, skills } = req.body;
  
      // به‌روزرسانی اطلاعات کاربر وارد شده
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phoneNumber && { phoneNumber }),
          ...(profilePicture && { profilePicture }),
          ...(address && { address }),
          ...(description && { description }),
          ...(skills && { skills }),
        },
        { new: true } // بازگرداندن داده‌های به‌روز شده
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "کاربر یافت نشد" });
      }
  
      res.status(200).json({ message: "اطلاعات با موفقیت به‌روزرسانی شد", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "خطا در به‌روزرسانی اطلاعات", error });
    }
  });
  
  

  router.post("/send-email-verification", verifyUser, async (req, res) => {
    try {
      const { newEmail } = req.body;
  
      // بررسی اینکه آیا ایمیل جدید از قبل وجود دارد
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
      }
  
      // تولید کد تأیید
      const verificationCode = crypto.randomInt(100000, 999999).toString();
  
      // ذخیره کد در دیتابیس یا حافظه (اینجا فقط ذخیره موقت می‌کنیم)
      req.session = req.session || {};
      req.session.verificationCode = verificationCode;
      req.session.newEmail = newEmail;
  
      // ارسال کد به ایمیل
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: "کد تأیید تغییر ایمیل",
        text: `کد تأیید شما: ${verificationCode}`,
      });
  
      res.status(200).json({ message: "کد تأیید به ایمیل ارسال شد" });
    } catch (error) {
      res.status(500).json({ message: "خطا در ارسال کد تأیید", error });
    }
  });
  router.put("/verify-email", verifyUser, async (req, res) => {
    try {
      const { code } = req.body;
  
      // بررسی کد تأیید
      if (!req.session || req.session.verificationCode !== code) {
        return res.status(400).json({ message: "کد تأیید نامعتبر است" });
      }
  
      // به‌روزرسانی ایمیل کاربر
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
  
      user.email = req.session.newEmail;
      await user.save();
  
      // پاک کردن کد تأیید از حافظه
      delete req.session.verificationCode;
      delete req.session.newEmail;
  
      res.status(200).json({ message: "ایمیل با موفقیت تغییر یافت" });
    } catch (error) {
      res.status(500).json({ message: "خطا در تغییر ایمیل", error });
    }
  });
  router.get("/get-user-info", verifyUser, async (req, res) => {
    try {
      // استخراج توکن از هدر Authorization
      const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
      
      if (!token) {
        return res.status(400).json({ message: "توکن موجود نیست." });
      }
  
      // اعتبارسنجی توکن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ message: "توکن معتبر نیست." });
      }
  
      // دریافت اطلاعات کاربر با استفاده از ID استخراج شده از توکن
      const user = await User.findById(decoded.id).select("-password"); // عدم ارسال رمز عبور
  
      if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد." });
      }
  
      // ارسال اطلاعات کاربر
      res.status(200).json({ message: "اطلاعات کاربر با موفقیت بارگذاری شد.", user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر.", error: error.message });
    }
  });
  




// به‌روزرسانی اطلاعات کاربر
router.put("/update-profile", verifyUser, async (req, res) => {
  try {
    const { currentPassword, newPassword, firstName, lastName, phoneNumber, newEmail, address, description, skills } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    // بررسی رمز عبور فعلی برای تغییر رمز عبور
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "رمز عبور فعلی اشتباه است" });
      }

      // هش کردن رمز عبور جدید
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // به‌روزرسانی ایمیل و ارسال کد تایید اگر ایمیل جدید وارد شده باشد
    if (newEmail) {
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
      }

      // تولید کد تایید
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      req.session = req.session || {};
      req.session.verificationCode = verificationCode;
      req.session.newEmail = newEmail;

      // ارسال کد تایید به ایمیل جدید
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: "کد تأیید تغییر ایمیل",
        text: `کد تأیید شما: ${verificationCode}`,
      });

      return res.status(200).json({ message: "کد تأیید به ایمیل ارسال شد" });
    }

    // به‌روزرسانی سایر اطلاعات کاربر
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.description = description || user.description;
    user.skills = skills || user.skills;

    await user.save();

    res.status(200).json({ message: "اطلاعات با موفقیت به‌روزرسانی شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در به‌روزرسانی اطلاعات", error });
  }
});

// تایید ایمیل جدید
router.put("/verify-email", verifyUser, async (req, res) => {
  try {
    const { code } = req.body;

    // بررسی کد تایید
    if (!req.session || req.session.verificationCode !== code) {
      return res.status(400).json({ message: "کد تأیید نامعتبر است" });
    }

    // به‌روزرسانی ایمیل کاربر
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    user.email = req.session.newEmail;
    await user.save();

    // پاک کردن کد تایید از حافظه
    delete req.session.verificationCode;
    delete req.session.newEmail;

    res.status(200).json({ message: "ایمیل با موفقیت تغییر یافت" });
  } catch (error) {
    res.status(500).json({ message: "خطا در تغییر ایمیل", error });
  }
});


module.exports = router;
