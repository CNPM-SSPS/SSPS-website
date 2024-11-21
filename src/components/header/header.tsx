import logo from '@/assets/images/logo.jpg';
import { IconsHeader } from '@/components/header/icons-header';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { lazy, Suspense, useState } from 'react';
import { NavLink } from 'react-router-dom';

const MobileDrawer = lazy(() => import('@/components/header/mobile-drawer'));

export interface NavigationItem {
	path: string;
	label: string;
	icon: IconDefinition;
}

const navigationItems: NavigationItem[] = [
	{ path: '/', label: 'Trang chủ', icon: IconsHeader.home },
	{ path: 'https://lms.hcmut.edu.vn/', label: 'BKEL', icon: IconsHeader.school },
	{ path: '/in-tai-lieu', label: 'In tài liệu', icon: IconsHeader.book },
];

const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [shouldLoadDrawer, setShouldLoadDrawer] = useState(false);

	const handleOpenDrawer = () => {
		setShouldLoadDrawer(true);
		setIsDrawerOpen(true);
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
								{navigationItems.map((item) => (
									<li key={item.path}>
										<NavLink
											to={item.path}
											className={({ isActive }) =>
												`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
													isActive
														? 'bg-blue-500/20 text-white shadow-sm'
														: 'text-blue-50 hover:bg-blue-500/10 hover:text-white'
												} focus:outline-none focus:ring-2 focus:ring-white/50`
											}
										>
											<FontAwesomeIcon
												icon={item.icon}
												className='h-4 w-4 transition-transform duration-200 group-hover:scale-110'
											/>
											<span>{item.label}</span>
											<span className='absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-4/5' />
										</NavLink>
									</li>
								))}
							</ul>
						</nav>
					</div>

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
