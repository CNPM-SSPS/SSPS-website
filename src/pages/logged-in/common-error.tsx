import {
	faBolt,
	faCog,
	faExclamationTriangle,
	faFile,
	faInbox,
	faPrint,
	faSearch,
	faServer,
	faSync,
	faTriangleExclamation,
	faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface PrinterError {
	code: string;
	title: string;
	titleEn: string;
	description: string;
	icon: typeof faExclamationTriangle;
}

const printerErrors: PrinterError[] = [
	{
		code: 'E101',
		title: 'Giấy Bị Kẹt',
		titleEn: 'Paper Jam',
		description: 'Giấy bị kẹt trong máy in, không thể tiếp tục in.',
		icon: faExclamationTriangle,
	},
	{
		code: 'E102',
		title: 'Mực In Hết',
		titleEn: 'Ink/Toner Empty',
		description: 'Mực in hoặc toner đã hết, cần thay mới.',
		icon: faPrint,
	},
	{
		code: 'E103',
		title: 'Mực In Không Đều',
		titleEn: 'Uneven Printing',
		description:
			'Mực in không đều, xuất hiện vệt trắng hoặc các khoảng trống.',
		icon: faPrint,
	},
	{
		code: 'E104',
		title: 'Không Kết Nối Được Với Máy Tính',
		titleEn: 'Connection Issue',
		description: 'Máy in không thể kết nối với máy tính hoặc mạng.',
		icon: faServer,
	},
	{
		code: 'E105',
		title: 'Lỗi Kết Nối Không Dây',
		titleEn: 'Wireless Connection Issue',
		description: 'Máy in không thể kết nối qua Wi-Fi.',
		icon: faWifi,
	},
	{
		code: 'E106',
		title: 'Lỗi Định Dạng Tài Liệu',
		titleEn: 'Incorrect Formatting',
		description:
			'Tài liệu in ra không đúng định dạng, bị lệch hoặc cắt xén.',
		icon: faFile,
	},
	{
		code: 'E107',
		title: 'Lỗi Driver',
		titleEn: 'Driver Issue',
		description: 'Lỗi do driver của máy in không tương thích hoặc bị lỗi.',
		icon: faCog,
	},
	{
		code: 'E108',
		title: 'Máy In Không Phản Hồi',
		titleEn: 'Printer Not Responding',
		description: 'Máy in không phản hồi khi có lệnh in, không hoạt động.',
		icon: faTriangleExclamation,
	},
	{
		code: 'E109',
		title: 'Máy In Bị Treo',
		titleEn: 'Printer Freezes',
		description: 'Máy in bị treo, không thực hiện các lệnh in mới.',
		icon: faSync,
	},
	{
		code: 'E110',
		title: 'Lỗi Quét',
		titleEn: 'Scan Error',
		description: 'Máy in không thể quét tài liệu hoặc quét bị lỗi.',
		icon: faSearch,
	},
	{
		code: 'E113',
		title: 'Lỗi Cảm Biến',
		titleEn: 'Sensor Issue',
		description:
			'Cảm biến của máy in bị lỗi, không nhận diện được giấy hoặc mực.',
		icon: faTriangleExclamation,
	},
	{
		code: 'E115',
		title: 'Lỗi Định Dạng Tài Liệu',
		titleEn: 'Document Format Issue',
		description:
			'Tài liệu không đúng định dạng hoặc không được hỗ trợ bởi máy in.',
		icon: faFile,
	},
	{
		code: 'E112',
		title: 'Lỗi Mất Điện',
		titleEn: 'Power Failure',
		description: 'Máy in bị mất điện đột ngột trong quá trình in.',
		icon: faBolt,
	},
	{
		code: 'E114',
		title: 'Lỗi Khay Giấy',
		titleEn: 'Paper Tray Issue',
		description: 'Khay giấy bị kẹt hoặc không nhận giấy đúng cách.',
		icon: faInbox,
	},
];

const CommonError: FC = () => {
	return (
		<>
			<Helmet>
				<title>Các Lỗi Thường Gặp | HCMUT</title>
			</Helmet>

			<div className='h-full bg-gradient-to-br from-blue-50 to-white p-6'>
				<div className='mx-auto max-w-7xl space-y-6'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold text-gray-900'>
							Các Lỗi Thường Gặp
						</h1>
					</div>

					<div className='rounded-lg bg-white p-6 shadow-lg'>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							{printerErrors.map((error) => (
								<div
									key={error.code}
									className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md'
								>
									<div className='mb-4 flex items-center gap-3'>
										<div className='rounded-full bg-red-100 p-3 text-red-600'>
											<FontAwesomeIcon
												icon={error.icon}
												className='text-xl'
											/>
										</div>
										<div className='flex-1'>
											<h2 className='text-lg font-semibold text-gray-800'>
												{error.title} ({error.titleEn})
											</h2>
										</div>
									</div>
									<div className='space-y-2'>
										<p className='text-gray-600'>
											<span className='font-medium'>
												Mô Tả:
											</span>{' '}
											{error.description}
										</p>
										<p className='text-gray-600'>
											<span className='font-medium'>
												Mã Lỗi:
											</span>{' '}
											{error.code}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CommonError;
