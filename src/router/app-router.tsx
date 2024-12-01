import Register from '@/pages/global/register';
import CommonError from '@/pages/logged-in/common-error';
import PrintHistory from '@/pages/logged-in/history';
import Info from '@/pages/logged-in/info';
import Printer from '@/pages/logged-in/printer';
import UsageReport from '@/pages/logged-in/report';
import AccountPage from '@/pages/student/account';
import PaymentPage from '@/pages/student/payment';
import SupportPage from '@/pages/student/support';
import { lazy, Suspense } from 'react';
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
	useLocation,
} from 'react-router-dom';
import PrintPage from '../pages/student/components/print';
const Login = lazy(() => import('@/pages/global/login'));
const Home = lazy(() => import('@/pages/global/home'));
const NotFound = lazy(() => import('@/pages/not-found'));
const RootLayout = lazy(() => import('@/layouts/root-layout'));
const LoggedInLayout = lazy(() => import('@/layouts/logged-in-layout'));
const StudentHome = lazy(() => import('@/pages/student/home'));
const PrintHistoryPage = lazy(() => import('@/pages/student/print-history'));
const LoadingSpinner = () => (
	<div className='flex min-h-screen items-center justify-center'>
		<div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-l-transparent border-r-transparent' />
	</div>
);

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
	const location = useLocation();
	const isStudent = localStorage.getItem('userRole') === 'user';
	if (!isAuthenticated) {
		return <Navigate to='/' replace />;
	}
	if (isStudent && !location.pathname.includes('/student')) {
		return <Navigate to='/student' replace />;
	}
	return children;
};

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<RootLayout />
				</Suspense>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Home />
						</Suspense>
					),
				},
				{
					path: 'dang-nhap',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Login />
						</Suspense>
					),
				},
				{
					path: 'dang-ky',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Register />
						</Suspense>
					),
				},
			],
		},
		{
			path: '/dashboard',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<AuthGuard>
						<LoggedInLayout />
					</AuthGuard>
				</Suspense>
			),
			children: [
				{
					index: true,
					element: <Navigate to='thong-tin' replace />,
				},
				{
					path: 'thong-tin',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Info />
						</Suspense>
					),
				},
				{
					path: 'may-in',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Printer />
						</Suspense>
					),
				},
				{
					path: 'lich-su-in',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<PrintHistory />
						</Suspense>
					),
				},
				{
					path: 'thong-ke',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<UsageReport />
						</Suspense>
					),
				},
				{
					path: 'loi-thuong-gap',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<CommonError />
						</Suspense>
					),
				},
				{
					path: 'report',
					element: <UsageReport />,
				},
				{
					path: '*',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<NotFound />
						</Suspense>
					),
				},
			],
		},
		{
			path: '/student',
			element: (
				<AuthGuard>
					<LoggedInLayout />
				</AuthGuard>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<StudentHome />
						</Suspense>
					),
				},
				{
					path: 'quan-li-tai-khoan',
					element: <AccountPage />,
				},
				{
					path: 'ho-tro',
					element: <SupportPage />,
				},
				{
					path: 'in-tai-lieu',
					element: <PrintPage />,
				},
				{
					path: 'lich-su-in',
					element: <PrintHistoryPage />,
				},
				{
					path: 'thanh-toan',
					element: <PaymentPage />,
				},
				{
					path: '*',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<NotFound />
						</Suspense>
					),
				},
			],
		},
		{
			path: '*',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<NotFound />
				</Suspense>
			),
		},
	],
	{
		future: {
			v7_skipActionErrorRevalidation: true,
			v7_relativeSplatPath: true,
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
		},
	},
);

const AppRouter = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;
