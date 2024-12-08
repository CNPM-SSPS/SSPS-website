import logo from '@/assets/images/logo.jpg';
import { IconsHeader } from '@/components/header/icons-header';
import {
	faBell,
	faCircleUser,
	faSignOut,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { lazy, Suspense, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const MobileDrawer = lazy(() => import('@/components/header/mobile-drawer'));

export interface NavigationItem {
	path: string;
	label: string;
	icon: IconDefinition;
	isStudent?: boolean;
	isForce?: boolean;
	subItems?: {
		path: string;
		label: string;
	}[];
}

const navigationItems: NavigationItem[] = [
	{
		path: '/',
		label: 'Trang chủ',
		icon: IconsHeader.home,
		isStudent: true,
		isForce: true,
	},
	{
		path: '/student/quan-li-tai-khoan',
		label: 'Quản lí tài khoản',
		icon: IconsHeader.user,
		isStudent: true,
		isForce: false,
		subItems: [
			{
				path: '/student/quan-li-tai-khoan',
				label: 'Thông tin cá nhân',
			},
			{
				path: '/student/ho-tro',
				label: 'Yêu cầu hỗ trợ',
			},
		],
	},
	{
		path: 'https://lms.hcmut.edu.vn/',
		label: 'BKEL',
		icon: IconsHeader.school,
		isStudent: false,
		isForce: false,
	},
	{
		path: '/in-tai-lieu',
		label: 'In tài liệu',
		icon: IconsHeader.book,
		isStudent: true,
		isForce: true,
	},
	{
		path: '/student/thanh-toan',
		label: 'Thanh toán',
		icon: IconsHeader.moneyBill,
		isStudent: true,
		isForce: false,
	},
	{
		path: '/student/lich-su-in',
		label: 'Lịch sử in',
		icon: IconsHeader.history,
		isStudent: true,
		isForce: false,
	},
];

const Header: React.FC<{ isStudent: boolean }> = ({ isStudent }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [shouldLoadDrawer, setShouldLoadDrawer] = useState(false);
	const [showDropdown, setShowDropdown] = useState<string | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.nav-dropdown')) {
				setShowDropdown(null);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	const handleOpenDrawer = () => {
		setShouldLoadDrawer(true);
		setIsDrawerOpen(true);
	};

	const handleLogout = async () => {
		try {
			const refreshToken = localStorage.getItem('refreshToken');
			if (refreshToken) {
				await axios.post(
					'/api/auth/logout',
					{ refreshToken },
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);
			}
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			localStorage.clear();
			window.location.href = '/dang-nhap';
		}
	};

	return (
		<header className='sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'>
			<div className='mx-auto max-w-7xl px-4 sm:px-0'>
				<div className='flex h-16 items-center justify-between'>
					<div className='flex items-center gap-8'>
						<NavLink
							to='/dashboard'
							className='group relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50'
						>
							<img
								src={logo}
								alt='Logo HCMUT'
								className='h-10 w-auto rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg'
							/>
							<div className='absolute -inset-1 -z-10 rounded-lg bg-white/0 transition-all duration-300 group-hover:bg-white/10' />
						</NavLink>

						<nav className='hidden md:block'>
							<ul className='flex gap-2'>
								{navigationItems
									.filter(
										(item) =>
											item.isStudent === isStudent ||
											item.isForce,
									)
									.map((item) => (
										<li
											key={item.path}
											className='nav-dropdown group relative'
										>
											<NavLink
												to={item.path}
												className={({ isActive }) =>
													`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
														isActive
															? 'bg-blue-500/20 text-white shadow-sm'
															: 'text-blue-50 hover:bg-blue-500/10 hover:text-white'
													} focus:outline-none focus:ring-2 focus:ring-white/50`
												}
												onClick={(e) => {
													if (item.subItems) {
														e.preventDefault();
														setShowDropdown(
															showDropdown ===
																item.path
																? null
																: item.path,
														);
													}
												}}
											>
												<FontAwesomeIcon
													icon={item.icon}
													className='h-4 w-4 transition-transform duration-200 group-hover:scale-110'
												/>
												<span>{item.label}</span>
												{item.subItems && (
													<FontAwesomeIcon
														icon={
															IconsHeader.angleDown
														}
														className='ml-1 h-3 w-3'
													/>
												)}
												<span className='absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-4/5' />
											</NavLink>

											{item.subItems && (
												<div
													className={`absolute left-0 mt-1 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
														showDropdown ===
														item.path
															? 'block'
															: 'hidden'
													}`}
												>
													{item.subItems.map(
														(subItem) => (
															<NavLink
																key={
																	subItem.path
																}
																to={
																	subItem.path
																}
																className={({
																	isActive,
																}) =>
																	`block px-4 py-2 text-sm ${
																		isActive
																			? 'bg-gray-100 text-blue-600'
																			: 'text-gray-700 hover:bg-gray-50'
																	}`
																}
																onClick={() =>
																	setShowDropdown(
																		null,
																	)
																}
															>
																{subItem.label}
															</NavLink>
														),
													)}
												</div>
											)}
										</li>
									))}
							</ul>
						</nav>
					</div>
					{isStudent ? (
						<div className='flex items-center gap-6'>
							<button
								className='group relative rounded-full p-2 text-blue-50 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50'
								aria-label='Notifications'
							>
								<FontAwesomeIcon
									icon={faBell}
									className='h-5 w-5 transition-transform duration-200 group-hover:scale-110'
								/>
							</button>

							<div className='profile-dropdown relative'>
								<button
									onClick={() =>
										setShowDropdown((prev) =>
											prev === 'profile'
												? null
												: 'profile',
										)
									}
									className='group relative flex items-center gap-2 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50'
								>
									<FontAwesomeIcon
										icon={faCircleUser}
										className='h-8 w-8'
									/>
								</button>

								<div
									className={`absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
										showDropdown === 'profile'
											? 'scale-100 opacity-100'
											: 'pointer-events-none scale-95 opacity-0'
									}`}
								>
									<div className='py-1'>
										<button
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											onClick={() => {
												setShowDropdown(null);
												handleLogout();
											}}
										>
											<FontAwesomeIcon
												icon={faSignOut}
												className='h-4 w-4'
											/>
											<span>Đăng xuất</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					) : 
          (
						<div className='flex items-center gap-4'>
							<NavLink
								to='/dang-nhap'
								className='group hidden items-center gap-2 overflow-hidden rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-blue-600 shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 md:flex'
							>
								<FontAwesomeIcon
									icon={IconsHeader.signIn}
									className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5'
								/>
								<span className='transition-transform duration-300 group-hover:translate-x-0.5'>
									Đăng nhập
								</span>
							</NavLink>

							<button
								className='group relative rounded-md p-2 text-blue-50 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 md:hidden'
								onClick={handleOpenDrawer}
								aria-label='Open menu'
							>
								<FontAwesomeIcon
									icon={IconsHeader.bars}
									className='h-5 w-5 transition-transform duration-200 group-hover:scale-110'
								/>
								<span className='absolute inset-0 -z-10 rounded-md bg-white/0 transition-colors duration-200 group-hover:bg-white/10' />
							</button>
						</div>
					)
          }
				</div>
			</div>

			{shouldLoadDrawer && (
				<Suspense fallback={null}>
					<MobileDrawer
						isOpen={isDrawerOpen}
						onClose={() => setIsDrawerOpen(false)}
						navigationItems={[
							...navigationItems,
							{
								path: '/dang-nhap',
								label: 'Đăng nhập',
								icon: IconsHeader.signIn,
							},
						]}
					/>
				</Suspense>
			)}
		</header>
	);
};

export default Header;
