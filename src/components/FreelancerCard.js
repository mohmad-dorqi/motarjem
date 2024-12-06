import Link from "next/link";

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 3a1 1 0 01.98.804l.49 2.448 2.16-.36a1 1 0 011.12.802l.401 2.006 1.631-.27a1 1 0 01.98 1.195l-.49 2.447L18 11.994a1 1 0 01.8.98l-.007 3.196a1 1 0 01-.993 1.02l-2.463.08-.46 2.3a1 1 0 01-1.195.82l-2.446-.49L11 18.987a1 1 0 01-.99-.8l-.007-3.197a1 1 0 01.793-.98l2.463-.08.46-2.3a1 1 0 01.195-.195l2.446.49a1 1 0 01.8-.98L15 7.994a1 1 0 01-.82-1.195l.49-2.448-.804-.49A1 1 0 0113.006 3l-2.99.48a1 1 0 01-.804-.8L8.5 3z"></path>
          </svg>
          {freelancer.jobsCompleted} پروژه تکمیل شده
        </span>
        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          {freelancer.likes} پسند
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center p-6">
        <div className="relative">
          <img
            src={freelancer.avatar || "/default-avatar.png"}
            alt={`${freelancer.name} Avatar`}
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">{freelancer.name}</h2>
        <p className="text-sm text-gray-500">{freelancer.skills}</p>
      </div>

      {/* Status and Info */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className={`font-medium ${freelancer.status === "فعال" ? "text-green-500" : "text-gray-500"}`}>
            {freelancer.status}
          </span>
          <span className="text-gray-500">🕒 {freelancer.availableHours} ساعت/روز</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="bg-yellow-100 text-yellow-500 px-2 py-1 rounded text-xs">{`⭐ ${freelancer.rating}`}</span>
          <span className="text-gray-500">{`تجربه: ${freelancer.experienceYears} سال`}</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link
          href={`/profile/${freelancer.id}`}
          className="text-blue-500 text-sm hover:underline"
        >
          مشاهده پروفایل
        </Link>
        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all">
          ارسال پیام
        </button>
      </div>
    </div>
  );
};

export default FreelancerCard;
