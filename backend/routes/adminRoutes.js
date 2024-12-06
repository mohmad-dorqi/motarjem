const express = require("express");
const { getAllUsersAndTranslators, deactivateUser } = require("../controllers/AdminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// فقط ادمین‌ها قادر به دسترسی به این مسیرها هستند
router.get("/users", verifyAdmin, getAllUsersAndTranslators);
router.put("/deactivate/:id", verifyAdmin, deactivateUser);

module.exports = router;
