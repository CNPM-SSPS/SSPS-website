import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black text-white py-8">
            <div className="container mx-auto pl-8"> 
                <p className="text-lg font-semibold">Tổ kỹ thuật P.ĐT/Technician</p>

                <div className="my-12"></div>

                <p>Email: <a href="mailto:ddthu@hcmut.edu.vn" className="text-blue-400">ddthu@hcmut.edu.vn</a></p>
                <p>ĐT (Tel.): (84-8) 38647256 - 5258</p>

                <div className="mt-8">
                    <p>Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) nhà trường vui lòng liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109A5 để được hỗ trợ.</p>
                    <p>(For HCMUT account, please contact to : Data and Information Technology Center)</p>
                    <p>Email: <a href="mailto:dl-cntt@hcmut.edu.vn" className="text-blue-400">dl-cntt@hcmut.edu.vn</a></p>
                    <p>ĐT (Tel.): (84-8) 38647256 - 5200</p>
                </div>
            </div>
        </footer>
    );
}
