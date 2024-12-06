import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
interface Payment {
	amount: number;
	content: string;
}

interface QRConfig {
	bankId: string;
	accountNo: string;
	accountName: string;
	template: string;
}

interface PaymentModalProps {
	payment: Payment;
	onClose: () => void;
	onComplete: () => void;
	qrConfig: QRConfig;
}

const PaymentModal = ({
	payment,
	onClose,
	onComplete,
	qrConfig,
}: PaymentModalProps) => {
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					onComplete();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [onComplete]);

	const qrUrl = `https://img.vietqr.io/image/${qrConfig.bankId}-${qrConfig.accountNo}-${qrConfig.template}.png?amount=${payment.amount}&addInfo=${encodeURIComponent(payment.content)}&accountName=${encodeURIComponent(qrConfig.accountName)}`;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='relative w-full max-w-md rounded-lg bg-white p-6'>
				<button
					onClick={onClose}
					className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>

				<h2 className='mb-4 text-xl font-bold'>
					Quét mã QR để thanh toán
				</h2>

				<div className='mb-4 text-center'>
					<img
						src={qrUrl}
						alt='Payment QR Code'
						className='mx-auto h-64 w-64'
					/>
				</div>

				<div className='mb-4 text-center'>
					<p className='text-lg font-semibold'>
						Số tiền: {payment.amount.toLocaleString()}đ
					</p>
					<p className='text-sm text-gray-600'>{payment.content}</p>
				</div>

				<div className='text-center'>
					<p className='text-sm text-gray-600'>
						Tự động đóng sau{' '}
						<span className='font-bold text-blue-600'>
							{countdown}
						</span>{' '}
						giây
					</p>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
