import { useNavbar } from '@/contexts/use-navbar';
import { faChevronLeft, faChevronRight, faUserLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
interface NavItem {
  title: string;
  path: string;
  icon: typeof faUser;
}

// Main navigation items
const mainNavItems: NavItem[] = [
  {
    title: 'Tài khoản',
    path: '/my/quan-ly-tai-khoan/tai-khoan',
    icon: faUser,
  },
  {
    title: 'Mật khẩu',
    path: '/my/quan-ly-tai-khoan/mat-khau',
    icon: faUserLock,
  },
];

// NavLink Component
const NavLink: FC<{
  item: NavItem;
  isCollapsed: boolean;
}> = ({ item, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
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

// Navbar Component
const Navbar: FC = () => {
  const { isCollapsed, setIsCollapsed } = useNavbar();

  return (
    <nav
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavLink key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-8 top-2 rounded-r bg-blue-600 p-2 text-white hover:bg-blue-500"
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
