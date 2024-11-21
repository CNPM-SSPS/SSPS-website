import { type NavigationItem } from '@/components/header/header';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FC } from 'react';
import { NavLink } from 'react-router-dom';

interface MobileDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	navigationItems: NavigationItem[];
}

const MobileDrawer: FC<MobileDrawerProps> = ({
	isOpen,
	onClose,
	navigationItems,
}) => {
	return (
		<>
			<div
				className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
					isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
				}`}
				onClick={onClose}
			/>

			<div
				className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className='p-4'>
					<button
						onClick={onClose}
						className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>

					<nav className='mt-8'>
						<ul className='space-y-4'>
							{navigationItems.map((item) => (
								<li key={item.path}>
									<NavLink
										to={item.path}
										className={({ isActive }) =>
											`flex items-center gap-2 rounded-md p-2 ${
												isActive
													? 'bg-blue-50 text-blue-600'
													: 'text-gray-600'
											}`
										}
										onClick={onClose}
									>
										<FontAwesomeIcon icon={item.icon} />
										<span>{item.label}</span>
									</NavLink>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>
		</>
	);
};

export default MobileDrawer;
