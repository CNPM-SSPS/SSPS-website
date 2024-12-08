import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

const TransactionHistory = () => {
	const token = localStorage.getItem('accessToken');
	const [transactionLogs, setTransactionLogs] = useState([]);
	const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchID, setSearchID] = useState('');

	// const [filters, setFilters] = useState({
	// 	printer: '',
	// 	status: '',
	// 	date: '',
	// 	user: '',
	// 	printType: '',
	// });
	// const [selectedLog, setSelectedLog] = useState<PrintHistory | null>(null);
	const pageSize = 20;

	const fetchTransactions = useCallback(async () => {
		try {
			const response = await axios.get('/v1/officer/payment', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTransactionLogs(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					localStorage.clear();
				}
				toast.error('Không thể tải danh sách lịch sử giao dịch');
				console.error(error);
			}
		}
	}, []);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const filteredData = (() => {
    const newData = transactionLogs.filter((record) => {
			const matchesSearch =
				searchName === '' ||(record.studentID.name + ' ( ' + record.studentID.studentID + ' ) ').toLowerCase()
						.toLowerCase()
						.includes(searchName.toLowerCase());

        const matchesID = searchID === '' || record.transactionID.toLowerCase().includes(searchID.toLowerCase());
        const printDate = new Date(record.createDate);
        const matchesStartDate = !startDate || printDate >= startDate;
        const matchesEndDate = !endDate || printDate <= endDate;
        
        return matchesSearch && matchesID && matchesStartDate && matchesEndDate;
		});
    // setTotalPages(Math.ceil(newData.length / pageSize));
    return newData;
  })();

    
	// const paginatedData = useMemo(() => {
	// 	const startIndex = (currentPage - 1) * pageSize;
	// 	return filteredData.slice(startIndex, startIndex + pageSize);
	// }, [filteredData, currentPage]);

	// const handleRowClick = (id: string) => {
	// 	fetchPrintLogDetail(id);
	// };

	return (
		<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
			<div className='mx-auto max-w-7xl space-y-6'>
				<Helmet>
					<title>Lịch Sử In | HCMUT</title>
				</Helmet>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>
						Lịch Sử Giao Dịch
					</h1>
				</div>

				<div className='rounded-lg bg-white p-6 shadow-lg'>
					<div className='mb-6 flex flex-col flex-wrap gap-4'>
          <div className='mb-6'>
					<div className='flex flex-wrap gap-4'>
						<input
							type='text'
							placeholder='Tên sinh viên/ MSSV'
							className='flex-grow rounded border px-4 py-2 shadow-sm'
							value={searchName}
							onChange={(e) => setSearchName(e.target.value)}
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
              className='flex-grow rounded border px-4 py-2 shadow-sm'
              placeholder="ID giao dịch"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
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

            {/* <input
              type="text"
              className="rounded border px-4 py-2 shadow-sm"
              placeholder="Địa điểm máy in"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            /> */}
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

            <div className='mb-8 rounded-lg bg-white p-4 shadow'>
				<div className='mb-4 flex items-center gap-2 text-lg font-semibold'>
					<FontAwesomeIcon
						icon={faHistory}
						className='text-blue-600'
					/>
					<h2>LỊCH SỬ MUA</h2>
				</div>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-4 py-2 text-left'>STT</th>
                <th className='px-4 py-2 text-left'>
									Người in
								</th>
								<th className='px-4 py-2 text-left'>
									ID
								</th>
								<th className='px-4 py-2 text-left'>
									Số lượng
								</th>
								<th className='px-4 py-2 text-left'>
									Thành tiền
								</th>
								<th className='px-4 py-2 text-left'>
									Ngày giờ
								</th>
								<th className='px-4 py-2 text-left'>
									Trạng thái
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredData.map((item, index) => (
								<tr key={item.id} className='border-t'>
									<td className='px-4 py-2'>{index + 1}</td>
                  <td className='px-4 py-2'>{item.studentID.name + ' ( ' + item.studentID.studentID + ' ) '}</td>
									<td className='px-4 py-2'>
										{item.transactionID}
									</td>
									<td className='px-4 py-2'>
										{item.pageCount}
									</td>
									<td className='px-4 py-2'>
										{item.money?.toLocaleString()}đ
									</td>
									<td className='px-4 py-2'>{new Date(item.createDate).toLocaleString()}</td>
									<td className='px-4 py-2'>
										{(item.completed)? <span className='text-green-600'> Đã thanh toán
										</span> : <span className='text-red-600'>
                      Chưa thanh toán
										</span>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

						<div className='mb-6 flex flex-col gap-4'>
							<div className='flex gap-4'>
								{/* <input
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
								/> */}

								{/* <input
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
								/> */}

								{/* <select
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
								</select> */}

								{/* <select
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
								</select> */}

								{/* <input
									type='date'
									value={filters.date}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											date: e.target.value,
										}))
									}
									className='rounded-md border border-gray-300 p-2'
								/> */}
							</div>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full border-collapse border border-gray-300'>
							{/* <thead>
								<tr>
									<th className='border border-gray-300 p-2'>
										Người in
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
							</thead> */}
							{/* <tbody>
								{paginatedData.map((log) => (
									<tr
										key={log.id}
										onClick={() => handleRowClick(log.id)}
										className='cursor-pointer hover:bg-gray-100'
									>
										<td className='border border-gray-300 p-2'>
											{log.user.name + ' ( ' + log.user.studentID + ' ) '}
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
							</tbody> */}
						</table>
					</div>

					{/* <div className='mt-4 flex items-center justify-between'>

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
									setCurrentPage(
										Math.min(currentPage + 1, totalPages),
									)
								}
								disabled={currentPage === totalPages}
								className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50'
							>
								Sau
							</button>
						</div>
					</div> */}
				</div>
			</div>
			{/* {selectedLog && (
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
			)} */}
		</div>
	);
};

export default TransactionHistory;
