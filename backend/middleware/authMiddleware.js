const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "توکن یافت نشد" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "توکن نامعتبر است" });
  }
};

const verifyAdmin = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (user?.role !== "admin") return res.status(403).json({ message: "دسترسی غیرمجاز" });
    next();
  });
};

const verifyUser = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifyUser };
