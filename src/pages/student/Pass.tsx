import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface UserInfo {
	username: string;
	email?: string;
	phone?: string;
	mssv?: string;
	remainingPages: number;
	sex: 'nam' | 'nữ' | 'khác';
	birthday: string;
	pass: string;
}

const MOCKED_USER: UserInfo = {
	username: 'Nguyễn Ngọc Không',
	email: 'abc@hcmut.edu.vn',
	phone: '03xx 1xx 9xx',
	mssv: '2xx2xxx',
	remainingPages: 1,
	sex: 'nam',
	birthday: '2000-01-01',
	pass: '123456',
};

const ChangePasswordPage = () => {
	const [formData, setFormData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const [userInfo, setUserInfo] = useState<UserInfo>(MOCKED_USER);

	// Hàm xử lý khi người dùng nhập thông tin
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Xác thực độ mạnh của mật khẩu mới
	const validatePasswordStrength = (password: string) => {
		const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return regex.test(password);
	};

	// Hàm xử lý khi gửi form
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Kiểm tra mật khẩu cũ có đúng không
		if (formData.oldPassword !== userInfo.pass) {
			toast.error('Mật khẩu cũ không chính xác!');
			return;
		}

		// Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
		if (formData.newPassword !== formData.confirmNewPassword) {
			toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
			return;
		}

		// Kiểm tra độ mạnh của mật khẩu mới
		if (!validatePasswordStrength(formData.newPassword)) {
			toast.error(
				'Mật khẩu mới phải chứa ít nhất 8 ký tự, bao gồm chữ hoa (A-Z), số (0-9) và ký tự đặc biệt(@$!%*?&)!'
			);
			return;
		}

		// Cập nhật mật khẩu thành công
		toast.success('Mật khẩu đã được thay đổi thành công!');
		setUserInfo((prev) => ({ ...prev, pass: formData.newPassword }));

		// Đặt lại form
		setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
	};

	return (
		<>
			<Helmet>
				<title>Thay Đổi Mật Khẩu</title>
			</Helmet>
			<div className="flex h-screen items-center justify-center bg-gray-50">
				<form
					onSubmit={handleSubmit}
					className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md"
				>
					<h1 className="mb-6 text-2xl font-bold text-gray-800">Thay đổi mật khẩu</h1>
					<div className="grid grid-cols-2 gap-4">
						{/* Mật khẩu cũ */}
						<div>
							<label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
							<input
								type="password"
								name="oldPassword"
								value={formData.oldPassword}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
								required
							/>
						</div>
						{/* Mật khẩu mới */}
						<div>
							<label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
							<input
								type="password"
								name="newPassword"
								value={formData.newPassword}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
								required
							/>
						</div>
						{/* Xác nhận mật khẩu mới */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Xác nhận mật khẩu mới
							</label>
							<input
								type="password"
								name="confirmNewPassword"
								value={formData.confirmNewPassword}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
								required
							/>
						</div>
					</div>
					{/* Nút hành động */}
					<div className="mt-6 flex justify-end gap-4">
						<button
							type="reset"
							className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							onClick={() =>
								setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' })
							}
						>
							Hủy
						</button>
						<button
							type="submit"
							className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							Cập nhật
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default ChangePasswordPage;
