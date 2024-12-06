// pages/api/slider.js
import multer from 'multer';
import nextConnect from 'next-connect';

const storage = multer.diskStorage({
  destination: '/backend/uploads/sliders',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

const apiRoute = nextConnect();

const isAdmin = (req, res, next) => {
  // فرض کنید نقش کاربر در هدر درخواست ارسال می‌شود
  const userRole = req.headers['x-user-role']; // یا با توکن بررسی شود
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

apiRoute.use(isAdmin).use(upload.single('sliderImage')).post((req, res) => {
  res.status(200).json({ success: true, filePath: `/backend/uploads/sliders/${req.file.filename}` });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // multer خودش مدیریت می‌کند
  },
};
