import LogoWebsite from '@/assets/images/logo.jpg';
import PaymentModal from '@/pages/student/components/payment-modal';
import { StudentInfo } from '@/pages/student/Account';
import {
	faFileInvoice,
	faHistory,
	faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
type PaymentStatus = 'pending' | 'completed';

interface PaymentHistoryItem {
	id: string;
	content: string;
	quantity: number;
	amount: number;
	date: string;
	status: PaymentStatus;
}

interface PurchaseItem {
	id: string;
	content: string;
	quantity: number;
	amount: number;
	status: PaymentStatus;
}

interface QRConfig {
	bankId: string;
	accountNo: string;
	accountName: string;
	template: string;
	pricePerPage: number;
}
const MOCK_PAYMENT_INFO: QRConfig = {
	bankId: 'MB',
	accountNo: '0902448134',
	accountName: 'DANG CONG SON',
	template: 'compact',
	pricePerPage: 500,
};

const PaymentPage = () => {
	const [currentBalance, setCurrentBalance] = useState(() => {
		const studentInfo = localStorage.getItem('userData');
		if (studentInfo) {
			const parsedInfo = JSON.parse(studentInfo) as StudentInfo;
			return parsedInfo.pageCount || 0;
		}
		return 0;
	});
	const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
		{
			id: '1',
			content: 'Mua thêm giấy in',
			quantity: 10,
			amount: 5000,
			status: 'pending',
		},
	]);

	const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
		{
			id: '1',
			content: 'Mua thêm giấy in',
			quantity: 10,
			amount: 5000,
			date: '17/10/2024 11:56 PM',
			status: 'completed',
		},
		{
			id: '2',
			content: 'Mua thêm giấy in',
			quantity: 10,
			amount: 5000,
			date: '17/10/2024 11:56 PM',
			status: 'completed',
		},
	]);

	const quantityOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PurchaseItem | null>(
		null,
	);

	const handleQuantityChange = (itemId: string, quantity: number) => {
		setPurchaseItems((items) =>
			items.map((item) =>
				item.id === itemId
					? {
							...item,
							quantity,
							amount: quantity * 500,
						}
					: item,
			),
		);
	};

	const handlePayment = (itemId: string) => {
		const item = purchaseItems.find((i) => i.id === itemId);
		if (!item) return;

		const paymentWithDescription = {
			...item,
		};

		setSelectedPayment(paymentWithDescription);
		setShowPaymentModal(true);
	};

	const handlePaymentComplete = () => {
		if (!selectedPayment) return;

		const pagesAdded = Math.floor(
			selectedPayment.amount / MOCK_PAYMENT_INFO.pricePerPage,
		);
		setCurrentBalance((prev) => prev + pagesAdded);

		const studentInfo = localStorage.getItem('userData');
		if (studentInfo) {
			const parsedInfo = JSON.parse(studentInfo) as StudentInfo;
			const updatedInfo = {
				...parsedInfo,
				paper: parsedInfo.pageCount + pagesAdded,
			};
			localStorage.setItem('userData', JSON.stringify(updatedInfo));
		}

		setPurchaseItems((items) =>
			items.map((item) =>
				item.id === selectedPayment.id
					? { ...item, status: 'completed' as const }
					: item,
			),
		);

		const newPaymentHistoryItem: PaymentHistoryItem = {
			id: crypto.randomUUID(),
			content: selectedPayment.content,
			quantity: selectedPayment.quantity,
			amount: selectedPayment.amount,
			date: new Date().toLocaleString('vi-VN'),
			status: 'completed',
		};
		setPaymentHistory((prev) => [...prev, newPaymentHistoryItem]);

		setShowPaymentModal(false);
		setSelectedPayment(null);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<Helmet>
				<title>Thanh toán | HCMUT</title>
			</Helmet>
			<div className='mb-8 flex items-center justify-between border-b border-gray-200 pb-6'>
				<div className='flex items-center gap-6'>
					<img
						src={LogoWebsite}
						alt='HCMUT Logo'
						className='h-16 w-auto object-contain'
					/>
					<div className='flex flex-col'>
						<h1 className='text-xl font-bold text-gray-800'>
							Trường Đại học Bách Khoa TP.HCM
						</h1>
						<span className='text-sm text-gray-600'>
							Ho Chi Minh City University of Technology
						</span>
					</div>
				</div>

				<div className='flex flex-col items-end'>
					<span className='text-sm font-medium text-gray-600'>
						Cổng thanh toán điện tử
					</span>
					<span className='text-2xl font-bold text-blue-600'>
						BK PAY
					</span>
				</div>
			</div>

			<div className='mb-6 text-center'>
				<p className='text-lg font-medium italic text-gray-600'>
					Tiết kiệm chi phí, nâng tầm giá trị
				</p>
			</div>

			<div className='mb-8 rounded-lg bg-white p-4 shadow'>
				<div className='mb-4 flex items-center gap-2 text-lg font-semibold'>
					<FontAwesomeIcon
						icon={faFileInvoice}
						className='text-blue-600'
					/>
					<h2>MUA GIẤY</h2>
				</div>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-4 py-2 text-left'>
									Nội dung
								</th>
								<th className='px-4 py-2 text-left'>
									Số lượng
								</th>
								<th className='px-4 py-2 text-left'>
									Thành tiền
								</th>
								<th className='px-4 py-2 text-left'>
									Chọn thanh toán
								</th>
							</tr>
						</thead>
						<tbody>
							{purchaseItems.map((item) => (
								<tr key={item.id} className='border-t'>
									<td className='px-4 py-2'>
										{item.content}
									</td>
									<td className='px-4 py-2'>
										<select
											value={item.quantity}
											onChange={(e) =>
												handleQuantityChange(
													item.id,
													parseInt(e.target.value),
												)
											}
											className='rounded border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none'
										>
											{quantityOptions.map((value) => (
												<option
													key={value}
													value={value}
												>
													{value} trang
												</option>
											))}
										</select>
									</td>
									<td className='px-4 py-2'>
										{item.amount.toLocaleString()}đ
									</td>
									<td className='px-4 py-2'>
										<button
											onClick={() =>
												handlePayment(item.id)
											}
											className='rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600'
										>
											Thanh toán
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
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
									Nội dung
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
							{paymentHistory.map((item, index) => (
								<tr key={item.id} className='border-t'>
									<td className='px-4 py-2'>{index + 1}</td>
									<td className='px-4 py-2'>
										{item.content}
									</td>
									<td className='px-4 py-2'>
										{item.quantity}
									</td>
									<td className='px-4 py-2'>
										{item.amount.toLocaleString()}đ
									</td>
									<td className='px-4 py-2'>{item.date}</td>
									<td className='px-4 py-2'>
										<span className='text-green-600'>
											Đã thanh toán
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className='rounded-lg bg-white p-4 shadow'>
				<div className='flex items-center gap-2 text-lg font-semibold'>
					<FontAwesomeIcon
						icon={faWallet}
						className='text-blue-600'
					/>
					<h2>Số trang dư hiện tại: {currentBalance} trang</h2>
				</div>
			</div>

			{showPaymentModal && selectedPayment && (
				<PaymentModal
					payment={selectedPayment}
					onClose={() => setShowPaymentModal(false)}
					onComplete={handlePaymentComplete}
					qrConfig={MOCK_PAYMENT_INFO}
				/>
			)}
		</div>
	);
};

export default PaymentPage;
