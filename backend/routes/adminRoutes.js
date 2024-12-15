const express = require("express");
const { getAllUsersAndTranslators, deactivateUser } = require("../controllers/AdminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/initialize-admin", async (req, res) => {
    try {
      // بررسی اینکه آیا ادمین وجود دارد
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({ message: "ادمین قبلاً ایجاد شده است" });
      }
  
      const { firstName, lastName, email, phoneNumber, password } = req.body;
  
      // بررسی اطلاعات الزامی
      if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: "همه فیلدها الزامی هستند" });
      }
  
      // هش کردن رمز عبور
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ساخت ادمین جدید
      const newAdmin = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: "admin",
      });
  
      await newAdmin.save();
      res.status(201).json({ message: "ادمین اولیه با موفقیت ایجاد شد" });
    } catch (error) {
      res.status(500).json({ message: "خطا در ایجاد ادمین اولیه", error });
    }
  });
  
  
// فقط ادمین‌ها قادر به دسترسی به این مسیرها هستند
router.get("/users", verifyAdmin, getAllUsersAndTranslators);
router.put("/deactivate/:id", verifyAdmin, deactivateUser);

module.exports = router;




