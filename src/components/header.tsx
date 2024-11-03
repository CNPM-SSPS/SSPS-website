// components/Header.tsx
'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-300 to-blue-400 h-16">
      <div className="mx-auto flex items-center justify-between h-full px-4">
        <nav className="flex items-center ">
          <div className="flex items-center">
            <Image src="/logo2.png" alt="Logo" width={60} height={60} />
          </div>

          <Link href="/">
            <Button variant="blue" 
            className={`h-16 ${pathname === "/" ? "bg-blue-500 text-white" : "text-black hover:text-white"}`}
            >
              Trang chủ
            </Button>
          </Link>



          <Link href="/quan-ly-tai-khoan">
            <Button variant="blue" 
              className={`h-16 ${pathname === "/quan-ly-tai-khoan" ? "bg-blue-500 text-white" : "text-black hover:text-white"}`}
            >
              Quản lý tài khoản
            </Button>
          </Link>
          <Link href="/in-tai-lieu">
            <Button variant="blue"               
            className={`h-16 ${pathname === "/in-tai-lieu" ? "bg-blue-500 text-white" : "text-black hover:text-white"}`}
            >
              In tài liệu</Button>
          </Link>
          <Link href="/thanh-toan">
            <Button variant="blue"               
            className={`h-16 ${pathname === "/thanh-toan" ? "bg-blue-500 text-white" : "text-black hover:text-white"}`}
            >
              Thanh toán</Button>
          </Link>
          <Link href="/lich-su-in">
            <Button variant="blue"               
            className={`h-16 ${pathname === "/lich-su-in" ? "bg-blue-500 text-white" : "text-black hover:text-white"}`}
            >
              Lịch sử in</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
