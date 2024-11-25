import logo from '@/assets/images/logo.jpg';
import Footer from '@/components/footer/footer';
import HeaderStudent from '@/components/header/student-header';
import ScrollToTop from '@/components/scroll-to-top';
import Navbar from '@/components/navbar/setting_navbar';

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';
import { useNavbar } from '@/contexts/use-navbar';
import { NavbarProvider } from '@/contexts/navbar-provider';

const Setting_Layout_Content = () => {
    const { isCollapsed } = useNavbar();


	
	return (
		<div className='flex min-h-screen flex-col'>
			<Helmet>
				<link rel='shortcut icon' href={logo} type='image/jpg' />
			</Helmet>
			<main className='mt-16 flex min-h-[calc(100vh-4rem)] w-full'>
					<Navbar />
					<div
						className={`w-full transition-all duration-300 ${
							isCollapsed ? 'ml-16' : 'ml-64'
						}`}
					>
						<div className='h-full w-full rounded-lg bg-white shadow-lg'>
							<Outlet />
						</div>
					</div>
				</main>
			<ScrollToTop />
		</div>
	);
};




const Setting_layout = () => {
	return (
		<NavbarProvider>
			<Setting_Layout_Content />
		</NavbarProvider>
	);
};

export default Setting_layout;