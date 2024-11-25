import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const ScrollToTop: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(window.scrollY > 300);
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	return (
		<button
			type='button'
			aria-label='Scroll to top'
			onClick={scrollToTop}
			className={`fixed bottom-8 right-8 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
				isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
			}`}
		>
			<FontAwesomeIcon icon={faArrowUp} className='h-5 w-5' />
		</button>
	);
};

export default ScrollToTop;
