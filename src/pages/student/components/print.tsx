import { StudentInfo } from '@/pages/student/home';
import {
	faFileAlt,
	faPrint,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface Document {
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

const PrintPage = () => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null,
	);
	const [showPreview, setShowPreview] = useState(false);
	const [pageBalance, setPageBalance] = useState<number>(0);

	useEffect(() => {
		loadDocumentsFromCache();
	}, []);

	useEffect(() => {
		const studentInfoStr = localStorage.getItem('studentInfo');
		if (studentInfoStr) {
			const studentInfo: StudentInfo = JSON.parse(studentInfoStr);
			setPageBalance(studentInfo.pagesRemaining || 0);
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
		const studentInfoStr = localStorage.getItem('studentInfo');
		if (studentInfoStr) {
			const studentInfo: StudentInfo = JSON.parse(studentInfoStr);
			studentInfo.pagesRemaining = newBalance;
			localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
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
				return;
			}

			const uploadPromise = toast.promise(
				(async () => {
					const newDocuments: Document[] = selectedFiles.map(
						(file) => ({
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

			if (doc.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
				const printWindow = window.open('', '_blank');
				if (!printWindow) {
					toast.error('Vui lòng cho phép pop-up để in tài liệu');
					return;
				}
				printWindow.document.write(`
					<html>
						<head><title>Print ${doc.name}</title></head>
						<body style="margin: 0; display: flex; justify-content: center; align-items: center;">
							<img src="${url}" style="max-width: 100%; max-height: 100vh;" />
						</body>
					</html>
				`);
				printWindow.document.close();
				printWindow.onload = () => {
					printWindow.print();
				};
			} else {
				const printWindow = window.open(url, '_blank');
				if (!printWindow) {
					toast.error('Vui lòng cho phép pop-up để in tài liệu');
					return;
				}
				printWindow.onload = () => {
					printWindow.print();
				};
			}
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

	return (
		<div className='container mx-auto px-4 py-8'>
			<Helmet>
				<title>In tài liệu | HCMUT</title>
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
												onClick={() => handlePrint(doc)}
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
		</div>
	);
};

export default PrintPage;
