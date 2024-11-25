import { useNavbar } from '@/contexts/use-navbar';
import {
	faChartBar,
	faChevronLeft,
	faChevronRight,
	faComputer,
	faGear,
	faHistory,
	faQuestionCircle,
	faRightFromBracket,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
	title: string;
	path: string;
	icon: typeof faUser;
}

const mainNavItems: NavItem[] = [
	{
		title: 'Thông tin',
		path: '/dashboard/thong-tin',
		icon: faUser,
	},
	{
		title: 'Máy in',
		path: '/dashboard/may-in',
		icon: faComputer,
	},
	{
		title: 'Lịch sử in của sinh viên',
		path: '/dashboard/lich-su-in',
		icon: faHistory,
	},
	{
		title: 'Thống kê máy in',
		path: '/dashboard/thong-ke',
		icon: faChartBar,
	},
];

const utilityNavItems: NavItem[] = [
	{
		title: 'Cài đặt',
		path: '/dashboard/cai-dat',
		icon: faGear,
	},
	{
		title: 'Trợ giúp',
		path: '/dashboard/loi-thuong-gap',
		icon: faQuestionCircle,
	},
	{
		title: 'Đăng xuất',
		path: '/dashboard/dang-xuat',
		icon: faRightFromBracket,
	},
];

const NavLink: FC<{
	item: NavItem;
	isCollapsed: boolean;
	onLogout?: () => void;
}> = ({ item, isCollapsed, onLogout }) => {
	const location = useLocation();
	const isActive = location.pathname === item.path;

	const handleClick = (e: React.MouseEvent) => {
		if (item.path === '/dashboard/dang-xuat' && onLogout) {
			e.preventDefault();
			onLogout();
		}
	};

	return (
		<Link
			to={item.path}
			onClick={handleClick}
			className={`flex items-center px-4 py-3 transition-colors ${
				isActive
					? 'border-r-4 border-blue-600 bg-blue-600/10'
					: 'hover:bg-blue-600/10'
			}`}
		>
			<FontAwesomeIcon
				icon={item.icon}
				className={`text-lg ${
					isActive ? 'text-blue-700' : 'text-blue-600'
				} ${isCollapsed ? 'mr-0' : 'mr-3'}`}
			/>
			{!isCollapsed && (
				<span
					className={`whitespace-nowrap ${
						isActive ? 'font-medium text-blue-700' : 'text-gray-700'
					}`}
				>
					{item.title}
				</span>
			)}
		</Link>
	);
};

const Navbar: FC = () => {
	const { isCollapsed, setIsCollapsed } = useNavbar();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		sessionStorage.clear();
		navigate('/dang-nhap');
	};

	return (
		<nav
			className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ${
				isCollapsed ? 'w-16' : 'w-64'
			}`}
		>
			<div className='flex h-full flex-col'>
				<div className='flex flex-1 flex-col shadow-lg'>
					<div className='flex-1 overflow-y-auto'>
						{mainNavItems.map((item) => (
							<NavLink
								key={item.path}
								item={item}
								isCollapsed={isCollapsed}
							/>
						))}
					</div>

					<div className='mx-4 my-2 border-t border-gray-200' />

					<div className='mb-4'>
						{utilityNavItems.map((item) => (
							<NavLink
								key={item.path}
								item={item}
								isCollapsed={isCollapsed}
								onLogout={handleLogout}
							/>
						))}
					</div>
				</div>
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className='absolute -right-8 top-2 rounded-r bg-blue-600 p-2 text-white hover:bg-blue-500'
				>
					<FontAwesomeIcon
						icon={isCollapsed ? faChevronRight : faChevronLeft}
					/>
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
