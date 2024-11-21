import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.jpg';
import { IconsHeader } from '@/components/header/icons-header';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink } from 'react-router-dom';
import { faBell, faCircleUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { se } from 'date-fns/locale';

export interface NavigationItem {
	path: string;
	label: string;
	icon: IconDefinition;
}

const navigationItems: NavigationItem[] = [
	{ path: '/', label: 'Trang chủ', icon: IconsHeader.home },
	{ path: 'https://lms.hcmut.edu.vn/', label: 'BKEL', icon: IconsHeader.school },
  { path: '/in-tai-lieu', label: 'In tài liệu', icon: IconsHeader.book },
  { path: '/thanh-toan', label: 'Thanh toán', icon: IconsHeader.book },
  { path: '/lich-su-in', label: 'Lịch sử in', icon: IconsHeader.book },

];

const StudentHeader = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const toggleMenu = () => setMenuOpen(!menuOpen);

	const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
		sessionStorage.removeItem('isAuthenticated');
		sessionStorage.removeItem('userType');
        navigate('/dang-nhap'); // thoát về login
    };

	return (
		<header className='sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'>
			<div className='mx-auto max-w-7xl px-4 sm:px-0'>
				<div className='flex h-16 items-center justify-between'>
					<div className='flex items-center gap-8'>
						<NavLink
							to='/'
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

					<div className="flex items-center gap-6">
            {/* Nút Thông báo */}
            <button
              className="group relative rounded-full p-2 text-blue-50 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Notifications"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              />
            </button>

            {/* Avatar với Dropdown Menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="h-8 w-8"
                />
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-700">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/my"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Hồ sơ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/quan-ly-tai-khoan"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Quản lý tài khoản
                      </Link>
                    </li>

                   
                    <li>
                      <Link
                        to="/help"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Hỗ trợ
                      </Link>
                    </li>
                    <li className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Thoát
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
				</div>
			</div>

			
		</header>
	);
};

export default StudentHeader;
