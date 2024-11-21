import logo from '@/assets/images/logo.jpg';
import Footer from '@/components/footer/footer';
import LoggedInHeader from '@/components/header/logged-in-header';
import Navbar from '@/components/navbar/navbar';
import ScrollToTop from '@/components/scroll-to-top';
import { NavbarProvider } from '@/contexts/navbar-provider';
import { useNavbar } from '@/contexts/use-navbar';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

const LoggedInLayoutContent = () => {
	const { isCollapsed } = useNavbar();

	return (
		<div className='flex min-h-screen flex-col'>
			<Helmet>
				<link rel='shortcut icon' href={logo} type='image/jpg' />
			</Helmet>
			<div className='flex min-h-screen items-center justify-center bg-white p-4 text-center md:hidden'>
				<h1 className='text-xl font-semibold text-gray-800'>
					Vui lòng truy cập trên máy tính
				</h1>
			</div>
			<div className='hidden min-h-screen w-full flex-col md:flex'>
				<LoggedInHeader />
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
				<Footer />
				<ScrollToTop />
			</div>
		</div>
	);
};

const LoggedInLayout = () => {
	return (
		<NavbarProvider>
			<LoggedInLayoutContent />
		</NavbarProvider>
	);
};

export default LoggedInLayout;
