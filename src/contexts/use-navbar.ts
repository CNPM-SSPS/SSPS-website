import { NavbarContext } from '@/contexts/navbar-context';
import { useContext } from 'react';
export interface NavbarContextType {
	isCollapsed: boolean;
	setIsCollapsed: (value: boolean) => void;
}

export const useNavbar = () => {
	const context = useContext(NavbarContext);
	if (!context) {
		throw new Error('useNavbar must be used within a NavbarProvider');
	}
	return context;
};
