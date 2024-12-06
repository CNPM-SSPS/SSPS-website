import React from "react";
import { Helmet } from "react-helmet-async";

const HelpPage = () => {
  return (
    <>
      <Helmet>
        <title>Hỗ Trợ Kỹ Thuật</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl bg-white p-8 shadow-md">
          {/* Tiêu đề */}
          <h1 className="text-2xl font-bold text-gray-800">
            Yêu cầu cố vấn kỹ thuật <span className="text-blue-600">(HOTLINE: 0123 456 789)</span>
          </h1>
          {/* Mục 1 */}
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">1. Kết nối và cài đặt máy in:</h2>
            <ul className="ml-4 list-disc text-gray-700">
              <li>Hướng dẫn cách kết nối máy in với máy tính hoặc thiết bị di động.</li>
              <li>Hỗ trợ cài đặt driver máy in và phần mềm liên quan.</li>
              <li>Kiểm tra và khắc phục các vấn đề về kết nối mạng (Wi-Fi hoặc cáp).</li>
            </ul>
          </div>
          {/* Mục 2 */}
          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">2. Sử dụng và vận hành máy in:</h2>
            <ul className="ml-4 list-disc text-gray-700">
              <li>Hướng dẫn cách sử dụng các chức năng cơ bản của máy in (in, photocopy, scan, fax).</li>
              <li>
                Cách chọn và thay đổi các thiết lập in (khổ giấy, màu sắc, số lượng bản in, in hai mặt, v.v.).
              </li>
            </ul>
          </div>
          {/* Mục 3 */}
          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">3. Xử lý sự cố máy in:</h2>
            <ul className="ml-4 list-disc text-gray-700">
              <li>Giải quyết các lỗi thường gặp (kẹt giấy, mực in không đều, máy in không nhận lệnh, v.v.).</li>
              <li>Hướng dẫn cách kiểm tra và khắc phục các lỗi hiển thị trên máy in.</li>
              <li>Kiểm tra máy in không phản hồi hoặc không in được.</li>
            </ul>
          </div>

          {/* Yêu cầu đặc biệt */}
          <h1 className="mt-8 text-2xl font-bold text-gray-800">
            Yêu cầu hỗ trợ đặc biệt <span className="text-blue-600">(HOTLINE: 0123 456 466)</span>
          </h1>
          {/* Mục 1 */}
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">1. Tư vấn chọn máy in:</h2>
            <ul className="ml-4 list-disc text-gray-700">
              <li>Tư vấn sinh viên chọn máy in phù hợp với nhu cầu sử dụng (máy in laser, máy in phun, máy in đa chức năng).</li>
            </ul>
          </div>
          {/* Mục 2 */}
          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">2. Hỗ trợ nâng cao:</h2>
            <ul className="ml-4 list-disc text-gray-700">
              <li>
                Hỗ trợ sinh viên thực hiện các yêu cầu in ấn đặc biệt (in 3D, in màu chất lượng cao, in tài liệu chuyên ngành).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
