import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface Printer {
	id: string;
	brand: string;
	model: string;
	paperQuantity: number;
	dateAdded: string;
	type: string;
	note: string;
	building: string;
	floor: string;
	status: string;
}

interface PrintHistory {
	id: string;
	monthYear: string;
	studentName: string;
	studentCode: string;
	printerName: string;
	printerCode: string;
	location: string;
	printedPages: number;
	dateTime: string;
	purpose: string;
	printerStatus: string;
	administrator: string;
	note: string;
}
const PRINT_HISTORY: PrintHistory[] = Array.from(
	{ length: 50 },
	(_, index) => ({
		id: `history_${index + 1}`,
		monthYear: `${Math.floor(Math.random() * 12) + 1}/2024`,
		studentName: `SV ${index + 1}`,
		studentCode: `MEOMEO${Math.floor(10000 + Math.random() * 90000)}`,
		printerName: `Máy ${index + 1}`,
		printerCode: `PR${Math.floor(1000 + Math.random() * 9000)}`,
		location: `H${(index % 3) + 1}-${Math.floor(100 + Math.random() * 900)}`,
		printedPages: Math.floor(1 + Math.random() * 100),
		dateTime: new Date(
			2024,
			Math.floor(Math.random() * 12),
			Math.floor(1 + Math.random() * 28),
		)
			.toISOString()
			.slice(0, 16)
			.replace('T', ' '),
		purpose: ['Bài tập', 'Cá nhân', 'Dự án', 'Nghiên cứu'][
			Math.floor(Math.random() * 4)
		],
		printerStatus: ['active', 'maintenance'][Math.floor(Math.random() * 2)],
		administrator: `Giáo viên ${Math.floor(1 + Math.random() * 5)}`,
		note: Math.random() > 0.7 ? 'Con vịt béo' : '',
	}),
);

const PrintHistory = () => {
	const [printers, setPrinters] = useState<Printer[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({
		printerName: '',
		printerId: '',
		location: '',
		status: '',
		month: '',
		printerType: '',
	});
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	useEffect(() => {
		const storedPrinters = localStorage.getItem('printers');
		if (storedPrinters) {
			setPrinters(JSON.parse(storedPrinters));
		}
	}, []);

	const filteredData = useMemo(() => {
		return PRINT_HISTORY.filter((record) => {
			const matchesSearch = record.studentCode
				.toLowerCase()
				.includes(searchText.toLowerCase());
			const matchesFilters = Object.entries(filters).every(
				([key, value]) => {
					if (!value) return true;
					const recordValue = record[key as keyof PrintHistory]
						?.toString()
						.toLowerCase();
					return recordValue?.includes(value.toLowerCase());
				},
			);
			return matchesSearch && matchesFilters;
		});
	}, [searchText, filters]);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredData.slice(startIndex, startIndex + pageSize);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / pageSize);

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
								placeholder='Tìm kiếm theo mã sinh viên'
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
						<div className='flex flex-wrap gap-4'>
							<select
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										printerName: e.target.value,
									}))
								}
								className='rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
							>
								<option value=''>Chọn máy in</option>
								{printers.map((printer) => (
									<option
										key={printer.id}
										value={printer.brand}
									>
										{printer.brand}
									</option>
								))}
							</select>

							<select
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										location: e.target.value,
									}))
								}
								className='rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
							>
								<option value=''>Chọn vị trí</option>
								{Array.from(
									new Set(
										printers.map(
											(p) => `${p.building}-${p.floor}`,
										),
									),
								).map((location) => (
									<option key={location} value={location}>
										{location}
									</option>
								))}
							</select>
							<select
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										status: e.target.value,
									}))
								}
								className='rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
							>
								<option value=''>Chọn trạng thái</option>
								{[
									['active', 'Hoạt động'],
									['maintenance', 'Bảo trì'],
								].map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>

							<select
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										month: e.target.value,
									}))
								}
								className='rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
							>
								<option value=''>Chọn tháng</option>
								{Array.from(
									{ length: 12 },
									(_, i) => i + 1,
								).map((month) => (
									<option
										key={month}
										value={month.toString()}
									>
										Tháng {month}/2024
									</option>
								))}
							</select>

							<select
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										printerType: e.target.value,
									}))
								}
								className='rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
							>
								<option value=''>Loại máy in</option>
								{Array.from(
									new Set(printers.map((p) => p.type)),
								).map((type) => (
									<option key={type} value={type}>
										{(() => {
											if (type === 'laser')
												return 'Laser';
											else if (type === 'inkjet')
												return 'Phun mực';
											else if (type === 'thermal')
												return 'Nhiệt';
											else if (type === 'multifunction')
												return 'Đa chức năng';
											else return type;
										})()}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full table-auto'>
							<thead>
								<tr className='border-b text-left'>
									<th className='p-4'>Tháng/Năm</th>
									<th className='p-4'>Sinh viên</th>
									<th className='p-4'>Mã SV</th>
									<th className='p-4'>Máy in</th>
									<th className='p-4'>Vị trí</th>
									<th className='p-4 text-center'>
										Số trang
									</th>
									<th className='p-4'>Thời gian</th>
									<th className='p-4'>Mục đích</th>
									<th className='p-4'>Trạng thái</th>
									<th className='p-4'>Quản trị</th>
									<th className='p-4'>Ghi chú</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((record) => (
									<tr
										key={record.id}
										className='border-b hover:bg-gray-50'
									>
										<td className='p-4'>
											{record.monthYear}
										</td>
										<td className='p-4'>
											<div className='font-medium'>
												{record.studentName}
											</div>
										</td>
										<td className='p-4'>
											{record.studentCode}
										</td>
										<td className='p-4'>
											<div className='font-medium'>
												{record.printerName}
											</div>
											<div className='text-sm text-gray-500'>
												{record.printerCode}
											</div>
										</td>
										<td className='p-4'>
											{record.location}
										</td>
										<td className='p-4 text-center'>
											{record.printedPages}
										</td>
										<td className='p-4'>
											{record.dateTime}
										</td>
										<td className='p-4'>
											{record.purpose}
										</td>
										<td className='p-4'>
											<span
												className={`inline-flex text-nowrap rounded-full px-2 py-1 text-xs font-semibold ${
													record.printerStatus ===
													'active'
														? 'bg-green-100 text-green-800'
														: record.printerStatus ===
															  'maintenance'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-red-100 text-red-800'
												}`}
											>
												{record.printerStatus ===
												'active'
													? 'Hoạt động'
													: 'Bảo trì'}
											</span>
										</td>
										<td className='p-4'>
											{record.administrator}
										</td>
										<td className='p-4'>
											{record.note && (
												<span
													className='tooltip'
													title={record.note}
												>
													{record.note.slice(0, 20)}
													{record.note.length > 20 &&
														'...'}
												</span>
											)}
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
		</div>
	);
};

export default PrintHistory;
