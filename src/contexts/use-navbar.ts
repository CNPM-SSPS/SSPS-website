import { useContext } from 'react';
import { NavbarContext } from './navbar-context';

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
