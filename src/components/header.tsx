// components/Header.tsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-300 to-blue-400 h-16">
      <div className="mx-auto flex items-center justify-between h-full px-4">
        <nav className="flex items-center space-x-6">
          <div className="flex items-center">
            <Image src="/logo2.png" alt="Logo" width={60} height={60} />
          </div>

          <Link href="/">
            <Button variant="blue" className="flex-grow h-full">Trang chủ</Button>
          </Link>
          <Link href="/quan-ly-tai-khoan">
            <Button variant="blue" className=" h-full">Quản lý tài khoản</Button>
          </Link>
          <Link href="/in-tai-lieu">
            <Button variant="blue" className="flex-grow h-full">In tài liệu</Button>
          </Link>
          <Link href="/thanh-toan">
            <Button variant="blue" className="flex-grow h-full">Thanh toán</Button>
          </Link>
          <Link href="/lich-su-in">
            <Button variant="blue" className="flex-grow h-full">Lịch sử in</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
