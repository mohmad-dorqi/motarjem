import ImageSlider from "@/components/ImageSlider";
import FreelancerCard from "../components/FreelancerCard";

const freelancers = [
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
  },
  {
    id: 2,
    name: "علی رضایی",
    skills: "توسعه‌دهنده فرانت‌اند (React, Next.js)",
    rating: 4.8,
    likes: 120,
    jobsCompleted: 35,
    avatar: "/me.jpg", // تصویر پروفایل
    status: "آنلاین",
    availableHours: "۴ ساعت",
    experienceYears: 5,
  },
  {
    id: 3,
    name: "علی رضایی",
    skills: "توسعه‌دهنده فرانت‌اند (React, Next.js)",
    rating: 4.8,
    likes: 120,
    jobsCompleted: 35,
    avatar: "/me.jpg", // تصویر پروفایل
    status: "آنلاین",
    availableHours: "۴ ساعت",
    experienceYears: 5,
  },
];
const images = [
  "/Image/Capture.PNG", // مسیر عکس اول
  "/Image/Capture.PNG", // مسیر عکس اول
  "/Image/Capture.PNG", // مسیر عکس اول
  "/Image/Capture.PNG", // مسیر عکس اول
 
];
export default function Home() {
  return (
    <div className="p-8">
      <div>
        <ImageSlider images={images}/>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">Frelancers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {freelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} freelancer={freelancer} />
        ))}
      </div>
    </div>
  );
}
