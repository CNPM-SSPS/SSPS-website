import { faCircleUser, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface UserData {
	id: string;
	name: string;
	email: string;
	studentID: string;
	department: string;
	isEmailVerified: boolean;
	pageCount: number;
	__t: string;
}

export interface StudentInfo {
	id: string;
	name: string;
	email: string;
	studentID: string;
	department: string;
	isEmailVerified: boolean;
	pageCount: number;
	__t: 'Student';
}

const initialStudentInfo: StudentInfo = {
	id: '',
	name: 'Chưa cập nhật',
	email: 'Chưa cập nhật',
	studentID: '',
	department: '',
	isEmailVerified: false,
	pageCount: 0,
	__t: 'Student',
};

interface LoginTimeResponse {
	LoginList: string[];
}

interface TokenResponse {
	access: {
		token: string;
		expires: string;
	};
	refresh: {
		token: string;
		expires: string;
	};
}

const Home: React.FC = () => {
	const [studentInfo, setStudentInfo] =
		useState<StudentInfo>(initialStudentInfo);
	const [isLoading, setIsLoading] = useState(false);
	const [loginHistory, setLoginHistory] = useState<string[]>([]);

	const fetchLoginHistory = useCallback(async () => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) {
				throw new Error('Không tìm thấy token đăng nhập');
			}

			const { data } = await axios.get<LoginTimeResponse>(
				'/v1/student/account/loginTime',
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			setLoginHistory(data.LoginList);
		} catch (error) {
			console.error('Error fetching login history:', error);
			toast.error('Không thể tải lịch sử đăng nhập');
		}
	}, []);

	const refreshTokens = async (): Promise<boolean> => {
		try {
			const refreshToken = localStorage.getItem('refreshToken');
			if (!refreshToken) {
				toast.error('Không tìm thấy refresh token');
				return false;
			}

			const { data } = await axios.post<TokenResponse>(
				'/v1/auth/refresh-tokens',
				{
					refreshToken,
				},
			);

			localStorage.setItem('accessToken', data.access.token);
			localStorage.setItem('tokenExpires', data.access.expires);
			localStorage.setItem('refreshToken', data.refresh.token);
			localStorage.setItem('refreshTokenExpires', data.refresh.expires);

			return true;
		} catch (error) {
			console.error('Error refreshing tokens:', error);
			toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
			return false;
		}
	};

	const fetchStudentData = useCallback(async () => {
		setIsLoading(true);
		try {
			const isTokenRefreshed = await refreshTokens();
			if (!isTokenRefreshed) {
				window.location.href = '/dang-nhap';
				return;
			}

			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) {
				toast.error('Không tìm thấy token đăng nhập');
				return;
			}

			const { data } = await axios.get<UserData>('/v1/student/homepage', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			setStudentInfo({
				...initialStudentInfo,
				id: data.id,
				name: data.name,
				email: data.email,
				studentID: data.studentID,
				department: data.department,
        pageCount: data.pageCount,
				isEmailVerified: data.isEmailVerified,
			});

			await fetchLoginHistory();
			toast.success('Đã lấy dữ liệu mới nhất');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data?.message ?? 'Đã xảy ra lỗi');
			} else {
				toast.error('Đã xảy ra lỗi');
			}
		} finally {
			setIsLoading(false);
		}
	}, [fetchLoginHistory]);

	useEffect(() => {
		fetchStudentData();
	}, [fetchStudentData]);

	return (
		<div>
			<Helmet>
				<title>Trang chủ | HCMUT</title>
			</Helmet>
			<div className='mx-auto max-w-7xl'>
				<div className='flex justify-end'>
					<button
						onClick={fetchStudentData}
						disabled={isLoading}
						className='flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 disabled:opacity-50'
					>
						<FontAwesomeIcon
							icon={faRotate}
							className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
						/>
						{isLoading ? 'Đang tải...' : 'Làm mới'}
					</button>
				</div>
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
					<div className='rounded-lg bg-white p-6 shadow-sm'>
						<div className='mb-6 flex items-center'>
							<FontAwesomeIcon
								icon={faCircleUser}
								className='mr-4 h-20 w-20 text-blue-400'
							/>
							<div>
								<h2 className='text-2xl font-medium text-blue-600'>
									Sinh viên
								</h2>
								<p className='text-xl text-gray-800'>
									{studentInfo.name}
								</p>
								<p className='text-md text-gray-600'>
									MSSV: {studentInfo.studentID}
								</p>
							</div>
						</div>

						<div className='space-y-4'>
							<div className='rounded-lg bg-blue-50 p-4'>
								<h3 className='mb-2 font-medium text-blue-700'>
									Số trang in còn lại
								</h3>
								<p className='text-3xl font-bold text-blue-600'>
									{studentInfo.pageCount ?? 0}
								</p>
							</div>

							<div className='rounded-lg border p-4'>
								<h3 className='mb-2 font-medium text-gray-700'>
									Thông tin liên hệ
								</h3>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-gray-600'>
											Email:
										</span>
										<span className='font-medium'>
											{studentInfo.email}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='rounded-lg bg-white p-6 shadow-sm'>
						<h3 className='mb-4 text-xl font-medium text-blue-600'>
							Hoạt động đăng nhập gần đây
						</h3>
						<div className='space-y-3'>
							{loginHistory.map((login) => (
								<div
									key={login.replace(/[^a-zA-Z0-9]/g, '')}
									className='flex items-center rounded-lg border p-3 transition-colors hover:bg-gray-50'
								>
									<span className='text-gray-600'>
										{login}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
