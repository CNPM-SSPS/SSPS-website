import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface PrintHistory {
	printDate: string;
	documentName: string;
	documentFormat: 'PDF' | 'docx';
	documentSize: number;
	printCount: number;
	paperSize: 'A4' | 'A3';
	colorMode: string;
	printType: string;
	printerCode: string;
	location: string;
	cost: string;
	status: string;
	printError: string;
	notes: string;
}

const mockData: PrintHistory[] = [
	{
		printDate: '2024-10-05 10:30',
		documentName: 'Hồ sơ giáo dục học thuật',
		documentFormat: 'PDF',
		documentSize: 2,
		printCount: 3,
		paperSize: 'A4',
		colorMode: 'In màu',
		printType: 'Một mặt',
		printerCode: 'M100',
		location: 'Tầng 1, H1',
		cost: '10,000 VND',
		status: 'Hoàn thành',
		printError: 'Không có',
		notes: 'Không có',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
	{
		printDate: '2024-10-02 14:45',
		documentName: 'Luận văn tốt nghiệp',
		documentFormat: 'docx',
		documentSize: 5,
		printCount: 12,
		paperSize: 'A3',
		colorMode: 'In đen trắng',
		printType: 'Hai mặt',
		printerCode: 'M456',
		location: 'Tầng 2, H6',
		cost: '30,000 VND',
		status: 'Lỗi',
		printError: 'Kẹt giấy',
		notes: 'Đã khắc phục',
	},
];

const PrintHistoryPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedPrinter, setSelectedPrinter] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [visibleCount, setVisibleCount] = useState(10);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const filteredData = mockData.filter((item) => {
		const matchesSearchTerm = item.documentName
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesPrinter =
			!selectedPrinter || item.printerCode === selectedPrinter;
		const matchesLocation =
			!selectedLocation || item.location === selectedLocation;

		const printDate = new Date(item.printDate);
		const matchesStartDate = !startDate || printDate >= startDate;
		const matchesEndDate = !endDate || printDate <= endDate;

		return (
			matchesSearchTerm &&
			matchesPrinter &&
			matchesLocation &&
			matchesStartDate &&
			matchesEndDate
		);
	});

	const loadMore = () => {
		setVisibleCount((prev) => prev + 10);
	};

	const displayedData = filteredData.slice(0, visibleCount);

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='mx-auto max-w-4xl bg-white p-8 shadow-md'>
				<h1 className='mb-4 text-2xl font-bold text-gray-800'>
					Lịch Sử In
				</h1>

				<div className='mb-6'>
					<div className='flex flex-wrap gap-4'>
						<input
							type='text'
							placeholder='Nhập tên tài liệu để tìm kiếm lịch sử'
							className='flex-grow rounded border px-4 py-2 shadow-sm'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<select
							className='rounded border px-4 py-2 shadow-sm'
							value={selectedPrinter}
							onChange={(e) => setSelectedPrinter(e.target.value)}
						>
							<option value=''>Mã máy in</option>
							<option value='M100'>M100</option>
							<option value='M456'>M456</option>
						</select>
						<select
							className='rounded border px-4 py-2 shadow-sm'
							value={selectedLocation}
							onChange={(e) =>
								setSelectedLocation(e.target.value)
							}
						>
							<option value=''>Địa điểm máy in</option>
							<option value='Tầng 1, H1'>Tầng 1, H1</option>
							<option value='Tầng 2, H6'>Tầng 2, H6</option>
						</select>
					</div>

					<div className='mt-4 flex gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Từ ngày:
							</label>
							<DatePicker
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								dateFormat='dd/MM/yyyy'
								className='mt-1 rounded border px-4 py-2 shadow-sm'
								placeholderText='Chọn ngày bắt đầu'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Đến ngày:
							</label>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								dateFormat='dd/MM/yyyy'
								className='mt-1 rounded border px-4 py-2 shadow-sm'
								placeholderText='Chọn ngày kết thúc'
							/>
						</div>
					</div>

					<button className='mt-4 rounded bg-yellow-500 px-4 py-2 text-white shadow-sm hover:bg-yellow-600'>
						Tìm kiếm
					</button>
				</div>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					{displayedData.map((item, index) => (
						<div
							key={index}
							className='rounded border bg-gray-100 p-4 shadow-sm'
						>
							<h2 className='text-lg font-semibold text-gray-700'>
								Lần In {index + 1}:
							</h2>
							<ul className='mt-2 text-gray-600'>
								<li>
									<strong>Ngày và giờ in:</strong>{' '}
									{item.printDate}
								</li>
								<li>
									<strong>Tên tài liệu:</strong>{' '}
									{item.documentName}
								</li>
								<li>
									<strong>Định dạng tài liệu:</strong>{' '}
									{item.documentFormat}
								</li>
								<li>
									<strong>Kích thước tài liệu:</strong>{' '}
									{item.documentSize} MB
								</li>
								<li>
									<strong>Số lượng bản in:</strong>{' '}
									{item.printCount}
								</li>
								<li>
									<strong>Khổ giấy:</strong> {item.paperSize}
								</li>
								<li>
									<strong>Màu sắc:</strong> {item.colorMode}
								</li>
								<li>
									<strong>Kiểu in:</strong> {item.printType}
								</li>
								<li>
									<strong>Mã máy in:</strong>{' '}
									{item.printerCode}
								</li>
								<li>
									<strong>Địa điểm:</strong> {item.location}
								</li>
								<li>
									<strong>Chi phí:</strong> {item.cost}
								</li>
								<li>
									<strong>Trạng thái:</strong> {item.status}
								</li>
								<li>
									<strong>Lỗi khi in:</strong>{' '}
									{item.printError}
								</li>
								<li>
									<strong>Ghi chú thêm:</strong> {item.notes}
								</li>
							</ul>
						</div>
					))}
				</div>

				{filteredData.length > displayedData.length && (
					<div className='mt-6 text-center'>
						<button
							onClick={loadMore}
							className='rounded-full bg-yellow-500 p-3 text-white hover:bg-yellow-600'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								className='mx-auto h-6 w-6'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default PrintHistoryPage;
