import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html'],
	theme: {
		extend: {
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;
