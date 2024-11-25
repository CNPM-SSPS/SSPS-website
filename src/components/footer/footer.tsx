import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
	return (
		<footer className='mt-auto bg-gradient-to-br from-blue-800 to-blue-900 px-4 py-8 text-blue-50'>
			<div className='container mx-auto max-w-7xl'>
				<div className='grid gap-8 md:grid-cols-2'>
					<div className='space-y-3'>
						<h3 className='text-lg font-semibold text-white'>
							Tổ kỹ thuật P.ĐT/Technician
						</h3>
						<div className='flex flex-col space-y-2 text-sm'>
							<a
								href='mailto:ddthu@hcmut.edu.vn'
								className='flex items-center gap-2 transition-colors hover:text-blue-200'
							>
								<FontAwesomeIcon
									icon={faEnvelope}
									className='w-4 text-blue-300'
								/>
								<span>Email: ddthu@hcmut.edu.vn</span>
							</a>
							<a
								href='tel:84838647256'
								className='flex items-center gap-2 transition-colors hover:text-blue-200'
							>
								<FontAwesomeIcon
									icon={faPhone}
									className='w-4 text-blue-300'
								/>
								<span>ĐT (Tel.): (84-8) 38647256 - 5258</span>
							</a>
						</div>
					</div>

					<div className='space-y-4 text-sm'>
						<p className='leading-relaxed text-blue-100'>
							Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu)
							nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công
							nghệ Thông tin, phòng 109A5 để được hỗ trợ.
						</p>

						<div className='space-y-3'>
							<p className='font-medium text-white'>
								(For HCMUT account, please contact to: Data and
								Information Technology Center)
							</p>
							<div className='flex flex-col space-y-2'>
								<a
									href='mailto:dl-cntt@hcmut.edu.vn'
									className='flex items-center gap-2 transition-colors hover:text-blue-200'
								>
									<FontAwesomeIcon
										icon={faEnvelope}
										className='w-4 text-blue-300'
									/>
									<span>Email: dl-cntt@hcmut.edu.vn</span>
								</a>
								<a
									href='tel:84838647256'
									className='flex items-center gap-2 transition-colors hover:text-blue-200'
								>
									<FontAwesomeIcon
										icon={faPhone}
										className='w-4 text-blue-300'
									/>
									<span>
										ĐT (Tel.): (84-8) 38647256 - 5200
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
