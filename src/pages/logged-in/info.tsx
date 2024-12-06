import {
	faChevronRight,
	faFile,
	faPrint,
	faTriangleExclamation,
	faUser,
	faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
const DASHBOARD_DATA = {
	printers: {
		total: 40,
	},
	statistics: {
		errorsToday: 2,
		activePrinters: 38,
		usersPrinting: 100,
		pagesTotal: 2728,
		topUser: {
			name: 'Nguyễn Văn A',
			pages: 128,
		},
	},
};

interface StatCardProps {
	title: string;
	value: number | string;
	icon: typeof faPrint;
	subtitle?: string;
	className?: string;
}

const StatCard: FC<StatCardProps> = ({
	title,
	value,
	icon,
	subtitle,
	className,
}) => (
	<div className={`rounded-lg bg-white p-6 shadow-sm ${className}`}>
		<div className='flex items-center justify-between'>
			<div>
				<h3 className='text-sm font-medium text-gray-500'>{title}</h3>
				<p className='mt-2 text-2xl font-semibold'>{value}</p>
				{subtitle && (
					<p className='mt-1 text-sm text-gray-500'>{subtitle}</p>
				)}
			</div>
			<div className='rounded-full bg-blue-50 p-3'>
				<FontAwesomeIcon
					icon={icon}
					className='h-6 w-6 text-blue-500'
				/>
			</div>
		</div>
	</div>
);

const DashboardOverview: FC = () => {
	const { printers, statistics } = DASHBOARD_DATA;
	const activePrinters = printers.total - statistics.errorsToday;

	return (
		<>
			<Helmet>
				<title>Tổng Quan | HCMUT</title>
			</Helmet>

			<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
				<div className='mx-auto max-w-7xl space-y-8'>
					<section>
						<h2 className='mb-6 text-2xl font-bold text-gray-900'>
							Tổng Quan
						</h2>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
							<StatCard
								title='Số Lượng Máy In'
								value={printers.total}
								icon={faPrint}
								subtitle={`${activePrinters} đang hoạt động`}
							/>
							<StatCard
								title='Lỗi Hôm Nay'
								value={statistics.errorsToday}
								icon={faTriangleExclamation}
								className='bg-red-100'
							/>
							<StatCard
								title='Người Dùng Hoạt Động'
								value={statistics.usersPrinting}
								icon={faUsers}
							/>
						</div>
					</section>

					<section>
						<div className='mb-6 flex items-center justify-between'>
							<h2 className='mb-6 text-2xl font-bold text-gray-900'>
								Thống Kê Sử Dụng
							</h2>
							<Link
								to='/dashboard/thong-ke'
								className='flex items-center gap-1 text-blue-500 hover:text-blue-600'
							>
								Xem Chi Tiết
								<FontAwesomeIcon
									icon={faChevronRight}
									className='h-3 w-3'
								/>
							</Link>
						</div>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<StatCard
								title='Số Trang Đã In Hôm Nay'
								value={`${statistics.pagesTotal} trang`}
								icon={faFile}
							/>
							<div className='rounded-lg bg-white p-6 shadow-sm'>
								<div className='mb-4 flex items-center justify-between'>
									<h3 className='text-sm font-medium text-gray-500'>
										Người Sử Dụng Nhiều Nhất
									</h3>
								</div>
								<div className='flex items-center gap-4'>
									<div className='rounded-full bg-blue-50 p-3'>
										<FontAwesomeIcon
											icon={faUser}
											className='h-6 w-6 text-blue-500'
										/>
									</div>
									<div>
										<p className='font-semibold'>
											{statistics.topUser.name}
										</p>
										<p className='text-sm text-gray-500'>
											{statistics.topUser.pages} trang đã
											in
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default DashboardOverview;