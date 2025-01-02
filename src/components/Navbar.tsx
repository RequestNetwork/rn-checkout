"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import DropDown from "./DropDown";
import BurgerMenu from "@/icons/BurgerMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const Navbar = () => {
  const pathname = usePathname();

  const NavLinks = () => (
    <ul
      className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4"
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
  );

  const ActionButtons = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
      <DropDown
        title="Need help?"
        items={[
          {
            name: "Github Discussions",
            href: "https://github.com/orgs/RequestNetwork/discussions",
          },
          {
            name: "Discord",
            href: "https://discord.com/channels/468974345222619136/1103420140181274645",
          },
        ]}
      />
      <Link
        target="_blank"
        rel="noreferrer noopener"
        href={process.env.NEXT_PUBLIC_INTEGRATION_URL as string}
        className="flex items-center gap-[6px] bg-transparent text-green font-medium text-[14px] hover:text-dark-green"
      >
        Integrate in your app
        <ArrowUpRight />
      </Link>
      <Button className="bg-green hover:bg-dark-green w-full md:w-auto">
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={process.env.NEXT_PUBLIC_DEMO_URL as string}
        >
          Book a demo
        </Link>
      </Button>
    </div>
  );

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

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavLinks />
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:block">
          <ActionButtons />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <BurgerMenu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-8 mt-8">
                <NavLinks />
                <ActionButtons />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
