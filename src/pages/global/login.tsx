import logo from '@/assets/images/logo.jpg';
import printImage from '@/assets/images/print-machine.jpg';
import CustomCheckbox from '@/components/ui/custom-checkbox';
import { faBuilding, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
type LoginType = 'student' | 'admin';

interface LoginFormData {
	username: string;
	password: string;
	rememberMe: boolean;
}
const DEMO_CREDENTIALS = {
	student: {
		username: '123456789',
		password: '123456789',
	},
	admin: {
		username: 'admin',
		password: 'admin',
	},
} as const;

const LOGIN_MESSAGES = {
	success: 'Đăng nhập thành công',
	invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không chính xác',
	emptyFields: 'Vui lòng nhập đầy đủ thông tin',
} as const;

const Login = () => {
	const navigate = useNavigate();
	const [loginType, setLoginType] = useState<LoginType>('student');
	const [formData, setFormData] = useState<LoginFormData>({
		username: '',
		password: '',
		rememberMe: false,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateCredentials = (
		type: LoginType,
		username: string,
		password: string,
	): boolean => {
		const credentials = DEMO_CREDENTIALS[type];
		return (
			credentials.username === username &&
			credentials.password === password
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	
		const { username, password } = formData;
	
		if (!username || !password) {
			toast.error(LOGIN_MESSAGES.emptyFields);
			return;
		}
	
		try {
			const isValid = validateCredentials(loginType, username, password);
	
			if (!isValid) {
				throw new Error(LOGIN_MESSAGES.invalidCredentials);
			}
	
			toast.success(LOGIN_MESSAGES.success);
	
			if (formData.rememberMe) {
				localStorage.setItem('isAuthenticated', 'true');
				localStorage.setItem('userType', loginType);
			} else {
				sessionStorage.setItem('isAuthenticated', 'true');
				sessionStorage.setItem('userType', loginType);
			}
	
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// admin vào dashboard, student vào my
			if (loginType === 'admin') {
				navigate('/dashboard');
			} else if (loginType === 'student') {
				navigate('/my'); 
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: LOGIN_MESSAGES.invalidCredentials,
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
		<>
			<Helmet>
				<title>
					{loginType === 'student'
						? 'Đăng nhập Sinh viên'
						: 'Đăng nhập Quản trị'}{' '}
					| HCMUT
				</title>
			</Helmet>

			<div className='w-full rounded-lg bg-gradient-to-br from-blue-50 to-white'>
				<div className='mx-auto flex flex-col lg:py-8'>
					<div className='flex flex-col items-center space-y-6 py-8 lg:flex-row lg:items-start lg:space-x-6'>
						<img
							src={logo}
							alt='Logo HCMUT'
							className='h-24 w-auto rounded-lg transition-transform hover:scale-105 sm:h-32'
						/>
						<h2 className='text-center text-3xl font-extrabold tracking-tight text-gray-900 lg:text-left'>
							Chào mừng đến với
							<br />
							<span className='mt-2 block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
								Cổng thông tin HCMUT
							</span>
						</h2>
					</div>

					<div className='flex flex-col items-center justify-between'>
						<div className='w-full'>
							<div className='grid gap-8 rounded-3xl bg-white/80 shadow-xl backdrop-blur-sm lg:grid-cols-2'>
								<div className='hidden lg:block'>
									<div className='relative h-full w-full overflow-hidden rounded-2xl'>
										<img
											src={printImage}
											alt='Printer'
											className='h-full w-full object-cover'
										/>
										<div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent' />
									</div>
								</div>

								<div className='flex flex-col justify-center p-8 lg:pl-8'>
									<div className='mb-8 flex justify-center gap-4'>
										<button
											onClick={() =>
												setLoginType('student')
											}
											className={`flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
												loginType === 'student'
													? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											}`}
										>
											<FontAwesomeIcon
												icon={faUser}
												className='mr-2'
											/>
											Sinh viên
										</button>
										<button
											onClick={() =>
												setLoginType('admin')
											}
											className={`flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
												loginType === 'admin'
													? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											}`}
										>
											<FontAwesomeIcon
												icon={faBuilding}
												className='mr-2'
											/>
											Quản trị
										</button>
									</div>

									<form
										className='space-y-6'
										onSubmit={handleSubmit}
									>
										<div className='space-y-4'>
											<div>
												<label
													htmlFor='username'
													className='mb-1 block text-sm font-medium text-gray-700'
												>
													Tên đăng nhập
												</label>
												<div className='relative'>
													<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
														<FontAwesomeIcon
															icon={faUser}
															className='text-blue-500'
														/>
													</div>
													<input
														id='username'
														name='username'
														type='text'
														required
														className='block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500'
														placeholder={
															loginType ===
															'student'
																? 'Mã số sinh viên'
																: 'Tên đăng nhập quản trị'
														}
														value={
															formData.username
														}
														onChange={
															handleInputChange
														}
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
														value={
															formData.password
														}
														onChange={
															handleInputChange
														}
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
													to='/register'
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
