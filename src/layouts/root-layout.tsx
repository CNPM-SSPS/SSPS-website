import logo from '@/assets/images/logo.jpg';
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import StudentHeader from '@/components/header/student-header';

import ScrollToTop from '@/components/scroll-to-top';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';

const RootLayout = () => {
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
    const loginType = localStorage.getItem('userType') || sessionStorage.getItem('userType'); 
    const navigate = useNavigate();
	//dashboard nếu admin, trang chủ nếu user
    useEffect(() => {
        if (isAuthenticated) {
            if (loginType === 'admin') {
                navigate('/dashboard');
            } else if (loginType === 'student'){
                navigate('/');
            }
        }
    }, [isAuthenticated, loginType, navigate]);
	return (
		<div className='flex min-h-screen flex-col'>
			<Helmet>
				<link rel='shortcut icon' href={logo} type='image/jpg' />
			</Helmet> 
			
			{ loginType === 'student' ? <StudentHeader /> : <Header isStudent={false} />}

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

export default RootLayout;
