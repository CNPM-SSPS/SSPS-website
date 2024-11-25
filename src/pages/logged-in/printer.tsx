import ConfirmModal from '@/components/confirm-modal';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface Printer {
	id: string;
	brand: string;
	model: string;
	paperQuantity: number;
	dateAdded: string;
	type: 'laser' | 'inkjet' | 'thermal' | 'multifunction';
	note: string;
	building: string;
	floor: string;
	status: 'active' | 'maintenance' | 'inactive';
}

const MOCK_PRINTERS: Printer[] = [
	{
		id: '1',
		brand: 'HP',
		model: 'Xịn nhất',
		paperQuantity: 500,
		dateAdded: '2024-11-18',
		type: 'laser',
		note: '',
		building: 'H1',
		floor: '201',
		status: 'active',
	},
	{
		id: '2',
		brand: 'Đéll',
		model: 'Cùi bắp',
		paperQuantity: 200,
		dateAdded: '2024-11-18',
		type: 'inkjet',
		note: '',
		building: 'H2',
		floor: '301',
		status: 'maintenance',
	},
];
type FilterType = {
	brand: 'asc' | 'desc' | null;
	position: 'asc' | 'desc' | null;
	paperCount: 'asc' | 'desc' | null;
	status: 'active' | 'maintenance' | null;
};

const PrinterPage = () => {
	const [printers, setPrinters] = useState<Printer[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
	const [formData, setFormData] = useState<Omit<Printer, 'id'>>({
		brand: '',
		model: '',
		paperQuantity: 0,
		dateAdded: new Date().toISOString().split('T')[0],
		type: 'laser',
		note: '',
		building: '',
		floor: '',
		status: 'active',
	});
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [printerToDelete, setPrinterToDelete] = useState<string | null>(null);
	const [filters, setFilters] = useState<FilterType>({
		brand: null,
		position: null,
		paperCount: null,
		status: null,
	});

	const ITEMS_PER_PAGE = 10;

	useEffect(() => {
		const storedPrinters = localStorage.getItem('printers');
		if (storedPrinters) {
			setPrinters(JSON.parse(storedPrinters));
		} else {
			setPrinters(MOCK_PRINTERS);
			localStorage.setItem('printers', JSON.stringify(MOCK_PRINTERS));
		}
	}, []);

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
				const locationA = `${a.building}-${a.floor}`;
				const locationB = `${b.building}-${b.floor}`;
				return filters.position === 'asc'
					? locationA.localeCompare(locationB)
					: locationB.localeCompare(locationA);
			});
		}

		if (filters.paperCount) {
			filteredPrinters.sort((a, b) =>
				filters.paperCount === 'asc'
					? a.paperQuantity - b.paperQuantity
					: b.paperQuantity - a.paperQuantity,
			);
		}

		if (filters.status) {
			filteredPrinters = filteredPrinters.filter(
				(printer) => printer.status === filters.status,
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newPrinters = [...printers];

		if (editingPrinter) {
			const index = newPrinters.findIndex(
				(p) => p.id === editingPrinter.id,
			);
			newPrinters[index] = { ...formData, id: editingPrinter.id };
			toast.success('Máy in đã được cập nhật');
		} else {
			newPrinters.push({
				...formData,
				id: crypto.randomUUID(),
			});
			toast.success('Máy in đã được thêm');
		}

		localStorage.setItem('printers', JSON.stringify(newPrinters));
		setPrinters(newPrinters);
		setIsModalOpen(false);
		resetForm();
	};

	const handleDeleteClick = (id: string) => {
		setPrinterToDelete(id);
		setIsConfirmModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (printerToDelete) {
			const newPrinters = printers.filter(
				(p) => p.id !== printerToDelete,
			);
			localStorage.setItem('printers', JSON.stringify(newPrinters));
			setPrinters(newPrinters);
			toast.success('Máy in đã được xóa');
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
			paperQuantity: 0,
			dateAdded: new Date().toISOString().split('T')[0],
			type: 'laser',
			note: '',
			building: '',
			floor: '',
			status: 'active',
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
												Số Lượng Giấy
												<select
													value={
														filters.paperCount ?? ''
													}
													onChange={(e) =>
														setFilters((prev) => ({
															...prev,
															paperCount: e.target
																.value as FilterType['paperCount'],
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
													value={filters.status ?? ''}
													onChange={(e) =>
														setFilters((prev) => ({
															...prev,
															status: e.target
																.value as FilterType['status'],
														}))
													}
													className='ml-2 rounded-md border border-gray-300 px-2 py-1 text-sm'
												>
													<option value=''>
														Tất cả
													</option>
													<option value='active'>
														Hoạt động
													</option>
													<option value='maintenance'>
														Bảo trì
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
											key={printer.id}
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
												{printer.floor}
											</td>
											<td className='p-4'>
												{printer.paperQuantity} trang
											</td>
											<td className='flex items-center justify-center p-4'>
												<span
													className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
														printer.status ===
														'active'
															? 'bg-green-100 text-green-800'
															: printer.status ===
																  'maintenance'
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-red-100 text-red-800'
													}`}
												>
													{printer.status === 'active'
														? 'Hoạt động'
														: printer.status ===
															  'maintenance'
															? 'Đang bảo trì'
															: 'Không hoạt động'}
												</span>
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
																printer.id,
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
										Số Lượng Giấy
									</label>
									<input
										type='number'
										required
										min='0'
										value={formData.paperQuantity}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												paperQuantity: parseInt(
													e.target.value,
												),
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
										type='date'
										required
										value={formData.dateAdded}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												dateAdded: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Loại Máy In
									</label>
									<select
										required
										value={formData.type}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												type: e.target
													.value as Printer['type'],
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									>
										<option value='laser'>Laser</option>
										<option value='inkjet'>Phun mực</option>
										<option value='thermal'>Nhiệt</option>
										<option value='multifunction'>
											Đa chức năng
										</option>
									</select>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700'>
										Tình Trạng
									</label>
									<select
										required
										value={formData.status}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												status: e.target
													.value as Printer['status'],
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									>
										<option value='active'>Active</option>
										<option value='maintenance'>
											Maintenance
										</option>
										<option value='inactive'>
											Inactive
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
										value={formData.floor}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												floor: e.target.value,
											}))
										}
										className='mt-1 block w-full rounded-md border border-gray-300 p-2'
										pattern='^[0-9]{3}$'
										title='Floor should be a 3-digit number (e.g., 201)'
									/>
								</div>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Ghi Chú
								</label>
								<textarea
									value={formData.note}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											note: e.target.value,
										}))
									}
									className='mt-1 block w-full rounded-md border border-gray-300 p-2'
									rows={3}
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
