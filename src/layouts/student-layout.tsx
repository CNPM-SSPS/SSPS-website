import logo from '@/assets/images/logo.jpg';
import Footer from '@/components/footer/footer';
import HeaderStudent from '@/components/header/student-header';
import ScrollToTop from '@/components/scroll-to-top';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const StudentLayout = () => {
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
	const navigate = useNavigate();
	const location = useLocation(); 
  
	useEffect(() => {
	  if (isAuthenticated && location.pathname === '/my') {
		navigate('/my');
	  }
	}, [isAuthenticated, location.pathname, navigate]);


	
	return (
		<div className='flex min-h-screen flex-col'>
			<Helmet>
				<link rel='shortcut icon' href={logo} type='image/jpg' />
			</Helmet>
			<HeaderStudent />
			<main className='flex w-full flex-1 items-center justify-center'>
				<div className='w-full max-w-7xl'>
					<Outlet />
				</div>
			</main>
			<Footer />
			<ScrollToTop />
		</div>
	);
};

export default StudentLayout;
