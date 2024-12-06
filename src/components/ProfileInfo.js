export default function ProfileInfo({ freelancer }) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6 border border-gray-200">
        {/* Profile Picture Section */}
        <div className="flex justify-center mb-6">
          <img
            src={freelancer.avatar || "/default-avatar.png"} // مسیر پیش‌فرض برای تصویر پروفایل
            alt={`${freelancer.name} Avatar`}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />
        </div>
  
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">{freelancer.name}</h2>
          <p className="text-gray-500 text-sm">{freelancer.description}</p>
        </div>
  
        {/* Skills Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700">مهارت‌ها:</h3>
          <p className="text-gray-600 mt-1">{freelancer.skills}</p>
        </div>
  
        {/* Contact Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-600">اطلاعات تماس:</h3>
          <p className="text-blue-800 mt-1">{freelancer.contact}</p>
        </div>
  
        {/* Rating Section */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center space-x-3">
          <strong className="text-yellow-700">امتیاز:</strong>
          <p className="text-yellow-600 text-lg font-semibold">
            {'★'.repeat(Math.round(freelancer.rating))}
            <span className="ml-1 text-gray-500 text-sm">({freelancer.rating.toFixed(1)})</span>
          </p>
        </div>
  
        {/* Comments Section */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-700">نظرات:</h3>
          <ul className="mt-2 space-y-2">
            {freelancer.comments.length > 0 ? (
              freelancer.comments.map((comment, index) => (
                <li
                  key={index}
                  className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600"
                >
                  {/* User Info for Comment */}
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={comment.userAvatar || "/default-avatar.png"} // عکس پروفایل کاربر کامنت‌دهنده
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-700">{comment.userName}</span>
                  </div>
                  <p>{comment.text}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">هنوز نظری وجود ندارد.</p>
            )}
          </ul>
        </div>
      </div>
    );
  }
  