import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface Printer {
	_id: string;
	room: string;
	building: string;
	campus: string;
	description: string;
	model: string;
	brand: string;
	enabled: boolean;
	deleted: boolean;
	dateAdded: string;
	lastModified: string;
	__v?: number;
}

interface PrintingFile {
	_id: string;
	user: string;
	fileName: string;
	fileType: string;
	pageSize: string;
	pageCount: number;
	printed: boolean;
	path: string;
	dateUploaded: string;
	__v: number;
}

interface PrintHistory {
	id: string;
	user: null | string;
	printer: Printer | null;
	printingFile: string | PrintingFile;
	status: string;
	printingErrorID: string | null;
	color: boolean;
	printType: 'single-sided' | 'two-sided';
	printCount: number;
	supportTicketID: string | null;
	totalCost: number;
	date: string;
}

const PrintHistory = () => {
	const token = localStorage.getItem('accessToken');
	const [printLogs, setPrintLogs] = useState<PrintHistory[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({
		printer: '',
		status: '',
		date: '',
		user: '',
		printType: '',
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedLog, setSelectedLog] = useState<PrintHistory | null>(null);
	const pageSize = 10;

	const fetchPrinters = useCallback(async () => {
		try {
			const response = await axios.get('/v1/officer/printinglog', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setPrintLogs(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					localStorage.clear();
				}
				toast.error('Không thể tải danh sách lịch sử in');
				console.error(error);
			}
		}
	}, []);

	useEffect(() => {
		fetchPrinters();
	}, [fetchPrinters]);

	const fetchPrintLogDetail = async (id: string) => {
		try {
			const response = await axios.get(`/v1/officer/printinglog/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setSelectedLog(response.data);
		} catch (error) {
			toast.error('Không thể tải thông tin chi tiết');
			console.error(error);
		}
	};

	const filteredData = useMemo(() => {
		return printLogs.filter((record) => {
			const matchesSearch =
				searchText === '' ||
				(record.user &&
					record.user
						.toLowerCase()
						.includes(searchText.toLowerCase()));

			const matchesFilters = Object.entries(filters).every(
				([key, value]) => {
					if (!value) return true;

					switch (key) {
						case 'printer':
							return (
								record.printer &&
								`${record.printer.building} ${record.printer.room}`
									.toLowerCase()
									.includes(value.toLowerCase())
							);

						case 'date':
							return record.date.split('T')[0] === value;

						case 'status':
							return (
								record.status.toLowerCase() ===
								value.toLowerCase()
							);

						case 'printType':
							return record.printType === value;

						case 'user':
							return (
								record.user &&
								record.user
									.toLowerCase()
									.includes(value.toLowerCase())
							);

						default:
							return true;
					}
				},
			);

			return matchesSearch && matchesFilters;
		});
	}, [searchText, filters, printLogs]);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredData.slice(startIndex, startIndex + pageSize);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / pageSize);

	const handleRowClick = (id: string) => {
		fetchPrintLogDetail(id);
	};

	return (
		<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
			<div className='mx-auto max-w-7xl space-y-6'>
				<Helmet>
					<title>Lịch Sử In | HCMUT</title>
				</Helmet>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>
						Lịch Sử In
					</h1>
				</div>

				<div className='rounded-lg bg-white p-6 shadow-lg'>
					<div className='mb-6 flex flex-col flex-wrap gap-4'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Tìm kiếm...'
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className='w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
								autoFocus
							/>
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
						</div>

						<div className='mb-6 flex flex-col gap-4'>
							<div className='flex gap-4'>
								<input
									type='text'
									placeholder='Người dùng'
									value={filters.user}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											user: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								/>

								<input
									type='text'
									placeholder='Máy in'
									value={filters.printer}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											printer: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								/>

								<select
									value={filters.status}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											status: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								>
									<option value=''>Trạng thái</option>
									<option value='success'>Thành công</option>
									<option value='error'>Thất bại</option>
								</select>

								<select
									value={filters.printType}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											printType: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								>
									<option value=''>Loại in</option>
									<option value='single-sided'>
										Một mặt
									</option>
									<option value='two-sided'>Hai mặt</option>
								</select>

								<input
									type='date'
									value={filters.date}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											date: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								/>
							</div>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full border-collapse border border-gray-300'>
							<thead>
								<tr>
									<th className='border border-gray-300 p-2'>
										Mã Tài Liệu
									</th>
									<th className='border border-gray-300 p-2'>
										Máy In
									</th>
									<th className='border border-gray-300 p-2'>
										Loại In
									</th>
									<th className='border border-gray-300 p-2'>
										Số Trang
									</th>
									<th className='border border-gray-300 p-2'>
										Chi Phí
									</th>
									<th className='border border-gray-300 p-2'>
										Thời Gian
									</th>
									<th className='border border-gray-300 p-2'>
										Trạng Thái
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((log) => (
									<tr
										key={log.id}
										onClick={() => handleRowClick(log.id)}
										className='cursor-pointer hover:bg-gray-100'
									>
										<td className='border border-gray-300 p-2'>
											{typeof log.printingFile ===
											'object'
												? log.printingFile.fileName
												: log.printingFile}
										</td>
										<td className='border border-gray-300 p-2'>
											{log.printer
												? `${log.printer.building} - Phòng ${log.printer.room}`
												: 'N/A'}
										</td>
										<td className='border border-gray-300 p-2'>
											<div className='flex flex-col'>
												<span>
													{log.color
														? 'Màu'
														: 'Đen trắng'}
												</span>
												<span className='text-sm text-gray-500'>
													{log.printType ===
													'two-sided'
														? 'In 2 mặt'
														: 'In 1 mặt'}
												</span>
											</div>
										</td>
										<td className='border border-gray-300 p-2 text-center'>
											{log.printCount}
										</td>
										<td className='border border-gray-300 p-2 text-right'>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(log.totalCost)}
										</td>
										<td className='border border-gray-300 p-2'>
											{new Date(log.date).toLocaleString(
												'vi-VN',
											)}
										</td>
										<td className='border border-gray-300 p-2'>
											<span
												className={`rounded-full px-2 py-1 text-sm ${
													log.status === 'success'
														? 'bg-green-100 text-green-800'
														: 'bg-red-100 text-red-800'
												}`}
											>
												{log.status === 'success'
													? 'Thành công'
													: 'Thất bại'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='mt-4 flex items-center justify-between'>
						<div className='text-sm text-gray-500'>
							Hiển thị {(currentPage - 1) * pageSize + 1} /{' '}
							{Math.min(
								currentPage * pageSize,
								filteredData.length,
							)}{' '}
							trong tổng số {filteredData.length} bản ghi
						</div>
						<div className='flex gap-2'>
							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1),
									)
								}
								disabled={currentPage === 1}
								className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50'
							>
								Trước
							</button>
							<span className='px-3 py-1'>
								Trang {currentPage} / {totalPages}
							</span>
							<button
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages),
									)
								}
								disabled={currentPage === totalPages}
								className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50'
							>
								Sau
							</button>
						</div>
					</div>
				</div>
			</div>
			{selectedLog && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4'>
					<div className='w-full max-w-2xl rounded-lg bg-white p-6'>
						<div className='mb-4 flex items-center justify-between'>
							<h2 className='text-lg font-medium text-gray-900'>
								Chi Tiết Lịch Sử In
							</h2>
							<button
								onClick={() => setSelectedLog(null)}
								className='text-gray-500 hover:text-gray-700'
							>
								✕
							</button>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-sm text-gray-500'>
									Tên Tập Tin
								</p>
								<p className='font-medium'>
									{typeof selectedLog.printingFile ===
									'object'
										? selectedLog.printingFile.fileName
										: selectedLog.printingFile}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Loại Tập Tin
								</p>
								<p className='font-medium'>
									{typeof selectedLog.printingFile ===
									'object'
										? selectedLog.printingFile.fileType
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Số Trang Tài Liệu
								</p>
								<p className='font-medium'>
									{typeof selectedLog.printingFile ===
									'object'
										? selectedLog.printingFile.pageCount
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Kích Thước
								</p>
								<p className='font-medium'>
									{typeof selectedLog.printingFile ===
									'object'
										? `${(parseInt(selectedLog.printingFile.pageSize) / 1024 / 1024).toFixed(2)} MB`
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Thời Gian Tải Lên
								</p>
								<p className='font-medium'>
									{typeof selectedLog.printingFile ===
									'object'
										? new Date(
												selectedLog.printingFile.dateUploaded,
											).toLocaleString('vi-VN')
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>Máy In</p>
								<p className='font-medium'>
									{selectedLog.printer
										? `${selectedLog.printer.building} - Phòng ${selectedLog.printer.room}`
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>Loại In</p>
								<p className='font-medium'>
									{selectedLog.color ? 'Màu' : 'Đen trắng'} -{' '}
									{selectedLog.printType === 'two-sided'
										? 'In 2 mặt'
										: 'In 1 mặt'}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Số Trang In
								</p>
								<p className='font-medium'>
									{selectedLog.printCount}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>Chi Phí</p>
								<p className='font-medium'>
									{new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND',
									}).format(selectedLog.totalCost)}
								</p>
							</div>
							<div>
								<p className='text-sm text-gray-500'>
									Thời Gian In
								</p>
								<p className='font-medium'>
									{new Date(selectedLog.date).toLocaleString(
										'vi-VN',
									)}
								</p>
							</div>
						</div>

						<div className='mt-6 flex justify-end'>
							<button
								onClick={() => setSelectedLog(null)}
								className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PrintHistory;
