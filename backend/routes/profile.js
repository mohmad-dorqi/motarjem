// backend/routes/profile.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "backend/uploads/profiles/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/upload-profile", upload.single("profileImage"), (req, res) => {
  res.json({ success: true, filePath: `/backend/uploads/profiles/${req.file.filename}` });
});

module.exports = router;
