import logo from '@/assets/images/logo.jpg';
import printImage from '@/assets/images/print-machine.jpg';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface AuthLayoutProps {
	children: ReactNode;
	title: string;
	heading: string;
	subheading: string;
}

const AuthLayout = ({
	children,
	title,
	heading,
	subheading,
}: AuthLayoutProps) => {
	return (
		<>
			<Helmet>
				<title>{title} | HCMUT</title>
			</Helmet>

			<div className='w-full rounded-lg bg-gradient-to-br from-blue-50 to-white'>
				<div className='mx-auto flex flex-col px-4 lg:py-8'>
					<div className='flex flex-col items-center space-y-6 py-8 lg:flex-row lg:items-start lg:space-x-6'>
						<img
							src={logo}
							alt='Logo HCMUT'
							className='h-24 w-auto rounded-lg transition-transform hover:scale-105 sm:h-32'
						/>
						<h2 className='text-center text-3xl font-extrabold tracking-tight text-gray-900 lg:text-left'>
							{heading}
							<br />
							<span className='mt-2 block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
								{subheading}
							</span>
						</h2>
					</div>

					<div className='flex flex-col items-center justify-between'>
						<div className='w-full'>
							<div className='grid gap-8 rounded-3xl bg-white/80 shadow-xl backdrop-blur-sm lg:grid-cols-2'>
								<div className='hidden lg:block'>
									<div className='relative h-full w-full overflow-hidden rounded-2xl'>
										<img
											src={printImage}
											alt='Printer'
											className='h-full w-full object-cover'
										/>
										<div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent' />
									</div>
								</div>

								<div className='flex flex-col justify-center p-8 lg:pl-8'>
									{children}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthLayout;
