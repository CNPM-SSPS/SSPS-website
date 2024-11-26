import  { useEffect, useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import anhdhbk from '@/assets/images/anhdhbk.jpg';

interface UserInfo {
	username: string;
  role: string;
	email: string;
	phone: string;
	mssv: string;
	remainingPages: number;
	sex: 'nam' | 'nữ' | 'khác';
	birthday: string;
  pass: string;

}

interface LoginActivity {
  id: number;        
  timestamp: string; 
  location?: string; // (Tùy chọn)
}


const MOCKED_USER: UserInfo = {
  username: 'Nguyễn Ngọc Không Tên',
  role: 'student',
  email: 'abc@hcmut.edu.vn',
  phone: '03xx 1xx 9xx',
  mssv: '2xx2xxx',
  remainingPages: 1,
  sex: 'nam',
  birthday: '2000',
  pass: '123456',
};

const generateRandomLoginActivities = (count: number): LoginActivity[] => {
  const locations = ['HCMUT Library', 'Home', 'Cafe'];
  const activities: LoginActivity[] = [];

  for (let i = 0; i < count; i++) {
    const randomTime = new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(); // Thời gian ngẫu nhiên
    const randomLocation = Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : undefined; // Địa điểm ngẫu nhiên hoặc không
    activities.push({
      id: i + 1,
      timestamp: randomTime,
      location: randomLocation,
    });
  }

  return activities;
};

// Mocked history login
const MOCKED_login = generateRandomLoginActivities(30); 


// Account Component
const Account: FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    role: '',
    email: '',
    phone: '',
    mssv: '',
    remainingPages: 0,
    sex: 'khác',
    birthday: '',
    pass: '',
  });

  // Effect kiểm tra đăng nhập
  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem('isAuthenticated') === 'true' ||
      sessionStorage.getItem('isAuthenticated') === 'true';
    const userType =
      localStorage.getItem('userType') || sessionStorage.getItem('userType');

    if (!isAuthenticated || userType !== 'student') {
      navigate('/dang-nhap'); // Điều hướng nếu không phải sinh viên hoặc chưa đăng nhập
    } else {
		  const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        // Nếu không có dữ liệu, sử dụng dữ liệu mock và lưu vào localStorage
        setUserInfo(MOCKED_USER);
        localStorage.setItem('userInfo', JSON.stringify(MOCKED_USER));
      }
    }
  }, [navigate]);

  return (
    <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
      <Helmet>
        <title>Thông tin tài khoản | HCMUT</title>
      </Helmet>
      <div className="w-full max-w-4xl flex space-x-12">
        
        {/* User Information Section */}
        <UserInfoSection userInfo={userInfo} />

        {/* Login Activity Section */}
        <LoginActivitySection />
      </div>
    </div>
  );
};

//Hiển thị thông tin chi tiết của người dùng
const UserInfoSection: FC<{ userInfo: UserInfo }> = ({ userInfo }) => (
  <div className="bg-blue-50 rounded-2xl p-8 shadow-md w-1/2">
    <div className="text-center mb-6">
      <img
        src={anhdhbk}
        alt="avatar"
        className="w-20 h-20 rounded-full mx-auto"
      />
      <h2 className="text-xl font-semibold mt-4">{userInfo.username}</h2>
      <p className="text-gray-500">
        {userInfo.role === 'student' ? 'Sinh viên' : userInfo.role}
      </p>
    </div>
    <div className="space-y-4">
      <UserInfoField label="MSSV" value={userInfo.mssv} />
      <UserInfoField label="Địa chỉ liên lạc" value={userInfo.email} />
      <UserInfoField label="Số điện thoại" value={userInfo.phone} />
      <UserInfoField
        label="Số trang in còn lại"
        value={userInfo.remainingPages.toString()}
      />
    </div>
  </div>
);

//hàm phụ của UserInfosection Hiển thị từng cặp nhãn và giá trị.
const UserInfoField: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-lg">{value}</p>
  </div>
);

// Hiển thị danh sách các hoạt động đăng nhập gần đây của người dùng.

const LoginActivitySection: FC = () => {
  // Lấy 10 lịch sử gần nhất
  // Sort
  const recentActivities = MOCKED_login
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 10);


  return (
    <div className="bg-white bg-opacity-50 rounded-lg p-8 shadow-md w-1/2">
      <h3 className="text-xl font-semibold mb-4">Hoạt động đăng nhập</h3>
      <ul className="space-y-4">
        {recentActivities.map((activity) => (
          <li key={activity.id} className="flex justify-between">
            {/* Hiển thị thời gian đăng nhập */}
            <span>{new Date(activity.timestamp).toLocaleString('vi-VN')}</span>
            {/* Hiển thị địa điểm hoặc thông báo nếu không có */}
            <span className="text-gray-400">
              {activity.location || "--------------"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Account;
