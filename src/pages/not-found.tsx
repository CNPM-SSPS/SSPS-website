import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<>
			<Helmet>
				<title>404 | HCMUT</title>
			</Helmet>
			<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white'>
				<div className='animate-[fadeIn_0.5s_ease-in] space-y-6 text-center'>
					<div className='animate-[bounce_1s_infinite] text-9xl font-bold text-blue-300'>
						404
					</div>

					<div className='text-4xl font-bold text-gray-700'>
						<div className='space-y-2'>
							<div>Chưa có làm trang này</div>
							<div className='text-5xl'>¯\_(ツ)_/¯</div>
						</div>
					</div>
					<Link
						to='/'
						className='inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600 hover:shadow-xl'
					>
						<FontAwesomeIcon icon={faHome} />
						<span>Về trang chủ</span>
					</Link>
				</div>
			</div>
		</>
	);
};

export default NotFound;
