import HCMUTImage from '@/assets/images/hcmut.png';
import {
	faExclamationTriangle,
	faFileAlt,
	faPrint,
	faServer,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Helmet } from 'react-helmet-async';
const PrintingStep: React.FC<{
	number: number;
	title: string;
	children: React.ReactNode;
	icon: typeof faUpload;
}> = ({ number, title, children, icon }) => (
	<div className='mb-8 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'>
		<div className='mb-4 flex items-center'>
			<div className='mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'>
				{number}
			</div>
			<h3 className='flex items-center text-xl font-semibold text-gray-800'>
				<FontAwesomeIcon icon={icon} className='mr-3 text-blue-600' />
				{title}
			</h3>
		</div>
		<div className='ml-12'>{children}</div>
	</div>
);

const Home: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Helmet>
				<title>Trang chủ | HCMUT</title>
			</Helmet>

			<div className='mx-auto max-w-7xl py-8'>
				<img src={HCMUTImage} alt='HCMUT' className='mx-auto mb-8' />
				<div className='mb-8 rounded-lg bg-blue-600 p-6 text-white'>
					<h1 className='mb-2 text-3xl font-bold'>Thông báo chung</h1>
					<h2 className='text-2xl font-semibold'>
						HƯỚNG DẪN SỬ DỤNG DỊCH VỤ IN ẤN
					</h2>
				</div>

				<PrintingStep
					number={1}
					title='Tải tài liệu lên hệ thống'
					icon={faUpload}
				>
					<ul className='ml-6 list-disc space-y-2'>
						<li>
							Truy cập vào trang dịch vụ in ấn trên hệ thống SSPS
						</li>
						<li>
							Đăng nhập vào hệ thống bằng tài khoản sinh viên
							thông qua dịch vụ HCMUT_SSO
						</li>
						<li>
							Chọn tài liệu in:
							<ul className='list-circle ml-6 mt-2'>
								<li>
									Nhấn vào nút "Chọn file" để chọn tệp từ
									thiết bị của bạn
								</li>
								<li>
									Nhấn vào nút "Upload" để tải tệp lên hệ
									thống
								</li>
							</ul>
						</li>
					</ul>
				</PrintingStep>

				<PrintingStep
					number={2}
					title='Xem Trước và Chọn Thông Số In'
					icon={faFileAlt}
				>
					<ul className='ml-6 list-disc space-y-2'>
						<li>Xem trước tài liệu sau khi tải lên thành công</li>
						<li>
							Chọn thông số in:
							<ul className='list-circle ml-6 mt-2'>
								<li>
									Chọn khổ giấy từ menu thả xuống (A4, A3)
								</li>
								<li>Nhập số lượng bản in</li>
							</ul>
						</li>
					</ul>
				</PrintingStep>

				<PrintingStep
					number={3}
					title='Chọn Máy In và Xác Nhận In'
					icon={faPrint}
				>
					<ul className='ml-6 list-disc space-y-2'>
						<li>Chọn máy in khả dụng từ danh sách</li>
						<li>Kiểm tra lại thông tin và thông số in</li>
						<li>Nhấn "Xác nhận in" để hoàn tất</li>
					</ul>
				</PrintingStep>

				<div className='mb-8 border-l-4 border-yellow-400 bg-yellow-50 p-4'>
					<div className='mb-2 flex items-center'>
						<FontAwesomeIcon
							icon={faExclamationTriangle}
							className='mr-2 text-yellow-400'
						/>
						<h3 className='text-lg font-semibold'>LƯU Ý</h3>
					</div>
					<ul className='ml-6 list-disc space-y-2 text-gray-700'>
						<li>
							Kiểm tra kết nối mạng trong suốt quá trình sử dụng
							dịch vụ
						</li>
						<li>
							Đảm bảo tài liệu được định dạng đúng theo yêu cầu
						</li>
						<li>
							Kiểm tra số lượng giấy trong tài khoản trước khi in
						</li>
					</ul>
				</div>

				<div className='border-l-4 border-green-400 bg-green-50 p-4'>
					<div className='mb-2 flex items-center'>
						<FontAwesomeIcon
							icon={faServer}
							className='mr-2 text-green-400'
						/>
						<h3 className='text-lg font-semibold'>HỖ TRỢ</h3>
					</div>
					<p className='text-gray-700'>
						Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng
						dịch vụ, vui lòng liên hệ với bộ phận hỗ trợ của SPSO để
						được trợ giúp kịp thời.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
