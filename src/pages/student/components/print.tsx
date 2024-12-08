import { StudentInfo } from '@/pages/student/Account';
import {
	faFileAlt,
	faPrint,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Document {
  type: string;
	id: string;
	name: string;
	uploadDate: string;
	url: string;
}

const CACHE_NAME = 'print-documents-cache';

const ALLOWED_FILE_TYPES = [
	'application/pdf',
	'text/plain',
	'image/jpeg',
	'image/png',
	'image/gif',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const getFileType = (fileName: string): string => {
	const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
	switch (extension) {
		case 'pdf':
			return 'application/pdf';
		case 'txt':
			return 'text/plain';
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		case 'xlsx':
			return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'gif':
			return 'image/gif';
		default:
			return 'application/octet-stream';
	}
};

const saveToCache = async (doc: Document, file: File) => {
	try {
		const cache = await caches.open(CACHE_NAME);

		await cache.put(`/file-${doc.id}`, new Response(file));

		const metadataResponse = new Response(JSON.stringify(doc));
		await cache.put(`/metadata-${doc.id}`, metadataResponse);
	} catch {
		toast.error('Không thể lưu tài liệu vào bộ nhớ cache');
	}
};

interface PrintSettings {
	printCount: number;
	printType: string;
	color: boolean;
	paperSize: string;
	printer: string;
}

const PrintPage = () => {
  const token = localStorage.getItem('accessToken');
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null,
	);
	const [showPreview, setShowPreview] = useState(false);
	const [pageBalance, setPageBalance] = useState<number>(0);
	const [showErrorBox, setShowErrorBox] = useState(false);
	const [showPrintSettings, setShowPrintSettings] = useState(false);
	const [currentPrintDoc, setCurrentPrintDoc] = useState<Document | null>(
		null,
	);
	const [printSettings, setPrintSettings] = useState<PrintSettings>({
		printCount: 1,
		printType: 'double-sided',
		color: false,
		paperSize: 'A4',
		printer: '',
	});
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    const fetchPrinters = async () => {
      const response = await axios.get('/v1/student/printing/print', {
      headers: {
        Authorization: `Bearer ${token}`,
      }});
      setPrinters(response.data);
    };

    fetchPrinters();
  },[]);

	useEffect(() => {
		loadDocumentsFromCache();
	}, []);

	useEffect(() => {
		const studentInfoStr = localStorage.getItem('userData');
		if (studentInfoStr) {
			const studentInfo: StudentInfo = JSON.parse(studentInfoStr);
			setPageBalance(studentInfo.pageCount || 0);
		}
	}, []);

	const loadDocumentsFromCache = async () => {
		try {
			const cache = await caches.open(CACHE_NAME);
			const keys = await cache.keys();
			const cachedDocs: Document[] = [];

			for (const key of keys) {
				const keyName = key.url.split('/').pop() ?? '';

				if (keyName.startsWith('metadata-')) {
					const response = await cache.match(key);
					if (response) {
						const metadata = await response.json();
						cachedDocs.push(metadata);
					}
				}
			}

			const sortedDocs = cachedDocs.sort((a, b) => {
				const dateA = new Date(a.uploadDate).getTime();
				const dateB = new Date(b.uploadDate).getTime();
				return dateB - dateA;
			});

			setDocuments(sortedDocs);
		} catch {
			toast.error('Không thể tải tài liệu từ bộ nhớ cache');
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		const validFiles: File[] = [];
		const invalidFiles: string[] = [];

		files.forEach((file) => {
			if (ALLOWED_FILE_TYPES.includes(file.type)) {
				validFiles.push(file);
			} else {
				invalidFiles.push(file.name);
			}
		});

		if (validFiles.length > 0) {
			setSelectedFiles((prev) => [...prev, ...validFiles]);
			toast.success(`Đã chọn ${validFiles.length} tệp`);
		}

		if (invalidFiles.length > 0) {
			toast.error(
				`Không hỗ trợ định dạng của ${invalidFiles.length} tệp: ${invalidFiles.join(', ')}`,
			);
		}
	};

	const updatePageBalance = (newBalance: number) => {
		const studentInfoStr = localStorage.getItem('userData');
		if (studentInfoStr) {
			const studentInfo: StudentInfo = JSON.parse(studentInfoStr);
			studentInfo.pageCount = newBalance;
			localStorage.setItem('userData', JSON.stringify(studentInfo));
			setPageBalance(newBalance);
		}
	};

	const handleUpload = async () => {
		try {
			const totalPagesNeeded = selectedFiles.length;

			if (totalPagesNeeded > pageBalance) {
				toast.error(
					`Không đủ số trang để tải lên. Cần ${totalPagesNeeded} trang, còn ${pageBalance} trang.`,
				);
				setShowErrorBox(true);
				return;
			}

			const uploadPromise = toast.promise(
				(async () => {
					const newDocuments: Document[] = selectedFiles.map(
						(file) => ({
              type: file.type,
							id: crypto.randomUUID(),
							name: file.name,
							uploadDate: new Date().toLocaleDateString('vi-VN'),
							url: URL.createObjectURL(file),
						}),
					);

					for (let i = 0; i < newDocuments.length; i++) {
						await saveToCache(newDocuments[i], selectedFiles[i]);
					}

					updatePageBalance(pageBalance - totalPagesNeeded);

					setDocuments((prev) => [...prev, ...newDocuments]);
					setSelectedFiles([]);
					return newDocuments.length;
				})(),
				{
					loading: 'Đang tải tài liệu lên...',
					success: (count) =>
						`Đã tải lên ${count} tài liệu thành công!`,
					error: 'Tải tài liệu thất bại',
				},
			);

			await uploadPromise;
		} catch {
			toast.error('Tải tài liệu thất bại');
		}
	};

	const handlePrint = async (doc: Document) => {
		try {
			const cache = await caches.open(CACHE_NAME);
			const fileResponse = await cache.match(`/file-${doc.id}`);

			if (!fileResponse) {
				throw new Error('File not found in cache');
			}

			const arrayBuffer = await fileResponse.arrayBuffer();
			const fileType = getFileType(doc.name);
			const blob = new Blob([arrayBuffer], { type: fileType });
			const url = URL.createObjectURL(blob);

			setSelectedDocument({ ...doc, url });
			setShowPreview(true);
		} catch {
			toast.error('Không thể in tài liệu. Vui lòng thử lại.');
		}
	};

	const handleShowDetails = async (doc: Document) => {
		const loadingToast = toast.loading('Đang tải xem trước...');
		try {
			const cache = await caches.open(CACHE_NAME);
			const fileResponse = await cache.match(`/file-${doc.id}`);

			if (!fileResponse) {
				throw new Error('File not found in cache');
			}

			const arrayBuffer = await fileResponse.arrayBuffer();
			const fileType = getFileType(doc.name);
			const blob = new Blob([arrayBuffer], { type: fileType });
			const url = URL.createObjectURL(blob);

			setSelectedDocument({ ...doc, url });
			setShowPreview(true);

			toast.dismiss(loadingToast);
		} catch {
			toast.error('Không thể tải xem trước tài liệu', {
				id: loadingToast,
			});
		}
	};

	const removeFromCache = async (docId: string) => {
		try {
			const cache = await caches.open(CACHE_NAME);
			await cache.delete(`/file-${docId}`);
			await cache.delete(`/metadata-${docId}`);
			setDocuments(documents.filter((doc) => doc.id !== docId));
			toast.success('Đã xóa tài liệu');
		} catch {
			toast.error('Không thể xóa tài liệu');
		}
	};

	const removeSelectedFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		toast.success('Đã xóa tệp khỏi danh sách chọn');
	};

	const handlePrintClick = (doc: Document) => {
		setCurrentPrintDoc(doc);
		setShowPrintSettings(true);
	};

	const handlePrintConfirm = async () => {
		if (!currentPrintDoc) return;

    await axios.post('/v1/student/printing/print', {
      printer: printSettings.printer,
      printCount: printSettings.printCount,
      printType: printSettings.printType,
      color: printSettings.color,
      printingFile: {
        fileName: currentPrintDoc.name,
        fileType: currentPrintDoc.type || 'pdf',
        pageSize: printSettings.paperSize,
        pageCount: 1
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

		await handlePrint(currentPrintDoc);
		setShowPrintSettings(false);
		setCurrentPrintDoc(null);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<Helmet>
				<title>In tài liệu | HCMUT </title>
			</Helmet>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Tải tài liệu để in</h1>
				<div className='text-lg font-medium text-blue-600'>
					Số trang dư hiện tại: {pageBalance} trang 
				</div>
			</div>

			<div className='mb-8 rounded-lg bg-gray-50'>
				<div className='mb-4 flex items-center gap-4'>
					<label className='cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
						<FontAwesomeIcon icon={faUpload} className='mr-2' />
						Chọn tệp
						<input
							type='file'
							multiple
							className='hidden'
							onChange={handleFileSelect}
							accept='.pdf,.txt,.jpg,.jpeg,.png,.gif,.docx,.xlsx'
						/>
					</label>
				</div>

				{selectedFiles.length > 0 && (
					<div className='mb-4'>
						<h3 className='mb-2 font-semibold'>Các tệp đã chọn:</h3>
						<div className='mb-4 overflow-x-auto'>
							<div
								className='flex gap-4 pb-2'
								style={{ minWidth: 'min-content' }}
							>
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className='flex min-w-[200px] items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm'
									>
										<FontAwesomeIcon
											icon={faFileAlt}
											className='text-gray-500'
										/>
										<span className='truncate'>
											{file.name}
										</span>
										<button
											onClick={() =>
												removeSelectedFile(index)
											}
											className='ml-auto text-red-500 hover:text-red-700'
										>
											✕
										</button>
									</div>
								))}
							</div>
						</div>
						<button
							onClick={handleUpload}
							className='mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
						>
							Tải lên
						</button>
					</div>
				)}
			</div>

			<div className='mb-8'>
				<h2 className='mb-4 text-xl font-semibold'>
					Các tài liệu đã có trên hệ thống
				</h2>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='bg-gray-100'>
								<th className='border p-2 text-left'>STT</th>
								<th className='border p-2 text-left'>
									TÊN TÀI LIỆU
								</th>
								<th className='border p-2 text-left'>
									NGÀY TẢI LÊN
								</th>
								<th className='border p-2 text-left'>
									THAO TÁC
								</th>
							</tr>
						</thead>
						<tbody>
							{documents.map((doc, index) => (
								<tr key={doc.id} className='hover:bg-gray-50'>
									<td className='border p-2'>{index + 1}</td>
									<td className='border p-2'>{doc.name}</td>
									<td className='border p-2'>
										{doc.uploadDate}
									</td>
									<td className='border p-2'>
										<div className='flex gap-2'>
											<button
												className='text-blue-500 hover:text-blue-700'
												onClick={() =>
													handleShowDetails(doc)
												}
											>
												Chi tiết
											</button>
											<button
												className='text-blue-500 hover:text-blue-700'
												onClick={() =>
													handlePrintClick(doc)
												}
											>
												<FontAwesomeIcon
													icon={faPrint}
												/>
											</button>
											<button
												className='text-red-500 hover:text-red-700'
												onClick={() =>
													removeFromCache(doc.id)
												}
											>
												✕
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{showPreview && selectedDocument && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4'>
					<div className='flex h-[80vh] w-full max-w-4xl flex-col rounded-lg bg-white'>
						<div className='flex items-center justify-between border-b p-4'>
							<h3 className='font-semibold'>
								{selectedDocument.name}
							</h3>
							<button
								onClick={() => setShowPreview(false)}
								className='text-gray-500 hover:text-gray-700'
							>
								✕
							</button>
						</div>
						<div className='flex-1 p-4'>
							{selectedDocument.name.match(
								/\.(jpg|jpeg|png|gif)$/i,
							) ? (
								<img
									src={selectedDocument.url}
									alt={selectedDocument.name}
									className='h-full w-full object-contain'
								/>
							) : selectedDocument.name.match(/\.(txt)$/i) ? (
								<iframe
									src={selectedDocument.url}
									className='h-full w-full border-0'
									title={selectedDocument.name}
								/>
							) : (
								<object
									data={selectedDocument.url}
									type={getFileType(selectedDocument.name)}
									className='h-full w-full'
								>
									<p>
										Không thể xem trước tệp này. Vui lòng
										tải về để xem.
									</p>
								</object>
							)}
						</div>
					</div>
				</div>
			)}

			{showErrorBox && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='rounded-lg bg-white p-6 text-center shadow-lg'>
						<p className='mb-4 text-lg font-semibold'>
							Không đủ số trang để tải lên.
						</p>
						<button
							onClick={() =>
								(window.location.href =
									'http://localhost:5173/thanh-toan')
							}
							className='mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
						>
							Đi đến trang thanh toán
						</button>
					</div>
				</div>
			)}

			{showPrintSettings && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
						<div className='mb-4 flex items-center justify-between'>
							<h3 className='text-lg font-semibold'>
								Cài đặt in
							</h3>
							<button
								onClick={() => setShowPrintSettings(false)}
								className='text-gray-500 hover:text-gray-700'
							>
								✕
							</button>
						</div>

						<div className='space-y-4'>
							<div>
								<label className='mb-1 block text-sm font-medium'>
									Máy in
								</label>
								<select
									value={printSettings.printer}
									onChange={(e) =>
										setPrintSettings((prev) => ({
											...prev,
											printer: e.target.value,
										}))
									}
									className='w-full rounded border p-2'
								>
									{printers.map((printer, index) => (
                    <option key={index} value={printer._id}>
                      {printer.building + '-' + printer.room + ' ' + printer.campus}
                    </option>
                  ))}
								</select>
							</div>

							<div>
								<label className='mb-1 block text-sm font-medium'>
									Số bản sao
								</label>
								<input
									type='number'
									min='1'
									value={printSettings.printCount}
									onChange={(e) =>
										setPrintSettings((prev) => ({
											...prev,
											printCount:
												parseInt(e.target.value) || 1,
										}))
									}
									className='w-full rounded border p-2'
								/>
							</div>

							<div>
								<label className='mb-1 block text-sm font-medium'>
									Loại In
								</label>
								<select
									value={printSettings.printType}
									onChange={(e) =>
										setPrintSettings((prev) => ({
											...prev,
											printType: e.target.value,
										}))
									}
									className='w-full rounded border p-2'
								>
									<option value='double-sided'>Hai mặt</option>
									<option value='single-sided'>Một mặt</option>
								</select>
							</div>

							<div>
								<label className='mb-1 block text-sm font-medium'>
									Màu
								</label>
								<select
									value={(printSettings.color)? 'true' : 'false'}
									onChange={(e) =>
										setPrintSettings((prev) => ({
											...prev,
											color: e.target.value === 'true',
										}))
									}
									className='w-full rounded border p-2'
								>
                  <option value='false'>Đen trắng</option>
                  <option value='true'>Màu sắc</option>
								</select>
							</div>

							<div>
								<label className='mb-1 block text-sm font-medium'>
									Khổ giấy
								</label>
								<select
									value={printSettings.paperSize}
									onChange={(e) =>
										setPrintSettings((prev) => ({
											...prev,
											paperSize: e.target.value,
										}))
									}
									className='w-full rounded border p-2'
								>
									<option value='Letter'>Letter</option>
									<option value='A4'>A4</option>
									<option value='A3'>A3</option>
								</select>
							</div>
						</div>

						<div className='mt-6 flex justify-end space-x-3'>
							<button
								onClick={() => setShowPrintSettings(false)}
								className='rounded border px-4 py-2 hover:bg-gray-100'
							>
								Hủy
							</button>
							<button
								onClick={handlePrintConfirm}
								className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
							>
								In
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PrintPage;
