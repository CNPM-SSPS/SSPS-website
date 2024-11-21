import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anhdhbk from '@/assets/images/anhdhbk.jpg';
import { Helmet } from 'react-helmet-async';

const UU = {
  username: 'Nguyễn Ngọc Không Tên',
  role: 'student',
  email: 'abc@hcmut.edu.vn',
  phone: '03xx 1xx 9xx',
  mssv: '2xx2xxx',
  remainingPages: 1,
};

const fetchUserInfo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(UU);
    }, 1000);
  });
};

const Account = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    role: '',
    email: '',
    phone: '',
    mssv: '',
    remainingPages: 0,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
    const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType');

    if (!isAuthenticated || userType !== 'student') {
      navigate('/dang-nhap');
    } else {
///VD
      fetchUserInfo().then((userInfo) => {
        setUserInfo(UU);
      });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
      <Helmet>
        <title>Thông tin tài khoản | HCMUT</title>
      </Helmet>
      <div className="w-full max-w-4xl flex space-x-12">
        {/* Thông tin cá nhân */}
        <div className="bg-blue-50 rounded-2xl p-8 shadow-md w-1/2">
          <div className="text-center mb-6">
            <img
              src={anhdhbk}
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4">{userInfo.username}</h2>
            <p className="text-gray-500">{userInfo.role === 'student' ? 'Sinh viên' : userInfo.role}</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">MSSV</p>
              <p className="text-lg">{userInfo.mssv}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Địa chỉ liên lạc</p>
              <p className="text-lg">{userInfo.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
              <p className="text-lg">{userInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Số trang in còn lại</p>
              <p className="text-lg">{userInfo.remainingPages}</p>
            </div>
          </div>
        </div>

        {/* Hoạt động đăng nhập */}
        <div className="bg-white bg-opacity-50 rounded-lg p-8 shadow-md w-1/2">
          <h3 className="text-xl font-semibold mb-4">Hoạt động đăng nhập</h3>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span>Thứ Năm, 4 tháng 1 2024, 8:43 PM</span>
              <span className="text-gray-400">――</span>
            </li>
            <li className="flex justify-between">
              <span>Thứ Năm, 4 tháng 1 2024, 8:43 PM</span>
              <span className="text-gray-400">――</span>
            </li>
            <li className="flex justify-between">
              <span>Thứ Năm, 4 tháng 1 2024, 8:43 PM</span>
              <span className="text-gray-400">――</span>
            </li>
            <li className="flex justify-between">
              <span>Thứ Năm, 4 tháng 1 2024, 8:43 PM</span>
              <span className="text-gray-400">――</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Account;