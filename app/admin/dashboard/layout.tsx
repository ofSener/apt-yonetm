"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LuLayoutDashboard, 
  LuUsers, 
  LuWallet, 
  LuClipboardList, 
  LuSettings,
  LuBell,
  LuMenu,
  LuX,
  LuInfo,
  LuBuilding2
} from "react-icons/lu";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    label: "Daire Sakinleri",
    href: "/admin/residents",
    icon: LuUsers,
  },
  {
    label: "Aidat Yönetimi",
    href: "/admin/payments",
    icon: LuWallet,
  },
  {
    label: "Duyurular",
    href: "/admin/announcements",
    icon: LuBell,
  },
  {
    label: "Raporlar",
    href: "/admin/reports",
    icon: LuClipboardList,
  },
  {
    label: "Yardım & Destek",
    href: "/admin/help",
    icon: LuInfo,
  },
  {
    label: "Ayarlar",
    href: "/admin/settings",
    icon: LuSettings,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 text-xl font-bold text-gray-800 dark:text-white"
          >
            <LuBuilding2 className="h-8 w-8 text-blue-600" />
            <span>AptYönetim</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LuX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    isActive
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Mobile Menu Toggle */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 mr-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LuMenu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 