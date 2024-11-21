import { ComponentPropsWithoutRef } from 'react';

interface CustomCheckboxProps
	extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
	label?: string;
}

const CustomCheckbox = ({ label, ...props }: CustomCheckboxProps) => {
	return (
		<label className='flex cursor-pointer items-center gap-2'>
			<div className='relative'>
				<input type='checkbox' className='peer sr-only' {...props} />
				<div className='h-5 w-5 rounded border-2 border-gray-300 transition-all peer-checked:border-white peer-checked:bg-blue-600 peer-checked:ring-2 peer-checked:ring-blue-400'></div>
			</div>
			{label && <span className='text-sm text-gray-700'>{label}</span>}
		</label>
	);
};

export default CustomCheckbox;
