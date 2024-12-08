import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { writeFile } from 'fs/promises';
import path, { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig, Plugin } from 'vite';

interface BuildFileContent {
	path: string;
	content: string;
}
const BUILD_FILES: BuildFileContent[] = [
	{
		path: '_redirects',
		content: '/*    /index.html    200',
	},
	{
		path: '.htaccess',
		content: `<IfModule mod_rewrite.c>\n\tRewriteEngine On\n\tRewriteBase /\n\tRewriteCond %{REQUEST_FILENAME} !-f\n\tRewriteCond %{REQUEST_FILENAME} !-d\n\tRewriteRule ^ index.html [L]\n</IfModule>`,
	},
	{
		path: 'vercel.json',
		content: JSON.stringify(
			{
				rewrites: [
					{
						source: '/(.*)',
						destination: '/index.html',
					},
				],
			},
			null,
			2,
		),
	},
];

const generateRandomName = (): string =>
	Math.random().toString(36).substring(7);
const createBuildFilesPlugin = (): Plugin => ({
	name: 'create-build-files',
	apply: 'build',
	closeBundle: async () => {
		try {
			await Promise.all(
				BUILD_FILES.map(async ({ path: filePath, content }) => {
					const fullPath = resolve(__dirname, 'dist', filePath);
					await writeFile(fullPath, content);
				}),
			);
		} catch (err) {
			console.error('Error creating build files:', err);
		}
	},
});

export default defineConfig({
	plugins: [react(), createBuildFilesPlugin()],

	build: {
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					const info = assetInfo.source
						? assetInfo
						: assetInfo.type === 'asset'
							? assetInfo
							: { names: [] };
					const ext = info.names?.[0]?.split('.').pop() ?? 'js';
					return `assets/${generateRandomName()}.${ext}`;
				},
				chunkFileNames: () => `assets/${generateRandomName()}.js`,
				entryFileNames: () => `assets/${generateRandomName()}.js`,
			},
		},
	},

	server: {
		host: '0.0.0.0',
		proxy: {
			'/v1': {
				target: 'https://7d35-2403-e200-19e-4797-714a-1a6a-509b-bb2b.ngrok-free.app',
				changeOrigin: true,
				secure: false,
				configure: (proxy) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// Add your custom header here
						proxyReq.setHeader(
							'ngrok-skip-browser-warning',
							'ngrokplease',
						);
					});
				},
			},
		},
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()],
		},
	},
});
