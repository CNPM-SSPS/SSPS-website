import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
interface StudentInfo {
	id: string;
	name: string;
	email: string;
	studentID: string;
	department: string;
	isEmailVerified: boolean;
	paper: number[];
	role: string;
	__t: 'Student';
}

interface UpdateProfileResponse {
	name: string;
	email: string;
	password: string;
	role: string;
	isEmailVerified: boolean;
	__t: 'Student';
	studentID: string;
	department: string;
	paper: number[];
	id: string;
}

interface PasswordChangeForm {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface PasswordChangeResponse {
	message: string;
	user: {
		name: string;
		email: string;
		password: string;
		role: string;
		isEmailVerified: boolean;
		__t: 'Student';
		studentID: string;
		department: string;
		paper: number[];
		id: string;
	};
}

const SettingPage: React.FC = () => {
	const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Partial<StudentInfo>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	useEffect(() => {
		const storedInfo = localStorage.getItem('userData');
		if (storedInfo) {
			const parsedInfo = JSON.parse(storedInfo);
			setStudentInfo(parsedInfo);
			setFormData(parsedInfo);
		}
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordForm({
			...passwordForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleSaveChanges = async () => {
		if (!studentInfo) return;

		setIsLoading(true);
		try {
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) {
				throw new Error('Không tìm thấy token đăng nhập');
			}

			const { data } = await axios.put<UpdateProfileResponse>(
				'/v1/student/account/profile',
				{
					name: formData.name,
					email: formData.email,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			const updatedInfo: StudentInfo = {
				...studentInfo,
				name: data.name,
				email: data.email,
				role: data.role,
				isEmailVerified: data.isEmailVerified,
				studentID: data.studentID,
				department: data.department,
				paper: data.paper,
				id: data.id,
				__t: data.__t,
			};

			setStudentInfo(updatedInfo);

			const userData = localStorage.getItem('userData');
			if (userData) {
				const parsedUserData = JSON.parse(userData);
				localStorage.setItem(
					'userData',
					JSON.stringify({
						...parsedUserData,
						...updatedInfo,
					}),
				);
			}

			setIsEditing(false);
			toast.success('Thông tin đã được cập nhật thành công!');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ??
						'Có lỗi xảy ra khi cập nhật thông tin!',
				);
			} else {
				toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error('Mật khẩu mới không khớp!');
			return;
		}

		if (passwordForm.newPassword.length < 8) {
			toast.error('Mật khẩu mới phải có ít nhất 8 ký tự!');
			return;
		}

		if (!/[a-zA-Z]/.test(passwordForm.newPassword)) {
			toast.error('Mật khẩu phải chứa ít nhất 1 chữ cái!');
			return;
		}

		setIsChangingPassword(true);
		try {
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) {
				throw new Error('Không tìm thấy token đăng nhập');
			}

			const { data } = await axios.post<PasswordChangeResponse>(
				'/v1/auth/change-password',
				{
					currentPassword: passwordForm.currentPassword,
					newPassword: passwordForm.newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			const updatedInfo: StudentInfo = {
				...studentInfo!,
				name: data.user.name,
				email: data.user.email,
				studentID: data.user.studentID,
				department: data.user.department,
				isEmailVerified: data.user.isEmailVerified,
				paper: data.user.paper,
				id: data.user.id,
				__t: data.user.__t,
			};
			setStudentInfo(updatedInfo);

			localStorage.setItem('userData', JSON.stringify(updatedInfo));

			setIsPasswordModalOpen(false);
			setPasswordForm({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			toast.success('Đổi mật khẩu thành công!');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.message;
				if (
					errorMessage?.includes(
						'length must be at least 8 characters long',
					)
				) {
					toast.error('Mật khẩu mới phải có ít nhất 8 ký tự!');
				} else if (
					errorMessage?.includes(
						'Password must contain at least 1 letter',
					)
				) {
					toast.error('Mật khẩu phải chứa ít nhất 1 chữ cái!');
				} else if (errorMessage?.includes('incorrect password')) {
					toast.error('Mật khẩu hiện tại không chính xác!');
				} else {
					toast.error(
						error.response?.data?.message ??
							'Có lỗi xảy ra khi đổi mật khẩu!',
					);
				}
			} else {
				toast.error('Có lỗi xảy ra khi đổi mật khẩu!');
			}
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleEditClick = () => {
		setFormData({
			name: studentInfo?.name,
			email: studentInfo?.email,
		});
		setIsEditing(true);
	};

	if (!studentInfo) return <div>Loading...</div>;

	return (
		<div className='mx-auto max-w-7xl'>
			<Helmet>
				<title>Thông Tin Tài Khoản | HCMUT</title>
			</Helmet>
			<h1 className='mb-6 text-2xl font-bold text-gray-800'>
				Thông Tin Tài Khoản
			</h1>
			<div className='space-y-6'>
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					<div className='relative'>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							<FontAwesomeIcon icon={faUser} className='mr-2' />
							Họ và tên
						</label>
						<input
							type='text'
							name='name'
							value={isEditing ? formData.name : studentInfo.name}
							onChange={handleInputChange}
							disabled={!isEditing}
							className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
						/>
					</div>

					<div className='relative'>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							<FontAwesomeIcon
								icon={faEnvelope}
								className='mr-2'
							/>
							Email
						</label>
						<input
							type='email'
							name='email'
							value={
								isEditing ? formData.email : studentInfo.email
							}
							onChange={handleInputChange}
							disabled={!isEditing}
							className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
						/>
					</div>

					<div className='relative'>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							<FontAwesomeIcon icon={faUser} className='mr-2' />
							Mã số sinh viên
						</label>
						<input
							type='text'
							name='studentID'
							value={studentInfo.studentID}
							disabled
							className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
						/>
					</div>

					<div className='relative'>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							<FontAwesomeIcon icon={faUser} className='mr-2' />
							Khoa
						</label>
						<input
							type='text'
							name='department'
							value={studentInfo.department}
							disabled
							className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
						/>
					</div>
				</div>

				<div className='mt-6 flex justify-end space-x-4'>
					{!isEditing ? (
						<>
							<button
								type='button'
								onClick={() => setIsPasswordModalOpen(true)}
								className='rounded-lg bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700'
							>
								Đổi mật khẩu
							</button>
							<button
								type='button'
								onClick={handleEditClick}
								className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
							>
								Chỉnh sửa
							</button>
						</>
					) : (
						<>
							<button
								type='button'
								onClick={() => {
									setIsEditing(false);
									setFormData({});
								}}
								className='rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600'
								disabled={isLoading}
							>
								Hủy
							</button>
							<button
								type='button'
								onClick={handleSaveChanges}
								className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
								disabled={isLoading}
							>
								{isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
							</button>
						</>
					)}
				</div>
			</div>

			{isPasswordModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
						<h2 className='mb-4 text-xl font-bold text-gray-800'>
							Đổi mật khẩu
						</h2>
						<form
							onSubmit={handlePasswordSubmit}
							className='space-y-4'
						>
							<div>
								<label className='mb-2 block text-sm font-medium text-gray-700'>
									<FontAwesomeIcon
										icon={faKey}
										className='mr-2'
									/>
									Mật khẩu hiện tại
								</label>
								<input
									type='password'
									name='currentPassword'
									value={passwordForm.currentPassword}
									onChange={handlePasswordChange}
									className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500'
									required
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-medium text-gray-700'>
									<FontAwesomeIcon
										icon={faKey}
										className='mr-2'
									/>
									Mật khẩu mới
								</label>
								<input
									type='password'
									name='newPassword'
									value={passwordForm.newPassword}
									onChange={handlePasswordChange}
									className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500'
									required
								/>
							</div>
							<div>
								<label className='mb-2 block text-sm font-medium text-gray-700'>
									<FontAwesomeIcon
										icon={faKey}
										className='mr-2'
									/>
									Xác nhận mật khẩu mới
								</label>
								<input
									type='password'
									name='confirmPassword'
									value={passwordForm.confirmPassword}
									onChange={handlePasswordChange}
									className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500'
									required
								/>
							</div>
							<div className='mt-6 flex justify-end space-x-4'>
								<button
									type='button'
									onClick={() => {
										setIsPasswordModalOpen(false);
										setPasswordForm({
											currentPassword: '',
											newPassword: '',
											confirmPassword: '',
										});
									}}
									className='rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600'
									disabled={isChangingPassword}
								>
									Hủy
								</button>
								<button
									type='submit'
									className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
									disabled={isChangingPassword}
								>
									{isChangingPassword
										? 'Đang lưu...'
										: 'Đổi mật khẩu'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default SettingPage;
