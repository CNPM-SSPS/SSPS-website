import logo from '@/assets/images/logo.jpg';
import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const LoggedInHeader = () => {
	return (
		<header className='fixed left-0 right-0 top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'>
			<div className='mx-auto max-w-7xl px-4 sm:px-0'>
				<div className='flex h-16 items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Link
							to='/dashboard'
							className='group relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50'
						>
							<img
								src={logo}
								alt='Logo HCMUT'
								className='h-10 w-auto rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg'
							/>
						</Link>
						<div className='flex flex-col'>
							<span className='text-sm font-bold text-white'>
								HỆ THỐNG SSPS
							</span>
							<span className='text-xs text-blue-50'>
								TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHQG TPHCM
							</span>
						</div>
					</div>

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

						<div

							className='group relative flex items-center gap-2 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50'
						>
							<FontAwesomeIcon
								icon={faCircleUser}
								className='h-8 w-8'
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default LoggedInHeader;
