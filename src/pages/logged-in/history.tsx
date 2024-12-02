import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import axios from 'axios';

// interface Printer {
// 	id: string;
// 	room: string;
// 	building: string;
// 	campus: string;
// 	description: string;
// 	model: string;
// 	brand: string;
// 	enable: boolean;
// 	delete: boolean;
// 	dateAdded: string;
// 	lastmodified: string;
// }
// interface StudentInfo {
// 	id: string;
// 	name: string;
// 	email: string;
// 	studentID: string;
// 	department: string;
// 	isEmailVerified: boolean;
// 	paper: number[];
// 	role: string;
// 	__t: 'Student';
// }

interface PrintHistory {
	id: string;
	date: string;   //monthYear: string;  	dateTime: string;
	user: string;   // studentName: string;  // studentCode: string;
	printer: string; // printerName: string; // printerCode: string;  //location: string;
	printCount: 2 //printedPages: number;
	//purpose: string; không có
	status: string //printerStatus: string;
	printType: string; 
	totalCost: number
	color: boolean
	//administrator: string; không rõ
	//note: string; không rõ
}
// const PRINT_HISTORY: PrintHistory[] = Array.from(
// 	{ length: 50 },
// 	(_, index) => ({
// 		id: `history_${index + 1}`,
// 		monthYear: `${Math.floor(Math.random() * 12) + 1}/2024`,
// 		studentName: `SV ${index + 1}`,
// 		studentCode: `MEOMEO${Math.floor(10000 + Math.random() * 90000)}`,
// 		printerName: `Máy ${index + 1}`,
// 		printerCode: `PR${Math.floor(1000 + Math.random() * 9000)}`,
// 		location: `H${(index % 3) + 1}-${Math.floor(100 + Math.random() * 900)}`,
// 		printedPages: Math.floor(1 + Math.random() * 100),
// 		dateTime: new Date(
// 			2024,
// 			Math.floor(Math.random() * 12),
// 			Math.floor(1 + Math.random() * 28),
// 		)
// 			.toISOString()
// 			.slice(0, 16)
// 			.replace('T', ' '),
// 		purpose: ['Bài tập', 'Cá nhân', 'Dự án', 'Nghiên cứu'][
// 			Math.floor(Math.random() * 4)
// 		],
// 		printerStatus: ['active', 'maintenance'][Math.floor(Math.random() * 2)],
// 		administrator: `Giáo viên ${Math.floor(1 + Math.random() * 5)}`,
// 		note: Math.random() > 0.7 ? 'Con vịt béo' : '',
// 	}),
// );

const PrintHistory = () => {
	const [printLogs, setPrintLogs] = useState<PrintHistory[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({
		printer: '',
		status: '',
		date: '',
		user: '',
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedLog, setSelectedLog] = useState<PrintHistory | null>(null);
	const pageSize = 10;

	// Fetch all print logs
	const fetchPrintLogs = async () => {
		try {
			const response = await axios.get('/v1/officer/printinglog');
			setPrintLogs(response.data);
		} catch (error) {
			toast.error('Không thể tải danh sách lịch sử in');
			console.error(error);
		}
	};

	// Fetch detailed info of a specific print log
	const fetchPrintLogDetail = async (id: string) => {
		try {
			const response = await axios.get(`/v1/student/printinglog/${id}`);
			setSelectedLog(response.data);
		} catch (error) {
			toast.error('Không thể tải thông tin chi tiết');
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPrintLogs();
	}, []);

	// Filtered data based on search and filters
	const filteredData = useMemo(() => {
		return printLogs.filter((record) => {
			const matchesSearch = record.user
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
	}, [searchText, filters, printLogs]);

	// Paginate data
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredData.slice(startIndex, startIndex + pageSize);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / pageSize);

	const handleRowClick = (id: string) => {
		fetchPrintLogDetail(id);
	};

	// function filterPrintHistory(
	// 	data: PrintHistory[],
	// 	filters: {
	// 		user?: string;
	// 		date?: string; 
	// 		printer?: string;
	// 	}
	// ): PrintHistory[] {
	// 	return data.filter((record) => {
	// 		const matchesUser = filters.user
	// 			? record.user.toLowerCase().includes(filters.user.toLowerCase())
	// 			: true;
	
	// 		const matchesDate = filters.date
	// 			? record.date === filters.date
	// 			: true;
	
	// 		const matchesPrinter = filters.printer
	// 			? record.printer.toLowerCase().includes(filters.printer.toLowerCase())
	// 			: true;
	
	// 		return matchesUser && matchesDate && matchesPrinter;
	// 	});
	// }



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

						<div className='mb-6 flex flex-col gap-4'>
							<div className='flex gap-4'>
								<input
									type='text'
									placeholder='Người dùng'
									value={filters.user}
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, user: e.target.value }))
									}
									className='rounded-md border border-gray-300 p-2'
								/>

								<input
									type='text'
									placeholder='Máy in'
									value={filters.printer}
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, printer: e.target.value }))
									}
									className='rounded-md border border-gray-300 p-2'
								/>

								<select
									value={filters.status}
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, status: e.target.value }))
									}
									className='rounded-md border border-gray-300 p-2'
								>
									<option value=''>Trạng thái</option>
									<option value='Hoạt Động'>Hoạt Động</option>
									<option value='Hết mực'>Hết mực</option>
								</select>



								<input
									type='date'
									value={filters.date}
									onChange={(e) =>
										setFilters((prev) => ({ ...prev, date: e.target.value }))
									}
									className='rounded-md border border-gray-300 p-2'
								/>
							</div>
						</div>

						
					</div>

					<div className='overflow-x-auto'>
						<table className="w-full border-collapse border border-gray-300">
							<thead>
								<tr>
									<th className="border border-gray-300 p-2">Người dùng</th>
									<th className="border border-gray-300 p-2">Máy in</th>
									<th className="border border-gray-300 p-2">Số trang in</th>
									<th className="border border-gray-300 p-2">Ngày</th>
									<th className="border border-gray-300 p-2">Trạng thái</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((log) => {
									const { id, user, printer, printCount, date, status } = log;

									return (
										<tr
											key={id}
											onClick={() => handleRowClick(id)}
											className="cursor-pointer hover:bg-gray-100"
										>
											{/* Hiển thị từng cột của dòng */}
											<td className="border border-gray-300 p-2">{user}</td>
											<td className="border border-gray-300 p-2">{printer}</td>
											<td className="border border-gray-300 p-2">{printCount}</td>
											<td className="border border-gray-300 p-2">{date}</td>
											<td className="border border-gray-300 p-2">{status}</td>
										</tr>
									);
								})}
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
