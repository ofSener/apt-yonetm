"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  LuLayoutDashboard, 
  LuUsers, 
  LuWallet, 
  LuClipboardList, 
  LuSettings,
  LuBell,
  LuLogOut,
  LuPlus,
  LuChevronRight,
  LuSearch
} from "react-icons/lu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const mockData = {
  payments: [
    { month: "Ocak", amount: 15000 },
    { month: "Şubat", amount: 14000 },
    { month: "Mart", amount: 16500 },
    { month: "Nisan", amount: 17000 },
    { month: "Mayıs", amount: 15800 },
    { month: "Haziran", amount: 16200 },
  ],
  residents: 24,
  pendingPayments: 4,
  announcementCount: 2,
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    // Admin olmayanlar için yönlendirme
    if (!session || session.user.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 py-4 px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Yönetici Paneli</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <LuBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LuLogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Daire Sakinleri</p>
                <h3 className="text-3xl font-bold mt-1">{mockData.residents}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <LuUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen Ödemeler</p>
                <h3 className="text-3xl font-bold mt-1">{mockData.pendingPayments}</h3>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <LuWallet className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Duyurular</p>
                <h3 className="text-3xl font-bold mt-1">{mockData.announcementCount}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <LuBell className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gelir Grafiği */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Aylık Aidat Ödemeleri</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.payments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" name="Ödenen Toplam (₺)" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hızlı Erişim Bölümü */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Hızlı Erişim</h2>
              <div className="space-y-4">
                <Link href="/admin/residents" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                      <LuUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Daire Sakinleri Yönetimi</span>
                  </div>
                  <LuChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                
                <Link href="/admin/payments" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                      <LuWallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Aidat Yönetimi</span>
                  </div>
                  <LuChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                
                <Link href="/admin/announcements" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-3">
                      <LuBell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Duyurular</span>
                  </div>
                  <LuChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                
                <Link href="/admin/settings" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                      <LuSettings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Sistem Ayarları</span>
                  </div>
                  <LuChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Son Etkinlikler</h2>
              <div className="space-y-4">
                <div className="flex items-start p-3 border-l-4 border-green-500 bg-gray-50 dark:bg-gray-700/30 rounded-r-lg">
                  <div className="ml-2">
                    <p className="text-sm font-medium">Yeni aidat ödemesi yapıldı</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A Blok, Daire 5 - 1.500₺</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">10 Haziran 2023, 14:23</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700/30 rounded-r-lg">
                  <div className="ml-2">
                    <p className="text-sm font-medium">Yeni duyuru eklendi</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Su Kesintisi Duyurusu</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">9 Haziran 2023, 09:15</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-l-4 border-orange-500 bg-gray-50 dark:bg-gray-700/30 rounded-r-lg">
                  <div className="ml-2">
                    <p className="text-sm font-medium">Yeni talep oluşturuldu</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">B Blok, Daire 12 - Asansör Arızası</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">8 Haziran 2023, 17:42</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 