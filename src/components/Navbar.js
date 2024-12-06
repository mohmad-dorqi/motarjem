const Navbar = () => {
    return (
      <nav className="bg-gray-100 border-b border-gray-300 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* لوگو */}
          <div className="flex items-center space-x-4">
            <img
              src="/vercel.svg" // مسیر لوگوی شما
              alt="Fronthooks Logo"
              className="w-8 h-8"
            />
            <span className="text-blue-600 text-xl font-bold">
              فرانت هوکس
            </span>
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
            {/* آیکن سبد خرید */}
            <div className="relative">
              <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                <img
                  src="/cart-icon.svg" // مسیر آیکن سبد خرید
                  alt="Cart"
                  className="w-5 h-5"
                />
              </button>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ۰
              </span>
            </div>
  
            {/* دکمه ورود */}
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ورود
            </a>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  