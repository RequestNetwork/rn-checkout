import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { HomeIcon, Book, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { GoogleTagManager } from "@next/third-parties/google";
import VersionDisplay from "@/components/VersionBadge";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Request Network Checkout",
  description:
    "A interactive playground for the Request Checkout payment widget.",
};

const DOCK_ICONS = [
  {
    href: "https://request.network",
    icon: HomeIcon,
    label: "Request Network Website",
  },
  {
    href: "https://docs.request.network/building-blocks/templates",
    icon: Book,
    label: "Documentation",
  },
  {
    href: "https://www.npmjs.com/package/@requestnetwork/payment-widget",
    icon: Package,
    label: "NPM Package",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} pb-24`}>
        <Navbar />
        {children}
        <TooltipProvider>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Dock direction="middle">
              {DOCK_ICONS.map((item) => (
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <item.icon className="size-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
            </Dock>
          </div>
        </TooltipProvider>
        <VersionDisplay githubRelease="https://github.com/RequestNetwork/rn-checkout/releases" />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
    </html>
  );
}
