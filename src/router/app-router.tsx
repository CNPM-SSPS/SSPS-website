import Register from '@/pages/global/register';
import CommonError from '@/pages/logged-in/common-error';
import PrintHistory from '@/pages/logged-in/history';
import TransactionHistory from '@/pages/logged-in/transactionhistory';
import Info from '@/pages/logged-in/info';
import Printer from '@/pages/logged-in/printer';
import PaymentPage from '@/pages/student/payment';
import { lazy, Suspense } from 'react';
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
	useLocation,
} from 'react-router-dom';
import SupportTicketPage from '@/pages/logged-in/supports';
const UsageReport = lazy(() => import('@/pages/logged-in/report'));
const PrintPage = lazy(() => import('@/pages/student/components/print'));
const Login = lazy(() => import('@/pages/global/login'));
const Lorem = lazy(() => import('@/pages/global/lorem'));
const NotFound = lazy(() => import('@/pages/not-found'));
const Account = lazy(() => import('@/pages/student/Account'));
const SettingPage = lazy(() => import('@/pages/student/Setting'));
const Help = lazy(() => import('@/pages/student/Help'));
const History_print = lazy(() => import('@/pages/student/History_Print'));

const RootLayout = lazy(() => import('@/layouts/root-layout'));
const LoggedInLayout = lazy(() => import('@/layouts/logged-in-layout'));
const StudentLayout = lazy(() => import('@/layouts/student-layout'));

const LoadingSpinner = () => (
	<div className='flex min-h-screen items-center justify-center'>
		<div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-l-transparent border-r-transparent' />
	</div>
);

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
							<Lorem />
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
			path: '/my',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<StudentLayout />
				</Suspense>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Account />
						</Suspense>
					),
				},

				{
					path: 'quan-ly-tai-khoan',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<SettingPage />
						</Suspense>
					),
				},

				{
					path: 'help',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<Help />
						</Suspense>
					),
				},
			],
		},
		{
			path: '/in-tai-lieu',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<StudentLayout />
				</Suspense>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<PrintPage />
						</Suspense>
					),
				},
			],
		},

		{
			path: '/lich-su-in',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<StudentLayout />
				</Suspense>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<History_print />
						</Suspense>
					),
				},
			],
		},
		{
			path: '/thanh-toan',
			element: (
				<Suspense fallback={<LoadingSpinner />}>
					<StudentLayout />
				</Suspense>
			),
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<PaymentPage />
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
					path: 'lich-su-giao-dich',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<TransactionHistory />
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
					path: 'ho-tro',
					element: (
						<Suspense fallback={<LoadingSpinner />}>
							<SupportTicketPage />
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
