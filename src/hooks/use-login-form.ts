import { useState } from 'react';
import { toast } from 'react-hot-toast';

type LoginType = 'student' | 'admin';

interface LoginFormData {
	username: string;
	password: string;
}

export const useLoginForm = () => {
	const [loginType, setLoginType] = useState<LoginType>('student');
	const [formData, setFormData] = useState<LoginFormData>({
		username: '',
		password: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		toast.success('Login successful');
	};

	return {
		loginType,
		formData,
		setLoginType,
		handleInputChange,
		handleSubmit,
	};
};
