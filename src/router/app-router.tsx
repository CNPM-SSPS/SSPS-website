import CommonError from '@/pages/logged-in/common-error';
import PrintHistory from '@/pages/logged-in/history';
import Info from '@/pages/logged-in/info';
import Printer from '@/pages/logged-in/printer';
import { lazy, Suspense } from 'react';
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from 'react-router-dom';
import UsageReport from '../pages/logged-in/report';
const Login = lazy(() => import('@/pages/global/login'));
const Lorem = lazy(() => import('@/pages/global/lorem'));
const NotFound = lazy(() => import('@/pages/not-found'));
const Account = lazy(() => import('@/pages/student/Account') );
const Setting = lazy(() => import('@/pages/student/Setting') );
const RootLayout = lazy(() => import('@/layouts/root-layout'));
const LoggedInLayout = lazy(() => import('@/layouts/logged-in-layout'));
const StudentLayout = lazy(() => import('@/layouts/student-layout'));


const LoadingSpinner = () => (
	<div className='flex min-h-screen items-center justify-center'>
		<div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-l-transparent border-r-transparent' />
	</div>
);

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';

	if (!isAuthenticated) {
		return <Navigate to='/' replace />;
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
							<Setting />
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
