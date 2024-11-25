import React from 'react';
import anhdhbk from '@/assets/images/anhdhbk.jpg';
import { Helmet } from 'react-helmet-async';
const Lorem: React.FC = () => {
	return (
		<div className='p-8 sm:p-0'>
			<Helmet>
				<title>Trang chủ | HCMUT</title>
			</Helmet>
			<img
				src={anhdhbk}
				alt='anhdhbk'
				className='h-full w-full object-cover'
			/>
		</div>
	);
};

export default Lorem;
