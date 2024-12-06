"use client";

import { usePathname } from "next/navigation";
import ProfileInfo from "../../../components/ProfileInfo";
// import ChatComponent from '../../../components/ChatComponent';

// فرضی
const freelancerData = [
  {
    id: 1,
    name: "علی رضایی",
    skills: "توسعه‌دهنده فرانت‌اند (React, Next.js)",
    rating: 4.8,
    likes: 120,
    jobsCompleted: 35,
    avatar: "/Image/me.jpg", // تصویر پروفایل
    status: "آنلاین",
    availableHours: "۴ ساعت",
    experienceYears: 5,
    comments: ["Fast delivery", "Very professional."],
  },
  {
    id: 2,
    name: "حسین محمدی",
    skills: "توسعه‌دهنده بک‌اند (Node.js, Express)",
    rating: 4.5,
    likes: 100,
    jobsCompleted: 30,
    avatar: "/me.jpg", // تصویر پروفایل
    status: "آفلاین",
    availableHours: "۲ ساعت",
    experienceYears: 4,
    comments: ["Fast delivery", "Very professional."],
  },
  {
    id: 3,
    name: "سارا احمدی",
    skills: "توسعه‌دهنده فرانت‌اند (Vue, Nuxt)",
    rating: 4.9,
    likes: 150,
    jobsCompleted: 40,
    avatar: "/me.jpg", // تصویر پروفایل
    status: "آنلاین",
    availableHours: "۶ ساعت",
    experienceYears: 6,
    comments: ["Fast delivery", "Very professional."],
  },
];

export default function FreelancerProfile() {
  const pathname = usePathname();
  const freelancerId = pathname.split("/")[2]; // استخراج id از مسیر

  // اطمینان از اینکه id معتبر است
  const id = parseInt(freelancerId, 10);
  if (isNaN(id)) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Invalid freelancer ID</h1>
      </div>
    );
  }

  // پیدا کردن فریلنسر از داده‌ها
  const freelancer = freelancerData.find((f) => f.id === id);

  if (!freelancer) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">فریلنسر پیدا نشد</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ProfileInfo freelancer={freelancer} />
      {/* <ChatComponent freelancerId={id} /> */}
    </div>
  );
}
