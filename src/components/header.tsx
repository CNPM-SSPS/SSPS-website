// components/Header.tsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-green-300 to-blue-400 p-4">
      {/*  Logo~~~
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
      </div>*/}
      
      <nav className="flex space-x-6">
        <Link href="/">
          <Button variant="blue" className="text-black hover:text-white">Trang chủ</Button>
        </Link>
        <Link href="/quan-ly-tai-khoan">
          <Button variant="blue" className="text-black hover:text-white">Quản lý tài khoản</Button>
        </Link>
        <Link href="/in-tai-lieu">
          <Button variant="blue" className="text-black hover:text-white">In tài liệu</Button>
        </Link>
        <Link href="/thanh-toan">
          <Button variant="blue" className="text-black hover:text-white">Thanh toán</Button>
        </Link>
        <Link href="/lich-su-in">
          <Button variant="blue" className="text-black hover:text-white">Lịch sử in</Button>
        </Link>
      </nav>
    </header>
  );
}
