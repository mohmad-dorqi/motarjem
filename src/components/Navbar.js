"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // استفاده از next/navigation
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/get-user-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("خطا در بارگذاری اطلاعات کاربر");
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("با موفقیت از سیستم خارج شدید");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-100 border-b border-gray-300 p-4 shadow-lg">
      {" "}
      {/* افزودن shadow-lg به ناوبار */}
      <div className="container mx-auto flex justify-between items-center">
        {/* لوگو */}
        <div className="flex items-center space-x-4">
          <img
            src="/vercel.svg" // مسیر لوگوی شما
            alt="Fronthooks Logo"
            className="w-8 h-8"
          />
          <span className="text-blue-600 text-xl font-bold">فرانت هوکس</span>
        </div>

        {/* منو */}
        <ul className="flex space-x-6 text-gray-600">
          <li className="hover:text-blue-600">
            <a href="#">دوره‌های آموزشی</a>
          </li>
          <li className="hover:text-blue-600">
            <a href="#">استخدامی بچه‌ها</a>
          </li>
          <li className="hover:text-blue-600">
            <a href="#">ارتباط با ما</a>
          </li>
        </ul>

        {/* دکمه‌ها */}
        <div className="flex items-center space-x-4">
          {/* اگر کاربر وارد شده است */}
          {user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={toggleDropdown}
              >
                {/* تصویر پروفایل */}
                <img
                  src={user.profilePicture || "/Image/me.jpg"} // اگر تصویر پروفایل وجود نداشت از تصویر پیش‌فرض استفاده می‌کنیم
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {/* منوی کشویی اصلاح‌شده */}

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg z-10 overflow-hidden w-48">
                  <ul className="flex flex-col">
                    {/* لینک پروفایل */}
                    <li className="border-b border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition duration-200"
                      >
                        تغییر اطلاعات
                      </Link>
                    </li>

                   
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block   px-4 py-3 text-red-600 hover:bg-red-100 transition duration-200"
                      >
                        خروج
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ورود
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
