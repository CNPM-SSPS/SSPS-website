import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
const MOCK_PRINT_RECORDS: PrintRecord[] = [
	{
		id: '1',
		printDateTime: '2024-10-01 09:15',
		documentName: 'Tài liệu Xác suất thống kê',
		documentFormat: 'PPT',
		documentSize: '3 MB',
		numberOfCopies: 2,
		paperSize: 'A3',
		colorOption: 'In màu',
		printType: 'In hai mặt',
		printerCode: 'M789',
		location: 'Thư viện tầng 1 tòa H3',
		printCost: '40 Tờ A3 (80 tờ A4)',
		status: 'Đã in',
		printError: 'Không có',
		technicalSupport: 'Hỗ trợ rất tốt',
	},
	{
		id: '2',
		printDateTime: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'PDF',
		documentSize: '15 MB',
		numberOfCopies: 1,
		paperSize: 'A4',
		colorOption: 'In đen trắng',
		printType: 'In hai mặt',
		printerCode: 'M456',
		location: 'Thư viện Duy Tân',
		printCost: '50 Tờ A4',
		status: 'Đã in',
		printError: 'Không có',
		technicalSupport: 'Không cần hỗ trợ',
	},
	{
		id: '3',
		printDateTime: '2024-10-05 10:30',
		documentName: 'Bài tập lớn môn thiết kế',
		documentFormat: 'DOCX',
		documentSize: '2.5 MB',
		numberOfCopies: 3,
		paperSize: 'A4',
		colorOption: 'In màu',
		printType: 'In một mặt',
		printerCode: 'M123',
		location: 'Thư viện Tạ Quang Bửu',
		printCost: '15 Tờ A4',
		status: 'Đã in',
		printError: 'Kẹt giấy - Đã xử lý',
		technicalSupport: 'Cần hỗ trợ kỹ thuật',
	},
];
const fetchPrintRecords = async (
	searchTerm: string,
	printerCode: string,
	location: string,
	startDate: string,
	endDate: string,
): Promise<PrintRecord[]> => {
	await new Promise((resolve) => setTimeout(resolve, 500));

	return MOCK_PRINT_RECORDS.filter((record) => {
		const matchesSearch = searchTerm
			? record.documentName
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			: true;
		const matchesPrinter = printerCode
			? record.printerCode === printerCode
			: true;
		const matchesLocation = location ? record.location === location : true;
		const recordDate = new Date(record.printDateTime);
		const matchesStartDate = startDate
			? recordDate >= new Date(startDate)
			: true;
		const matchesEndDate = endDate ? recordDate <= new Date(endDate) : true;

		return (
			matchesSearch &&
			matchesPrinter &&
			matchesLocation &&
			matchesStartDate &&
			matchesEndDate
		);
	});
};

interface PrintRecord {
	id: string;
	printDateTime: string;
	documentName: string;
	documentFormat: string;
	documentSize: string;
	numberOfCopies: number;
	paperSize: string;
	colorOption: string;
	printType: string;
	printerCode: string;
	location: string;
	printCost: string;
	status: string;
	printError: string;
	technicalSupport: string;
}

