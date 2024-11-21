import '@/assets/styles/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/app-router';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<HelmetProvider>
			<AppRouter />
			<Toaster />
		</HelmetProvider>
	</React.StrictMode>,
);
