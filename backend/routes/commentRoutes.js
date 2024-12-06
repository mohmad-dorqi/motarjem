const express = require("express");
const { getComments, approveComment, replyToComment } = require("../controllers/CommentController");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// فقط ادمین‌ها قادر به تایید کامنت‌ها هستند
router.get("/", getComments);
router.put("/approve/:id", verifyAdmin, approveComment);
router.post("/reply/:id", verifyAdmin, replyToComment);

module.exports = router;
