import ConfirmModal from '@/components/confirm-modal';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
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
}

type FilterType = {
	brand: 'asc' | 'desc' | null;
	position: 'asc' | 'desc' | null;
	enabled: boolean | null;
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const PrinterPage: React.FC = () => {
	const accessToken = localStorage.getItem('accessToken');
	const [printers, setPrinters] = useState<Printer[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
	const [formData, setFormData] = useState<Omit<Printer, '_id'>>({
		brand: '',
		model: '',
		dateAdded: new Date().toISOString(),
		description: '',
		building: '',
		room: '',
		enabled: true,
		deleted: false,
		campus: 'CS2',
		lastModified: new Date().toISOString(),
	});
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [printerToDelete, setPrinterToDelete] = useState<string | null>(null);
	const [filters, setFilters] = useState<FilterType>({
		brand: null,
		position: null,
		enabled: null,
	});

	const ITEMS_PER_PAGE = 10;

	const fetchPrinters = useCallback(async () => {
		try {
			const response = await axios.get('/v1/officer/printer', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setPrinters(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					localStorage.clear();
				}
			}
			toast.error('Không thể tải danh sách máy in');
			console.error(error);
		}
	}, [accessToken]);

	useEffect(() => {
		fetchPrinters();
	}, [fetchPrinters]);

	const applyFilters = (printers: Printer[]) => {
		let filteredPrinters = [...printers];

		if (filters.brand) {
			filteredPrinters.sort((a, b) => {
				const brandA = `${a.brand} ${a.model}`;
				const brandB = `${b.brand} ${b.model}`;
				return filters.brand === 'asc'
					? brandA.localeCompare(brandB)
					: brandB.localeCompare(brandA);
			});
		}

		if (filters.position) {
			filteredPrinters.sort((a, b) => {
				const locationA = `${a.building}-${a.room}`;
				const locationB = `${b.building}-${b.room}`;
				return filters.position === 'asc'
					? locationA.localeCompare(locationB)
					: locationB.localeCompare(locationA);
			});
		}

		if (filters.enabled !== null) {
			filteredPrinters = filteredPrinters.filter(
				(printer) => printer.enabled === filters.enabled,
			);
		}

		return filteredPrinters;
	};

	const filteredAndSortedPrinters = applyFilters(printers);
	const paginatedPrinters = filteredAndSortedPrinters.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const totalPages = Math.ceil(printers.length / ITEMS_PER_PAGE);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editingPrinter) {
				await axios.put(
					`/v1/officer/printer/${editingPrinter._id}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				toast.success('Máy in đã được cập nhật');
			} else {
				const response = await axios.post(
					'/v1/officer/printer',
					formData,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				toast.success('Máy in đã được thêm');
				setPrinters([...printers, response.data]);
			}
			setIsModalOpen(false);
			resetForm();
			fetchPrinters();
		} catch (error) {
			toast.error('Đã xảy ra lỗi khi cập nhật máy in');
			console.error(error);
		}
	};

	const handleDeleteClick = (id: string) => {
		setPrinterToDelete(id);
		setIsConfirmModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (printerToDelete) {
			try {
				await axios.delete(`/v1/officer/printer/${printerToDelete}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				toast.success('Máy in đã được xóa');
				fetchPrinters();
			} catch (error) {
				toast.error('Đã xảy ra lỗi khi xóa máy in');
				console.error(error);
			}
		}
		setIsConfirmModalOpen(false);
		setPrinterToDelete(null);
	};

	const handleEdit = (printer: Printer) => {
		setEditingPrinter(printer);
		setFormData(printer);
		setIsModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			brand: '',
			model: '',
			dateAdded: new Date().toISOString(),
			description: '',
			building: '',
			room: '',
			enabled: true,
			deleted: false,
			campus: 'CS2',
			lastModified: new Date().toISOString(),
		});
		setEditingPrinter(null);
	};

	return (
		<>
			<Helmet>
				<title>Quản Lý Máy In | HCMUT</title>
			</Helmet>

			<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
				<div className='mx-auto max-w-7xl space-y-6'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold text-gray-900'>
							Quản Lý Máy In
						</h1>
						<button
							onClick={() => {
								resetForm();
								setIsModalOpen(true);
							}}
							className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
						>
							<FontAwesomeIcon icon={faPlus} />
							Thêm Máy In
						</button>
					</div>

					<div className='rounded-lg bg-white p-6 shadow-lg'>
						<div className='overflow-x-auto'>
							<table className='w-full table-auto'>
								<thead>
									<tr className='border-b text-left'>
										<th className='p-4'>
											<div className='flex items-center gap-2'>
												Thương Hiệu/Model
												<select
													value={filters.brand ?? ''}
													onChange={(e) =>
														setFilters((prev) => ({
															...prev,
															brand: e.target
																.value as FilterType['brand'],
														}))
													}
													className='ml-2 rounded-md border border-gray-300 px-2 py-1 text-sm'
												>
													<option value=''>
														Tất cả
													</option>
													<option value='asc'>
														A-Z
													</option>
													<option value='desc'>
														Z-A
													</option>
												</select>
											</div>
										</th>
										<th className='p-4'>
											<div className='flex items-center gap-2'>
												Vị Trí
												<select
													value={
														filters.position ?? ''
													}
													onChange={(e) =>
														setFilters((prev) => ({
															...prev,
															position: e.target
																.value as FilterType['position'],
														}))
													}
													className='ml-2 rounded-md border border-gray-300 px-2 py-1 text-sm'
												>
													<option value=''>
														Tất cả
													</option>
													<option value='asc'>
														Tăng dần
													</option>
													<option value='desc'>
														Giảm dần
													</option>
												</select>
											</div>
										</th>
										<th className='p-4'>
											<div className='flex items-center gap-2'>
												Tình Trạng
												<select
													value={
														filters.enabled !== null
															? filters.enabled.toString()
															: ''
													}
													onChange={(e) =>
														setFilters((prev) => ({
															...prev,
															enabled:
																e.target
																	.value ===
																''
																	? null
																	: e.target
																			.value ===
																		'true',
														}))
													}
													className='ml-2 rounded-md border border-gray-300 px-2 py-1 text-sm'
												>
													<option value=''>
														Tất cả
													</option>
													<option value='true'>
														Hoạt động
													</option>
													<option value='false'>
														Không hoạt động
													</option>
												</select>
											</div>
										</th>
										<th className='p-4'>
											<div className='flex items-center justify-between gap-2'>
												Thao Tác
											</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{paginatedPrinters.map((printer) => (
										<tr
											key={printer._id}
											className='border-b hover:bg-gray-50'
										>
											<td className='p-4'>
												<div className='font-medium'>
													{printer.brand}
												</div>
												<div className='text-sm text-gray-500'>
													{printer.model}
												</div>
											</td>
											<td className='p-4'>
												{printer.building}-
												{printer.room}
											</td>
											<td className='flex items-center justify-center p-4'>
												<span
													className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
														printer.enabled
															? 'bg-green-100 text-green-800'
															: 'bg-red-100 text-red-800'
													}`}
												>
													{printer.enabled
														? 'Hoạt động'
														: 'Không hoạt động'}
												</span>
											</td>
											<td className='p-4 text-sm text-gray-500'>
												{formatDate(printer.dateAdded)}
											</td>
											<td className='p-4'>
												<div className='flex gap-2'>
													<button
														onClick={() =>
															handleEdit(printer)
														}
														className='rounded p-2 text-blue-600 hover:bg-blue-50'
													>
														<FontAwesomeIcon
															icon={faEdit}
														/>
													</button>
													<button
														onClick={() =>
															handleDeleteClick(
																printer._id,
															)
														}
														className='rounded p-2 text-red-600 hover:bg-red-50'
													>
														<FontAwesomeIcon
															icon={faTrash}
														/>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className='mt-4 flex items-center justify-between'>
							<div className='text-sm text-gray-500'>
								Hiển thị{' '}
								{(currentPage - 1) * ITEMS_PER_PAGE + 1}/{' '}
								{Math.min(
									currentPage * ITEMS_PER_PAGE,
									printers.length,
								)}{' '}
								trong tổng số {printers.length} máy in
							</div>
							<div className='flex gap-2'>
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`rounded px-3 py-1 ${
											currentPage === page
												? 'bg-blue-600 text-white'
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

			{isModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-full max-w-2xl rounded-lg bg-white p-6'>
						<h2 className='mb-4 text-xl font-bold'>
							{editingPrinter
								? 'Chỉnh Sửa Máy In'
								: 'Thêm Máy In'}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tên Hãng
									</label>
									<input
										type='text'
										required
										value={formData.brand}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												brand: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tên Máy In
									</label>
									<input
										type='text'
										required
										value={formData.model}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												model: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Ngày Thêm
									</label>
									<input
										type='datetime-local'
										required
										value={formData.dateAdded.slice(0, 16)}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												dateAdded: new Date(
													e.target.value,
												).toISOString(),
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tình Trạng
									</label>
									<select
										required
										value={formData.enabled.toString()}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												enabled:
													e.target.value === 'true',
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									>
										<option value='true'>Hoạt động</option>
										<option value='false'>
											Không hoạt động
										</option>
									</select>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tòa Nhà
									</label>
									<input
										type='text'
										required
										placeholder='H1'
										value={formData.building}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												building:
													e.target.value.toUpperCase(),
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
										pattern='^[A-Za-z][0-9]$'
										title='Building should be in format: Letter followed by number (e.g., H1)'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tầng
									</label>
									<input
										type='text'
										required
										placeholder='201'
										value={formData.room}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												room: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
										pattern='^[0-9]{3}$'
										title='Floor should be a 3-digit number (e.g., 201)'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Campus
									</label>
									<select
										required
										value={formData.campus}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												campus: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									>
										<option value='CS1'>CS1</option>
										<option value='CS2'>CS2</option>
									</select>
								</div>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Ghi Chú
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									rows={3}
									required
								/>
							</div>
							<div className='flex justify-end gap-4'>
								<button
									type='button'
									onClick={() => {
										setIsModalOpen(false);
										resetForm();
									}}
									className='rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'
								>
									Hủy
								</button>
								<button
									type='submit'
									className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
								>
									{editingPrinter ? 'Cập Nhật' : 'Thêm'} Máy
									In
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<ConfirmModal
				isOpen={isConfirmModalOpen}
				title='Xóa Máy In'
				message='Bạn có chắc chắn muốn xóa máy in này? Hành động này không thể hoàn tác.'
				onConfirm={handleConfirmDelete}
				onCancel={() => {
					setIsConfirmModalOpen(false);
					setPrinterToDelete(null);
				}}
			/>
		</>
	);
};

export default PrinterPage;
