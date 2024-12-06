"use client"
import { useState, useEffect } from "react";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // تغییر تصویر به صورت خودکار
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // هر ۳ ثانیه
    return () => clearInterval(interval);
  }, [images]);

  // جابجایی به تصویر قبلی
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // جابجایی به تصویر بعدی
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full " style={{ height: "300px" }}>
      {/* تصاویر */}
      <div className="h-full w-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="object-cover rounded-lg shadow-lg h-full w-full max-w-6xl"
        />
      </div>

      {/* دکمه قبلی */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-2xl p-4 rounded-full opacity-50 hover:opacity-100 hover:bg-blue-600 transition-all"
      >
        &#8592;
      </button>

      {/* دکمه بعدی */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-2xl p-4 rounded-full opacity-50 hover:opacity-100 hover:bg-blue-600 transition-all"
      >
        &#8594;
      </button>
    </div>
  );
};

export default ImageSlider;
