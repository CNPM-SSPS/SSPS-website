import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
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

const SettingPage = () => {
	const [userInfo, setUserInfo] = useState<UserInfo>(MOCKED_USER);
	const [formData, setFormData] = useState<UserInfo>(MOCKED_USER);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
		if (storedUserInfo) {
			const parsedInfo = JSON.parse(storedUserInfo) as UserInfo;
			setUserInfo(parsedInfo);
			setFormData(parsedInfo);
		} else {
			localStorage.setItem('userInfo', JSON.stringify(MOCKED_USER));
			sessionStorage.setItem('userInfo', JSON.stringify(MOCKED_USER));		}
	}, []);

	const handleEdit = () => {
		setFormData(userInfo); // Cập nhật dữ liệu form từ `userInfo`
		setIsModalOpen(true); // Mở modal
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setUserInfo(formData);
		localStorage.setItem('userInfo', JSON.stringify(formData)); 
		sessionStorage.setItem('userInfo', JSON.stringify(formData));
		toast.success('Thông tin người dùng đã được cập nhật');
		setIsModalOpen(false);
	};

	const resetForm = () => {
		setFormData(userInfo); // Đặt lại formData từ thông tin hiện tại
		setIsModalOpen(false);
	};

	return (
		<>
			<Helmet>
				<title>Thông Tin Cá Nhân</title>
			</Helmet>
			<div className="flex h-screen items-center justify-center bg-gray-50">
				<div className="w-full max-w-4xl rounded-md bg-white p-6 shadow">
					<h1 className="mb-6 text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-600">Tên người dùng</label>
							<input
								type="text"
								value={userInfo.username}
								disabled
								className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">Giới tính</label>
							<input
								type="text"
								value={userInfo.sex}
								disabled
								className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">Địa chỉ liên lạc</label>
							<input
								type="email"
								value={userInfo.email}
								disabled
								className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">Năm sinh</label>
							<input
								type="date"
								value={userInfo.birthday}
								disabled
								className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
							<input
								type="text"
								value={userInfo.phone}
								disabled
								className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
							/>
						</div>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							onClick={handleEdit}
							className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
						>
							<FontAwesomeIcon icon={faEdit} className="mr-2" />
							Chỉnh sửa
						</button>
					</div>
				</div>
			</div>

			{/* Modal chỉnh sửa */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6">
						<h2 className="mb-4 text-xl font-bold">Chỉnh sửa thông tin</h2>
						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-4">
								{/* Các trường chỉnh sửa */}
								<div>
									<label className="block text-sm font-medium text-gray-700">Tên người dùng</label>
									<input
										type="text"
										value={formData.username}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												username: e.target.value,
											}))
										}
										className="mt-1 block w-full rounded-md border border-gray-300 p-2"
									/>
								</div>
								{/* Địa chỉ email */}
								<div>
									<label className="block text-sm font-medium text-gray-700">Địa Chỉ Email</label>
									<input
									type="email"
									required
									value={formData.email || ""}
									onChange={(e) =>
										setFormData((prev) => ({
										...prev,
										email: e.target.value,
										}))
									}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2"
									/>
								</div>

								{/* Số điện thoại */}
								<div>
									<label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
									<input
									type="text"
									required
									value={formData.phone || ""}
									onChange={(e) =>
										setFormData((prev) => ({
										...prev,
										phone: e.target.value,
										}))
									}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2"
									pattern="^[0-9]{10,11}$"
									title="Số điện thoại phải có từ 10 đến 11 chữ số"
									/>
								</div>

                    			{/* Giới tính */}
								<div>
									<label className="block text-sm font-medium text-gray-700">Giới Tính</label>
									<select
									required
									value={formData.sex}
									onChange={(e) =>
										setFormData((prev) => ({
										...prev,
										sex: e.target.value as UserInfo["sex"],
										}))
									}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2"
									>
									<option value="nam">Nam</option>
									<option value="nữ">Nữ</option>
									<option value="khác">Khác</option>
									</select>
								</div>

                    			{/* Năm sinh */}
								<div>
									<label className="block text-sm font-medium text-gray-700">Năm Sinh</label>
									<input
									type="date"
									required
									value={formData.birthday}
									onChange={(e) =>
										setFormData((prev) => ({
										...prev,
										birthday: e.target.value,
										}))
									}
									className="mt-1 block w-full rounded-md border border-gray-300 p-2"
									/>
								</div>


							</div>
							{/* Nút hành động */}
							<div className="mt-4 flex justify-end gap-4">
								<button
									type="button"
									onClick={resetForm}
									className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
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
				</div>
			)}
		</>
	);
};

export default SettingPage;
