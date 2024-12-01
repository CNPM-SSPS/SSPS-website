import {
	faGears,
	faHeadset,
	faLightbulb,
	faPrint,
	faTriangleExclamation,
	faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';

interface SupportSection {
	icon: typeof faPrint;
	title: string;
	items: string[];
}

const SupportPage = () => {
	const technicalSupport: SupportSection[] = [
		{
			icon: faPrint,
			title: 'Kết nối và cài đặt máy in',
			items: [
				'Hướng dẫn cách kết nối máy in với máy tính hoặc thiết bị di động',
				'Hỗ trợ cài đặt driver máy in và phần mềm liên quan',
				'Kiểm tra và khắc phục các vấn đề về kết nối mạng (Wi-Fi hoặc cáp)',
			],
		},
		{
			icon: faGears,
			title: 'Sử dụng và vận hành máy in',
			items: [
				'Hướng dẫn cách sử dụng các chức năng cơ bản của máy in (in, photocopy, scan, fax)',
				'Cách chọn và thay đổi các thiết lập in (khổ giấy, màu sắc, số lượng bản in, in hai mặt, v.v.)',
			],
		},
		{
			icon: faTriangleExclamation,
			title: 'Xử lý sự cố máy in',
			items: [
				'Giải quyết các lỗi thường gặp (kẹt giấy, mực in không đều, máy in không nhận lệnh, v.v.)',
				'Hướng dẫn cách kiểm tra và khắc phục các lỗi hiển thị trên máy in',
				'Hỗ trợ khi máy in không phản hồi hoặc không in được',
			],
		},
	];

	const specialSupport: SupportSection[] = [
		{
			icon: faLightbulb,
			title: 'Tư vấn chọn máy in',
			items: [
				'Tư vấn sinh viên chọn máy in phù hợp với nhu cầu sử dụng (máy in laser, máy in phun, máy in đa chức năng)',
			],
		},
		{
			icon: faWandMagicSparkles,
			title: 'Hỗ trợ nâng cao',
			items: [
				'Hỗ trợ sinh viên thực hiện các yêu cầu in ấn đặc biệt (in 3D, in màu chất lượng cao, in tài liệu chuyên ngành)',
			],
		},
	];

	return (
		<div className='min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8'>
			<Helmet>
				<title>Yêu cầu hỗ trợ | HCMUT</title>
			</Helmet>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-12'>
					<div className='mb-8 flex items-center gap-3'>
						<FontAwesomeIcon
							icon={faHeadset}
							className='text-3xl text-blue-600'
						/>
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>
								Yêu cầu hỗ trợ kỹ thuật
							</h1>
							<p className='text-lg font-semibold text-blue-600'>
								HOTLINE: 0123 456 789
							</p>
						</div>
					</div>

					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{technicalSupport.map((section, index) => (
							<div
								key={index}
								className='rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'
							>
								<FontAwesomeIcon
									icon={section.icon}
									className='mb-4 text-2xl text-blue-600'
								/>
								<h2 className='mb-4 text-xl font-semibold text-gray-900'>
									{section.title}
								</h2>
								<ul className='space-y-3'>
									{section.items.map((item, itemIndex) => (
										<li
											key={itemIndex}
											className='flex items-start'
										>
											<span className='mr-2 text-blue-600'>
												•
											</span>
											<span className='text-gray-600'>
												{item}
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className='mb-8 flex items-center gap-3'>
						<FontAwesomeIcon
							icon={faHeadset}
							className='text-3xl text-purple-600'
						/>
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>
								Yêu cầu hỗ trợ đặc biệt
							</h1>
							<p className='text-lg font-semibold text-purple-600'>
								HOTLINE: 0123 456 466
							</p>
						</div>
					</div>

					<div className='grid gap-6 md:grid-cols-2'>
						{specialSupport.map((section, index) => (
							<div
								key={index}
								className='rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'
							>
								<FontAwesomeIcon
									icon={section.icon}
									className='mb-4 text-2xl text-purple-600'
								/>
								<h2 className='mb-4 text-xl font-semibold text-gray-900'>
									{section.title}
								</h2>
								<ul className='space-y-3'>
									{section.items.map((item, itemIndex) => (
										<li
											key={itemIndex}
											className='flex items-start'
										>
											<span className='mr-2 text-purple-600'>
												•
											</span>
											<span className='text-gray-600'>
												{item}
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SupportPage;
