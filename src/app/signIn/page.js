"use client"
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation'; // استفاده از next/navigation
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // استفاده از useRouter از next/navigatio


  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // ارسال درخواست POST با استفاده از axios
      const res = await axios.post(
        'http://localhost:5000/api/user/login',
        {
          email,
          password,
        },
        {
          headers: {
            // اضافه کردن هدر Authorization برای ارسال توکن (در صورت نیاز)
            'Content-Type': 'application/json',
            // اگر توکن JWT را دارید، از آن در هدر استفاده کنید
            Authorization: `Bearer ${localStorage.getItem('token')}`, // فرض بر این است که توکن در localStorage ذخیره شده
          },
        }
      );
  
      const data = res.data;
  
      // اگر پاسخ با موفقیت ارسال شد
      if (res.status === 200) {
        // ذخیره توکن JWT در localStorage یا cookie
        localStorage.setItem('token', data.token);
        // نمایش پیام موفقیت
        toast.success('ورود موفقیت‌آمیز بود!');
        // هدایت به صفحه اصلی
        router.push('/');
      }
    } catch (error) {
      // اگر خطای درخواست به API پیش بیاید
      if (error.response) {
        // دریافت خطاها از خود پاسخ
        const errorMessage = error.response.data.message || 'خطای نامشخص!';
        toast.error(errorMessage);
      } else if (error.request) {
        // در صورتی که درخواست ارسال شده باشد ولی پاسخی دریافت نشود
        toast.error('مشکلی در ارسال درخواست به سرور وجود دارد.');
      } else {
        // در صورتی که خطای دیگری رخ دهد (مثلاً مشکل در تنظیمات axios)
        toast.error('خطا در ارتباط با سرور.');
      }
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">ورود به سیستم</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">ایمیل</label>
            <input
              id="email"
              type="email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">رمز عبور</label>
            <input
              id="password"
              type="password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary  text-white py-3 rounded-md bg-blue-600 focus:outline-none"
          >
            ورود
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
