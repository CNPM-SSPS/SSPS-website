import { faEnvelope, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SettingPage: React.FC = () => {
  // Initialize state for selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // Update state with the new date
  };

  // Initialize state for file formats
  const [fileFormats, setFileFormats] = useState<string[]>(() => {
    // Load from localStorage if exists, otherwise return empty array
    const storedFormats = localStorage.getItem('fileFormats');
    return storedFormats ? JSON.parse(storedFormats) : [];
  });
  const [inputValue, setInputValue] = useState<string>('');

  // Handle input change for file formats
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle adding file format
  const handleAddFormat = () => {
    if (inputValue && !fileFormats.includes(inputValue)) {
      const updatedFormats = [...fileFormats, inputValue];
      setFileFormats(updatedFormats);
      localStorage.setItem('fileFormats', JSON.stringify(updatedFormats)); // Save to localStorage
      setInputValue('');
    }
  };

  // Handle removing a file format
  const handleRemoveFormat = (format: string) => {
    const updatedFormats = fileFormats.filter(item => item !== format);
    setFileFormats(updatedFormats);
    localStorage.setItem('fileFormats', JSON.stringify(updatedFormats)); // Save to localStorage
  };

  // State for Default Monthly Pages
  const [defaultMonthlyPages, setDefaultMonthlyPages] = useState<string>(() => {
    // Load from localStorage if exists, otherwise return empty string
    const storedPages = localStorage.getItem('defaultMonthlyPages');
    return storedPages ? storedPages : '';
  });

  // Handle input change for Default Monthly Pages
  const handleMonthlyPagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultMonthlyPages(e.target.value);
    localStorage.setItem('defaultMonthlyPages', e.target.value); // Save to localStorage
  };

  // Initialize state for Monthly Paper Issue Date (optional, depending on if you want to persist it)
  useEffect(() => {
    // Optionally, persist selectedDate to localStorage if needed
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate.toISOString());
    }
  }, [selectedDate]);

  // Load selected date from localStorage on component mount
  useEffect(() => {
    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(new Date(storedDate)); // Parse and set the date if available
    }
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Default Monthly Pages */}
        <div className="relative p-4 bg-white rounded-lg shadow-md">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Số Trang Mặc Định Hàng Tháng
          </label>
          <input
            type="text"
            value={defaultMonthlyPages}
            onChange={handleMonthlyPagesChange}
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số trang sinh viên được cấp hàng tháng"
          />
        </div>

        {/* Monthly Paper Issue Date */}
        <div className="relative p-4 bg-white rounded-lg shadow-md">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Ngày Cấp Giấy Hằng Tháng
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy" // Customize the display format if needed
          />
        </div>

        {/* Allowed File Format */}
        <div className="relative p-4 bg-white rounded-lg shadow-md">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Định dạng file cho phép
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {fileFormats.map((format, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-1 bg-gray-200 text-sm rounded-lg"
              >
                {format}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveFormat(format)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFormat()} // Add format on Enter
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập định dạng file được phép (VD: jpg, png)"
            />
            <button
              onClick={handleAddFormat}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
