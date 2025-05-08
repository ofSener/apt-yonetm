"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuBuilding2, LuLayoutDashboard, LuFileText, LuLogOut, LuBell } from "react-icons/lu";
import { MdOutlineAnnouncement, MdOutlinePoll } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { BsTools } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationDropdown from "@/components/NotificationDropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navigation = [
    { name: "Gösterge Paneli", href: "/dashboard", icon: LuLayoutDashboard },
    { name: "Ödemeler", href: "/dashboard/payments", icon: FaMoneyBillWave },
    { name: "Duyurular", href: "/dashboard/announcements", icon: MdOutlineAnnouncement },
    { name: "Bakım ve Arıza", href: "/dashboard/maintenance", icon: BsTools },
    { name: "Anketler", href: "/dashboard/polls", icon: MdOutlinePoll },
    { name: "Dokümanlar", href: "/dashboard/documents", icon: LuFileText },
    { name: "Bildirimler", href: "/dashboard/notifications", icon: LuBell },
  ];

  const userNavigation = [
    { name: "Profilim", href: "/dashboard/profile", icon: RiUserSettingsLine },
  ];

  if (session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER") {
    navigation.push(
      { name: "Giderler", href: "/dashboard/expenses", icon: FaMoneyBillWave },
    );
  }

  if (session?.user?.role === "ADMIN") {
    navigation.push(
      { name: "Yönetici Paneli", href: "/admin", icon: RiUserSettingsLine },
    );
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 z-50 flex w-72 flex-col bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <LuBuilding2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AptYonetim</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-6">
            {navigation.map((item) => {
              const isActive = 
                pathname === item.href || 
                (pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard") || 
                (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 px-6">
            <nav className="space-y-1">
              {userNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LuLogOut
                  className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  aria-hidden="true"
                />
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400 lg:hidden"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <ThemeToggle />
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {session?.user?.role === "ADMIN" 
                        ? "Admin" 
                        : session?.user?.role === "MANAGER" 
                          ? "Yönetici" 
                          : "Sakin"}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 