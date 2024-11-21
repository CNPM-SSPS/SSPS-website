import { FC } from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='w-full max-w-md animate-[fadeIn_0.2s_ease-in] rounded-lg bg-white p-6 shadow-xl'>
				<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
				<p className='mt-2 text-sm text-gray-500'>{message}</p>
				<div className='mt-4 flex justify-end gap-3'>
					<button
						onClick={onCancel}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
