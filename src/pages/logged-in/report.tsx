import {
	faFileExcel,
	faFilePdf,
	faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

type ReportPeriod = 'day' | 'week' | 'month';

interface UsageRecord {
	time: string;
	user: string;
	pages: number;
	fileName: string;
	fileType: string;
}
const MOCK_DATA: UsageRecord[] = [
	...Array.from({ length: 25 }, (_, i) => ({
		time: `${(i + 1).toString().padStart(2, '0')}:00 AM`,
		user: `User ${i + 1}`,
		pages: Math.floor(Math.random() * 50) + 1,
		fileName: `File ${i + 1}.pdf`,
		fileType: 'pdf',
	})),
];

const ITEMS_PER_PAGE = 10;

const UsageReport = () => {
	const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('day');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedMonth, setSelectedMonth] = useState(
		new Date().getMonth() + 1,
	);
	const [dateRange, setDateRange] = useState({
		start: format(new Date(), 'yyyy-MM-dd'),
		end: format(new Date(), 'yyyy-MM-dd'),
	});
	const [currentPage, setCurrentPage] = useState(1);

	const getFileIcon = (fileName: string) => {
		if (fileName.endsWith('.pdf')) return faFilePdf;
		if (fileName.endsWith('.docx') || fileName.endsWith('.doc'))
			return faFileWord;
		return faFileExcel;
	};

	const totalPages = Math.ceil(MOCK_DATA.length / ITEMS_PER_PAGE);

	const currentData = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return MOCK_DATA.slice(start, start + ITEMS_PER_PAGE);
	}, [currentPage]);

	const getPaginationNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		pages.push(1);

		const startPage = Math.max(2, currentPage - 1);
		const endPage = Math.min(totalPages - 1, currentPage + 1);

		if (startPage > 2) pages.push('...');

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < totalPages - 1) pages.push('...');

		pages.push(totalPages);

		return pages;
	};

	const renderDateSelector = () => {
		if (reportPeriod === 'week') {
			return (
				<div className='flex items-center gap-2'>
					<span>Từ:</span>
					<input
						type='date'
						value={dateRange.start}
						onChange={(e) =>
							setDateRange((prev) => ({
								...prev,
								start: e.target.value,
							}))
						}
						className='rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<span>Đến:</span>
					<input
						type='date'
						value={dateRange.end}
						onChange={(e) =>
							setDateRange((prev) => ({
								...prev,
								end: e.target.value,
							}))
						}
						className='rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
			);
		}

		if (reportPeriod === 'month') {
			return (
				<div className='flex items-center'>
					<span className='mr-2'>Tháng:</span>
					<select
						value={selectedMonth}
						onChange={(e) =>
							setSelectedMonth(Number(e.target.value))
						}
						className='rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					>
						{Array.from({ length: 12 }, (_, i) => i + 1).map(
							(month) => (
								<option key={month} value={month}>
									{month}
								</option>
							),
						)}
					</select>
				</div>
			);
		}

		return (
			<div className='flex items-center'>
				<span className='mr-2'>Ngày:</span>
				<input
					type='date'
					value={format(selectedDate, 'yyyy-MM-dd')}
					onChange={(e) => setSelectedDate(new Date(e.target.value))}
					className='rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
			</div>
		);
	};

	return (
		<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
			<div className='mx-auto max-w-7xl space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>
						Báo Cáo Sử Dụng
					</h1>
				</div>

				<div className='rounded-lg bg-white p-6 shadow-lg'>
					<div className='mb-6 flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex items-center'>
								<span className='mr-2'>
									Báo cáo sử dụng theo:
								</span>
								<select
									value={reportPeriod}
									onChange={(e) =>
										setReportPeriod(
											e.target.value as ReportPeriod,
										)
									}
									className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
								>
									<option value='day'>Ngày</option>
									<option value='week'>Tuần</option>
									<option value='month'>Tháng</option>
								</select>
							</div>

							{renderDateSelector()}
						</div>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full table-auto'>
							<thead>
								<tr className='border-b text-left'>
									<th className='p-4 text-sm font-medium text-gray-700'>
										Thời Gian
									</th>
									<th className='p-4 text-sm font-medium text-gray-700'>
										Người Sử Dụng
									</th>
									<th className='p-4 text-sm font-medium text-gray-700'>
										Số Lượng Trang Đã In
									</th>
									<th className='p-4 text-sm font-medium text-gray-700'>
										Tên Tài Liệu
									</th>
								</tr>
							</thead>
							<tbody>
								{currentData.map((record) => (
									<tr
										key={`${record.time}-${record.user}-${record.fileName}`}
										className='border-b hover:bg-gray-50'
									>
										<td className='p-4 text-sm text-gray-500'>
											{record.time}
										</td>
										<td className='p-4 text-sm text-gray-900'>
											{record.user}
										</td>
										<td className='p-4 text-sm text-gray-500'>
											{record.pages}
										</td>
										<td className='p-4 text-sm text-gray-900'>
											<div className='flex items-center'>
												<FontAwesomeIcon
													icon={getFileIcon(
														record.fileName,
													)}
													className='mr-2 text-gray-400'
												/>
												{record.fileName}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='mt-4 flex items-center justify-between'>
						<div className='text-sm text-gray-500'>
							Trang {currentPage} trên tổng {totalPages} trang
						</div>
						<div className='flex gap-2'>
							{getPaginationNumbers().map((page) => (
								<button
									key={
										typeof page === 'number'
											? `page-${page}`
											: `ellipsis-${page}`
									}
									onClick={() => {
										if (typeof page === 'number') {
											setCurrentPage(page);
										}
									}}
									disabled={page === '...'}
									className={`rounded px-3 py-1 ${
										page === currentPage
											? 'bg-blue-600 text-white'
											: page === '...'
												? 'text-gray-400'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									{page}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsageReport;