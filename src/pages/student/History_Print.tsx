import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format } from 'date-fns';
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

const PrintHistoryPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedPrinter, setSelectedPrinter] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [visibleCount, setVisibleCount] = useState(10);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
  const [fetchedData, setFetchedData] = useState([]); // State for data

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
		// Define a function for fetching data
		const fetchData = async () => {
				const response = await axios.get('/v1/student/printinglog', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
				});

        setFetchedData(response.data);
		};

		fetchData(); // Call the fetch function
	}, []); // Empty dependency array ensures this runs once when the component mounts

	const loadMore = () => {
		setVisibleCount((prev) => prev + 10);
	};

  const filteredData = fetchedData.filter((item) => {
    const matchesSearchTerm = item.printingFile.some((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
		const matchesPrinter =
			!selectedPrinter || item.printer.model === selectedPrinter;
		const matchesLocation =
			!selectedLocation || (item.printer.building + '-' + item.printer.room) === selectedLocation;

		const printDate = new Date(item.date);
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

	const displayedData = filteredData.slice(0, visibleCount);

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='mx-auto max-w-4xl bg-white p-8 shadow-md'>
				<h1 className='mb-4 text-2xl font-bold text-gray-800'>
					Lịch Sử In
				</h1>

        {/* filter */}
				<div className='mb-6'>
					<div className='flex flex-wrap gap-4'>
						<input
							type='text'
							placeholder='Nhập tên tài liệu để tìm kiếm lịch sử'
							className='flex-grow rounded border px-4 py-2 shadow-sm'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{/* <select
							className='rounded border px-4 py-2 shadow-sm'
							value={selectedPrinter}
							onChange={(e) => setSelectedPrinter(e.target.value)}
						>
							<option value=''>Mã máy in</option>
							<option value='M100'>M100</option>
							<option value='M456'>M456</option>
						</select> */}
            <input
              type="text"
              className="rounded border px-4 py-2 shadow-sm"
              placeholder="Mã máy in"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            />

						{/* <select
							className='rounded border px-4 py-2 shadow-sm'
							value={selectedLocation}
							onChange={(e) =>
								setSelectedLocation(e.target.value)
							}
						>
							<option value=''>Địa điểm máy in</option>
							<option value='Tầng 1, H1'>Tầng 1, H1</option>
							<option value='Tầng 2, H6'>Tầng 2, H6</option>
						</select> */}

            <input
              type="text"
              className="rounded border px-4 py-2 shadow-sm"
              placeholder="Địa điểm máy in"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
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

        {/* data displayed here */}
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
									{format(new Date(item.date), 'dd/MM/yyyy HH:mm')}
								</li>
								<li>
									<strong>Tên tài liệu:</strong>{' '}
									{item.printingFile.map((file) => file.fileName).join(', ')}
								</li>
								<li>
									<strong>Số lượng bản in:</strong>{' '}
									{item.printCount}
								</li>
								<li>
									<strong>Khổ giấy:</strong> {item.printingFile.map((file) => file.pageSize).join(', ')}
								</li>
								<li>
									<strong>Màu sắc:</strong> {item.color === true ? 'Màu' : 'Đen trắng'}
								</li>
								<li>
									<strong>Kiểu in:</strong> {item.printType}
								</li>
								<li>
									<strong>Mã máy in:</strong>{' '}
									{item.printer.model}
								</li>
								<li>
									<strong>Địa điểm:</strong> {item.printer.building + '-' + item.printer.room}
								</li>
								<li>
									<strong>Chi phí:</strong> {item.totalCost}
								</li>
								<li>
									<strong>Trạng thái:</strong> {item.status === 'success' ? 'Hoàn thành' : 'Lỗi'}
								</li>
								<li>
									<strong>Lỗi:</strong>{' '}
									{item.supportTicketID?.description ?? 'Không có'}
								</li>
                {(item.supportTicketID?.status) && <li>
									<strong>Đã xử lý:</strong>{' '}
									{item.supportTicketID.status === 'open'? 'Chưa xử lý' : 'Đã xử lý'}
								</li>}
                {(item.supportTicketID?.response) && <li>
									<strong>Phản hồi lỗi:</strong>{' '}
									{item.supportTicketID.response}
								</li>}
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
