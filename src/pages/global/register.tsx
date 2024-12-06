import CustomCheckbox from '@/components/ui/custom-checkbox';
import AuthLayout from '@/layouts/auth-layout';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterFormData {
	studentId: string;
	email: string;
	password: string;
	confirmPassword: string;
	agreeToTerms: boolean;
	name: string;
	department: string;
}

interface RegisterResponse {
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		isEmailVerified: boolean;
		studentID: string;
		department: string;
	};
	data: {
		data: string;
		link: string;
	};
}

const REGISTER_MESSAGES = {
	success:
		'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
	passwordMismatch: 'Mật khẩu xác nhận không khớp',
	emptyFields: 'Vui lòng nhập đầy đủ thông tin',
	invalidStudentId: 'Mã số sinh viên không hợp lệ',
	invalidEmail: 'Email không hợp lệ',
	invalidName: 'Tên không được để trống',
	invalidDepartment: 'Vui lòng chọn khoa',
	emailTaken: 'Email này đã được sử dụng',
	serverError: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
} as const;

const Register: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<RegisterFormData>({
		studentId: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
		name: '',
		department: '',
	});

	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			agreeToTerms: e.target.checked,
		}));
	};

	const validateForm = (): boolean => {
		if (
			!formData.studentId ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword ||
			!formData.name ||
			!formData.department
		) {
			toast.error(REGISTER_MESSAGES.emptyFields);
			return false;
		}

		if (!/^\d+$/.test(formData.studentId)) {
			toast.error(REGISTER_MESSAGES.invalidStudentId);
			return false;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			toast.error(REGISTER_MESSAGES.invalidEmail);
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			toast.error(REGISTER_MESSAGES.passwordMismatch);
			return false;
		}

		if (
			formData.password.length < 8 ||
			!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
		) {
			toast.error(
				'Mật khẩu phải có ít nhất 8 ký tự và chứa cả chữ và số',
			);
			return false;
		}

		if (!formData.agreeToTerms) {
			toast.error('Vui lòng đồng ý với điều khoản sử dụng');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			const response = await axios.post<RegisterResponse>(
				'/v1/auth/register',
				{
					name: formData.name,
					email: formData.email,
					password: formData.password,
					studentID: formData.studentId,
					department: formData.department,
				},
			);

			toast.success(REGISTER_MESSAGES.success);

			if (response.data.data?.link) {
				toast.success(
					(t) => (
						<div
							onClick={async () => {
								try {
									await axios.get(response.data.data.link);
									toast.success('Xác thực email thành công');
									toast.dismiss(t.id);
								} catch {
									toast.error(
										'Xác thực email thất bại. Vui lòng thử lại sau',
									);
								}
							}}
							className='cursor-pointer hover:underline'
						>
							Nhấn vào đây để xác thực email của bạn
						</div>
					),
					{
						duration: 20000,
						style: {
							background: '#4CAF50',
							color: '#fff',
						},
					},
				);
			}

			navigate('/dang-nhap');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.message;

				const vietnameseMessage =
					errorMessage === 'Email already taken'
						? REGISTER_MESSAGES.emailTaken
						: (error.response?.data?.message ??
							REGISTER_MESSAGES.serverError);

				toast.error(vietnameseMessage);
			} else {
				toast.error(REGISTER_MESSAGES.serverError);
			}
		}
	};

	return (
		<AuthLayout
			title='Đăng ký tài khoản'
			heading='Đăng ký tài khoản'
			subheading='Cổng thông tin HCMUT'
		>
			<Toaster position='top-center' />
			<form className='space-y-6' onSubmit={handleSubmit}>
				<div className='space-y-4'>
					<div>
						<label
							htmlFor='name'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Họ và tên
						</label>
						<div className='relative'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faUser}
									className='text-blue-500'
								/>
							</div>
							<input
								id='name'
								name='name'
								type='text'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder='Nhập họ và tên'
								value={formData.name}
								onChange={handleFormChange}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='department'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Khoa
						</label>
						<div className='relative'>
							<select
								id='department'
								name='department'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-3 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								value={formData.department}
								onChange={handleFormChange}
							>
								<option value=''>Chọn khoa</option>
								<option value='CSE'>Khoa Máy tính</option>
								<option value='CEE'>Khoa Xây dựng</option>
								<option value='EEE'>Khoa Điện - Điện tử</option>
							</select>
						</div>
					</div>

					<div>
						<label
							htmlFor='studentId'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Mã số sinh viên
						</label>
						<div className='relative'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faUser}
									className='text-blue-500'
								/>
							</div>
							<input
								id='studentId'
								name='studentId'
								type='text'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder='Nhập mã số sinh viên'
								value={formData.studentId}
								onChange={handleFormChange}
								autoFocus
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='email'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Email
						</label>
						<div className='relative'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faEnvelope}
									className='text-blue-500'
								/>
							</div>
							<input
								id='email'
								name='email'
								type='email'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder='Nhập email'
								value={formData.email}
								onChange={handleFormChange}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Mật khẩu
						</label>
						<div className='relative'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faLock}
									className='text-blue-500'
								/>
							</div>
							<input
								id='password'
								name='password'
								type='password'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder='Nhập mật khẩu'
								value={formData.password}
								onChange={handleFormChange}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='confirmPassword'
							className='mb-1 block text-sm font-medium text-gray-700'
						>
							Xác nhận mật khẩu
						</label>
						<div className='relative'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<FontAwesomeIcon
									icon={faLock}
									className='text-blue-500'
								/>
							</div>
							<input
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder='Xc nhận mật khẩu'
								value={formData.confirmPassword}
								onChange={handleFormChange}
							/>
						</div>
					</div>
				</div>

				<CustomCheckbox
					id='agree-terms'
					name='agreeToTerms'
					checked={formData.agreeToTerms}
					onChange={handleCheckboxChange}
					label='Tôi đồng ý với điều khoản sử dụng'
				/>

				<button
					type='submit'
					className='group relative flex w-full transform justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
				>
					Đăng ký
				</button>
			</form>

			<div className='mt-6'>
				<div className='relative'>
					<div className='absolute inset-0 flex items-center'>
						<div className='w-full border-t border-gray-300' />
					</div>
					<div className='relative flex justify-center text-sm'>
						<span className='bg-white px-2 text-gray-500'>
							Hoặc
						</span>
					</div>
				</div>
				<Link
					to='/dang-nhap'
					className='group mt-4 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 text-sm font-medium transition-all duration-300 hover:from-gray-100 hover:to-gray-200'
				>
					<span className='inline-flex items-center'>
						<span className='text-gray-600'>Đã có tài khoản?</span>
						<span className='ml-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text font-semibold text-transparent group-hover:from-blue-700 group-hover:to-blue-900'>
							Đăng nhập ngay
						</span>
					</span>
				</Link>
			</div>
		</AuthLayout>
	);
};

export default Register;
