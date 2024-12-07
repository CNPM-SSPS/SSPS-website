import { NavbarContext } from '@/contexts/navbar-context';
import { useMemo, useState } from 'react';

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const value = useMemo(
		() => ({
			isCollapsed,
			setIsCollapsed,
		}),
		[isCollapsed],
	);

	return (
		<NavbarContext.Provider value={value}>
			{children}
		</NavbarContext.Provider>
	);
};
