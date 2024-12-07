import CustomCheckbox from '@/components/ui/custom-checkbox';
import AuthLayout from '@/layouts/auth-layout';
import { faBuilding, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
type LoginType = 'student' | 'admin';

interface LoginResponse {
	user: {
		name: string;
		email: string;
		role: string;
		isEmailVerified: boolean;
		studentID?: string;
		department?: string;
		id: string;
		__t?: string;
	};
	tokens: {
		access: {
			token: string;
			expires: string;
		};
		refresh: {
			token: string;
			expires: string;
		};
	};
}

interface LoginFormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

interface ErrorResponse {
	code: number;
	message: string;
}

const LOGIN_MESSAGES = {
	success: 'Đăng nhập thành công',
	error: 'Có lỗi xảy ra khi đăng nhập',
	emptyFields: 'Vui lòng nhập đầy đủ thông tin',
	invalidCredentials: 'Email hoặc mật khẩu không chính xác',
} as const;

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [loginType, setLoginType] = useState<LoginType>('student');
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
		rememberMe: true,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { email, password } = formData;

		if (!email || !password) {
			toast.error(LOGIN_MESSAGES.emptyFields);
			return;
		}

		try {
			const response = await fetch('/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData: ErrorResponse = await response.json();
				if (errorData.code === 401) {
					throw new Error(LOGIN_MESSAGES.invalidCredentials);
				}
				throw new Error(LOGIN_MESSAGES.error);
			}
			const data: LoginResponse = await response.json();
			localStorage.setItem('accessToken', data.tokens.access.token);
			localStorage.setItem('refreshToken', data.tokens.refresh.token);
			localStorage.setItem('tokenExpires', data.tokens.access.expires);
			localStorage.setItem(
				'refreshTokenExpires',
				data.tokens.refresh.expires,
			);
			const storage = formData.rememberMe ? localStorage : sessionStorage;
			storage.setItem('isAuthenticated', 'true');
			storage.setItem('userRole', data.user.role);
			storage.setItem(
				'userData',
				JSON.stringify({
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
					studentID: data.user.studentID,
					department: data.user.department,
					isEmailVerified: data.user.isEmailVerified,
					__t: data.user.__t,
				}),
			);

			toast.success(LOGIN_MESSAGES.success);
			if (data.user.role === 'user') {
				navigate('/my');
			} else if (data.user.role === 'admin') {
				navigate('/dashboard/thong-tin');
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : LOGIN_MESSAGES.error,
			);
		}
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			rememberMe: e.target.checked,
		}));
	};

	return (
		<AuthLayout
			title={
				loginType === 'student'
					? 'Đăng nhập Sinh viên'
					: 'Đăng nhập Quản trị'
			}
			heading='Chào mừng đến với'
			subheading='Cổng thông tin HCMUT'
		>
			<div className='mb-8 flex justify-center gap-4'>
				<button
					onClick={() => setLoginType('student')}
					className={`flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
						loginType === 'student'
							? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					}`}
				>
					<FontAwesomeIcon icon={faUser} className='mr-2' />
					Sinh viên
				</button>
				<button
					onClick={() => setLoginType('admin')}
					className={`flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
						loginType === 'admin'
							? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					}`}
				>
					<FontAwesomeIcon icon={faBuilding} className='mr-2' />
					Quản trị
				</button>
			</div>

			<form className='space-y-6' onSubmit={handleSubmit}>
				<div className='space-y-4'>
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
									icon={faUser}
									className='text-blue-500'
								/>
							</div>
							<input
								id='email'
								name='email'
								type='email'
								required
								className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
								placeholder={
									loginType === 'student'
										? 'Email sinh viên'
										: 'Email quản trị'
								}
								value={formData.email}
								onChange={handleInputChange}
								autoFocus
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
								placeholder='Mật khẩu'
								value={formData.password}
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
					<CustomCheckbox
						id='remember-me'
						name='remember-me'
						checked={formData.rememberMe}
						onChange={handleCheckboxChange}
						label='Ghi nhớ đăng nhập'
					/>
					<Link
						to='/forgot-password'
						className='text-sm font-medium text-blue-600 hover:text-blue-500'
					>
						Quên mật khẩu?
					</Link>
				</div>

				<button
					type='submit'
					className='group relative flex w-full transform justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
				>
					Đăng nhập
				</button>
			</form>

			<div className='mt-6'>
				{loginType === 'student' && (
					<>
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
							to='/dang-ky'
							className='group mt-4 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 text-sm font-medium transition-all duration-300 hover:from-gray-100 hover:to-gray-200'
						>
							<span className='inline-flex items-center'>
								<span className='text-gray-600'>
									Chưa có tài khoản?
								</span>
								<span className='ml-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text font-semibold text-transparent group-hover:from-blue-700 group-hover:to-blue-900'>
									Đăng ký ngay
								</span>
							</span>
						</Link>
					</>
				)}
			</div>
		</AuthLayout>
	);
};

export default Login;
