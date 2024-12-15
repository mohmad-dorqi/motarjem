"use client";
import { useState } from "react";
import axios from "axios";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";

// تعریف Yup schema برای اعتبارسنجی
const schema = yup.object({
  firstName: yup.string().required("نام را وارد کنید."),
  lastName: yup.string().required("نام خانوادگی را وارد کنید."),
  email: yup
    .string()
    .email("ایمیل وارد شده معتبر نیست.")
    .required("ایمیل را وارد کنید."),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "شماره تماس باید 10 رقمی باشد.")
    .required("شماره تماس را وارد کنید."),
  password: yup
    .string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد.")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/,
      "رمز عبور باید حداقل یک حرف بزرگ، یک عدد و یک نماد خاص داشته باشد."
    )
    .required("رمز عبور را وارد کنید."),
  address: yup.string().when("role", {
    is: "translator",
    then: yup.string().required("آدرس را وارد کنید."),
  }),
  skills: yup.string().when("role", {
    is: "translator",
    then: yup.string().required("مهارت‌ها را وارد کنید."),
  }),
  description: yup.string().when("role", {
    is: "translator",
    then: yup.string().required("توضیحات را وارد کنید."),
  }),
});

const RegisterForm = () => {
  const [role, setRole] = useState("user");

  // استفاده از react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  

  
  
  const handleSubmitForm = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        ...data,
        role,
      });
    
      toast.success("ثبت‌نام موفقیت‌آمیز بود!", {
        position: "top-right",
        autoClose: 5000, // زمان بسته شدن خودکار
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
      toast.error(`خطا: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  // عملکرد برای اعتبارسنجی پس از blur
  const handleBlur = async (fieldName) => {
    await trigger(fieldName); // اجرای اعتبارسنجی برای فیلد مورد نظر
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            ثبت‌نام {role === "user" ? "کاربر" : "مترجم"}
          </h2>
          <p className="text-gray-600 mb-6">
            لطفاً اطلاعات خود را تکمیل کنید تا حساب شما ایجاد شود.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setRole("user")}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                role === "user" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              کاربر
            </button>
            <button
              onClick={() => setRole("translator")}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                role === "translator" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              مترجم
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            {/* ردیف نام، نام خانوادگی، ایمیل */}
            <div className="flex gap-4 mb-4">
              <InputField
                label="نام"
                name="firstName"
                type="text"
                required
                register={register}
                error={errors.firstName}
                onBlur={() => handleBlur("firstName")}
              />
              <InputField
                label="نام خانوادگی"
                name="lastName"
                type="text"
                required
                register={register}
                error={errors.lastName}
                onBlur={() => handleBlur("lastName")}
              />
              <InputField
                label="ایمیل"
                name="email"
                type="email"
                required
                register={register}
                error={errors.email}
                onBlur={() => handleBlur("email")}
              />
            </div>

            {/* ردیف شماره تماس و رمز عبور */}
            <div className="flex gap-4 mb-4">
              <InputField
                label="شماره تماس"
                name="phoneNumber"
                type="tel"
                required
                register={register}
                error={errors.phoneNumber}
                onBlur={() => handleBlur("phoneNumber")}
              />
              <InputField
                label="رمز عبور"
                name="password"
                type="password"
                required
                register={register}
                error={errors.password}
                onBlur={() => handleBlur("password")}
              />
            </div>

            {role === "translator" && (
              <>
                {/* ردیف آدرس، شماره تماس و مهارت‌ها */}
                <div className="flex gap-4 mb-4">
                  <InputField
                    label="آدرس"
                    name="address"
                    type="text"
                    required
                    register={register}
                    error={errors.address}
                    onBlur={() => handleBlur("address")}
                  />
                  <InputField
                    label="شماره تماس"
                    name="phoneNumber"
                    type="tel"
                    required
                    register={register}
                    error={errors.phoneNumber}
                    onBlur={() => handleBlur("phoneNumber")}
                  />
                  <InputField
                    label="مهارت‌ها"
                    name="skills"
                    type="text"
                    required
                    register={register}
                    error={errors.skills}
                    onBlur={() => handleBlur("skills")}
                  />
                </div>

                {/* توضیحات مترجم */}
                <TextAreaField
                  label="توضیحات"
                  name="description"
                  required
                  register={register}
                  error={errors.description}
                  onBlur={() => handleBlur("description")}
                />
              </>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              ثبت‌نام
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
