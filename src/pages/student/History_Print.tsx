import React, { useState } from "react";

// Interface để định nghĩa kiểu dữ liệu
interface PrintHistory {
  printDate: string; // Ngày và giờ in
  documentName: string; // Tên tài liệu
  documentFormat: "PDF" | "docx"; // Định dạng tài liệu
  documentSize: number; // Kích thước tài liệu (MB)
  printCount: number; // Số lượng bản in
  paperSize: "A4" | "A3"; // Khổ giấy
  colorMode: string; // Màu sắc
  printType: string; // Kiểu in
  printerCode: string; // Mã máy in
  location: string; // Địa điểm
  cost: string; // Chi phí
  status: string; // Trạng thái
  printError: string; // Lỗi khi in
  notes: string; // Ghi chú thêm
}

const mockData: PrintHistory[] = [
  {
    printDate: "2024-10-05 10:30",
    documentName: "Hồ sơ giáo dục học thuật",
    documentFormat: "PDF",
    documentSize: 2,
    printCount: 3,
    paperSize: "A4",
    colorMode: "In màu",
    printType: "Một mặt",
    printerCode: "M100",
    location: "Tầng 1, H1",
    cost: "10,000 VND",
    status: "Hoàn thành",
    printError: "Không có",
    notes: "Không có",
  },
  {
    printDate: "2024-10-02 14:45",
    documentName: "Luận văn tốt nghiệp",
    documentFormat: "docx",
    documentSize: 5,
    printCount: 12,
    paperSize: "A3",
    colorMode: "In đen trắng",
    printType: "Hai mặt",
    printerCode: "M456",
    location: "Tầng 2, H6",
    cost: "30,000 VND",
    status: "Lỗi",
    printError: "Kẹt giấy",
    notes: "Đã khắc phục",
  },
];

const PrintHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Lọc dữ liệu dựa trên các tiêu chí tìm kiếm
  const filteredData = mockData.filter((item) => {
    const matchesSearchTerm = item.documentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrinter =
      !selectedPrinter || item.printerCode === selectedPrinter;
    const matchesLocation =
      !selectedLocation || item.location === selectedLocation;

    return matchesSearchTerm && matchesPrinter && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lịch Sử In</h1>
        {/* Form tìm kiếm */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Nhập tên tài liệu để tìm kiếm lịch sử"
              className="flex-grow rounded border px-4 py-2 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="rounded border px-4 py-2 shadow-sm"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option value="">Mã máy in</option>
              <option value="M100">M100</option>
              <option value="M456">M456</option>
            </select>
            <select
              className="rounded border px-4 py-2 shadow-sm"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Địa điểm máy in</option>
              <option value="Tầng 1, H1">Tầng 1, H1</option>
              <option value="Tầng 2, H6">Tầng 2, H6</option>
            </select>
          </div>
          <button className="mt-4 rounded bg-yellow-500 px-4 py-2 text-white shadow-sm hover:bg-yellow-600">
            Tìm kiếm
          </button>
        </div>

        {/* Danh sách lịch sử in */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="rounded border bg-gray-100 p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-700">
                Lần In {index + 1}:
              </h2>
              <ul className="mt-2 text-gray-600">
                <li>
                  <strong>Ngày và giờ in:</strong> {item.printDate}
                </li>
                <li>
                  <strong>Tên tài liệu:</strong> {item.documentName}
                </li>
                <li>
                  <strong>Định dạng tài liệu:</strong> {item.documentFormat}
                </li>
                <li>
                  <strong>Kích thước tài liệu:</strong> {item.documentSize} MB
                </li>
                <li>
                  <strong>Số lượng bản in:</strong> {item.printCount}
                </li>
                <li>
                  <strong>Khổ giấy:</strong> {item.paperSize}
                </li>
                <li>
                  <strong>Màu sắc:</strong> {item.colorMode}
                </li>
                <li>
                  <strong>Kiểu in:</strong> {item.printType}
                </li>
                <li>
                  <strong>Mã máy in:</strong> {item.printerCode}
                </li>
                <li>
                  <strong>Địa điểm:</strong> {item.location}
                </li>
                <li>
                  <strong>Chi phí:</strong> {item.cost}
                </li>
                <li>
                  <strong>Trạng thái:</strong> {item.status}
                </li>
                <li>
                  <strong>Lỗi khi in:</strong> {item.printError}
                </li>
                <li>
                  <strong>Ghi chú thêm:</strong> {item.notes}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintHistoryPage;
