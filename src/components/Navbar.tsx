"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full flex items-center py-4 border-b-[1px]">
      <div className="flex px-5 items-center justify-between max-w-[1200px] w-full mx-auto">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo.svg"
            alt="Request Network"
            width={100}
            height={200}
          />

          <ul
            className="flex items-center space-x-4"
            role="tablist"
            aria-label="Main Navigation"
          >
            <li className="flex items-center space-x-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#099C77] transition-colors duration-200 border-b-2 border-transparent data-[active=true]:border-[#099C77] data-[active=true]:text-[#099C77]"
                data-active={pathname === "/"}
                role="tab"
                aria-selected={pathname === "/"}
              >
                Demo
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Link
                href="/playground"
                className="text-gray-600 hover:text-[#099C77] transition-colors duration-200 border-b-2 border-transparent data-[active=true]:border-[#099C77] data-[active=true]:text-[#099C77]"
                data-active={pathname === "/playground"}
                role="tab"
                aria-selected={pathname === "/playground"}
              >
                Playground
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
