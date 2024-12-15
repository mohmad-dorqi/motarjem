'use client'; // این خط برای استفاده از `useClient` در Next.js 15 است

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // استفاده از useNavigation برای مدیریت مسیرها

const ProfileEditPage = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const router = useRouter(); // استفاده از useRouter برای ناوبری

  useEffect(() => {
    // گرفتن اطلاعات کاربر از API
    axios.get('http://localhost:5000/api/user/get-user-info', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // توکن از localStorage خوانده می‌شود
      }
    })
    .then(response => {
      const { user } = response.data;
      setUserData(user);
      // پر کردن فیلدهای فرم با داده‌های کاربر
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('phoneNumber', user.phoneNumber);
      setValue('address', user.address);
      setValue('description', user.description);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      alert('خطا در دریافت اطلاعات کاربر');
    });
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const updateData = { ...data };

      if (profileImage) {
        const formData = new FormData();
        formData.append('profileImage', profileImage);

        // آپلود تصویر پروفایل
        const uploadRes = await axios.post('http://localhost:5000/api/profile/upload-profile', formData);
        updateData.profilePicture = uploadRes.data.filePath;
      }

      // ارسال اطلاعات به API برای به‌روزرسانی
      const res = await axios.put('http://localhost:5000/api/user/edit-profile', updateData);
      alert('اطلاعات با موفقیت به‌روزرسانی شد.');

      // هدایت کاربر به صفحه پروفایل بعد از موفقیت
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('خطا در به‌روزرسانی اطلاعات.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  if (!userData) {
    return <div>در حال بارگذاری اطلاعات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-extrabold text-primary text-center">ویرایش پروفایل</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">نام</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="firstName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...register('firstName', { required: 'نام الزامی است.' })}
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">نام خانوادگی</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="lastName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...register('lastName', { required: 'نام خانوادگی الزامی است.' })}
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">شماره تماس</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                autoComplete="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...register('phoneNumber', { required: 'شماره تماس الزامی است.' })}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">آدرس</label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...register('address')}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...register('description')}
              />
            </div>

            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">تصویر پروفایل</label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                className="mt-1 block w-full text-sm text-gray-700 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm font-semibold hover:bg-primary/80"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