const PrintHistory = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [printerCode, setPrinterCode] = useState('');
	const [location, setLocation] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filteredRecords, setFilteredRecords] =
		useState<PrintRecord[]>(MOCK_PRINT_RECORDS);

	const availablePrinterCodes = Array.from(
		new Set(MOCK_PRINT_RECORDS.map((record) => record.printerCode)),
	);
	const availableLocations = Array.from(
		new Set(MOCK_PRINT_RECORDS.map((record) => record.location)),
	);

	useEffect(() => {
		const filterRecords = async () => {
			const records = await fetchPrintRecords(
				searchTerm,
				printerCode,
				location,
				startDate,
				endDate,
			);
			setFilteredRecords(records);
		};

		filterRecords();
	}, [searchTerm, printerCode, location, startDate, endDate]);

	const handleLoadMore = () => {
		toast.success('Load thêm lịch sử in');
	};

	return (
		<div className='mx-auto max-w-7xl px-4 py-6'>
			<Helmet>
				<title>Lịch Sử In | HCMUT</title>
			</Helmet>
			<h1 className='mb-6 text-2xl font-bold'>Lịch Sử In</h1>

			<div className='rounded-lg bg-white p-6 shadow'>
				<div className='mb-8 grid gap-6'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Nhập tên tài liệu để tìm kiếm lịch sử'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full rounded-lg border px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
						/>
					</div>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
						<div className='flex flex-col gap-1'>
							<label
								htmlFor='printerCode'
								className='text-sm font-medium text-gray-700'
							>
								Mã máy in
							</label>
							<select
								id='printerCode'
								value={printerCode}
								onChange={(e) => setPrinterCode(e.target.value)}
								className='rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
							>
								<option value=''>Tất cả máy in</option>
								{availablePrinterCodes.map((code) => (
									<option key={code} value={code}>
										Máy in {code}
									</option>
								))}
							</select>
						</div>

						<div className='flex flex-col gap-1'>
							<label
								htmlFor='location'
								className='text-sm font-medium text-gray-700'
							>
								Địa điểm máy in
							</label>
							<select
								id='location'
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								className='rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
							>
								<option value=''>Tất cả địa điểm</option>
								{availableLocations.map((loc) => (
									<option key={loc} value={loc}>
										{loc}
									</option>
								))}
							</select>
						</div>

						<div className='flex flex-col gap-1'>
							<label
								htmlFor='startDate'
								className='text-sm font-medium text-gray-700'
							>
								Từ ngày
							</label>
							<input
								id='startDate'
								type='date'
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className='rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
							/>
						</div>

						<div className='flex flex-col gap-1'>
							<label
								htmlFor='endDate'
								className='text-sm font-medium text-gray-700'
							>
								Đến ngày
							</label>
							<input
								id='endDate'
								type='date'
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className='rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					{filteredRecords.map((record) => (
						<div
							key={record.id}
							className='rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md'
						>
							<div className='mb-4 flex items-center justify-between border-b pb-4'>
								<div>
									<h3 className='text-lg font-medium text-gray-900'>
										{record.documentName}
									</h3>
									<p className='text-sm text-gray-500'>
										{record.printDateTime}
									</p>
								</div>
								<span
									className={`rounded-full px-3 py-1 text-sm font-medium ${
										record.status === 'Đã in'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}
								>
									{record.status}
								</span>
							</div>

							<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
								<div className='space-y-2'>
									<DetailItem
										label='Định dạng'
										value={record.documentFormat}
									/>
									<DetailItem
										label='Kích thước'
										value={record.documentSize}
									/>
									<DetailItem
										label='Số lượng bản'
										value={record.numberOfCopies.toString()}
									/>
									<DetailItem
										label='Khổ giấy'
										value={record.paperSize}
									/>
								</div>
								<div className='space-y-2'>
									<DetailItem
										label='Màu sắc'
										value={record.colorOption}
									/>
									<DetailItem
										label='Kiểu in'
										value={record.printType}
									/>
									<DetailItem
										label='Mã máy in'
										value={record.printerCode}
									/>
									<DetailItem
										label='Chi phí in'
										value={record.printCost}
									/>
								</div>
								<div className='space-y-2'>
									<DetailItem
										label='Địa điểm'
										value={record.location}
									/>
									<DetailItem
										label='Lỗi khi in'
										value={record.printError}
									/>
									<DetailItem
										label='Hỗ trợ kỹ thuật'
										value={record.technicalSupport}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				{filteredRecords.length > 0 && (
					<div className='mt-6 flex justify-center'>
						<button
							onClick={handleLoadMore}
							className='rounded-lg border border-blue-500 px-6 py-2.5 text-blue-500 transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
						>
							Xem thêm
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
const DetailItem = ({ label, value }: { label: string; value: string }) => (
	<div className='flex flex-col'>
		<span className='text-sm font-medium text-gray-500'>{label}</span>
		<span className='text-gray-900'>{value}</span>
	</div>
);

export default PrintHistory;
