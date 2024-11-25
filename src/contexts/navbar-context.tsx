import type { NavbarContextType } from '@/contexts/use-navbar';
import { createContext } from 'react';

export const NavbarContext = createContext<NavbarContextType | undefined>(
	undefined,
);
