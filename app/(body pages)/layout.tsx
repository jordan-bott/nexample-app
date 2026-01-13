import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="border-b-2 border-periwinkle w-screen flex justify-end">
        <OrganizationSwitcher />
        <Link
          className="text-sm text-periwinkle p-4 hover:text-dark-green"
          href="/"
        >
          Home Page
        </Link>
      </div>
      {children}
    </>
  );
}
