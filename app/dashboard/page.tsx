"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  LuInfo, LuDollarSign, LuUsers, LuCalendarClock, 
  LuArrowDown, LuArrowUp, LuBuilding
} from "react-icons/lu";
import { MdOutlineAnnouncement } from "react-icons/md";
import Link from "next/link";

interface DashboardMetric {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [upcomingDues, setUpcomingDues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    setTimeout(() => {
      setMetrics([
        {
          title: "Apartman Kasası",
          value: "15.420 ₺",
          description: "Toplam bakiye",
          icon: LuDollarSign,
          change: {
            value: 12,
            type: "increase",
          },
        },
        {
          title: "Toplam Sakin",
          value: 28,
          description: "Tüm dairelerde",
          icon: LuUsers,
        },
        {
          title: "Aktif Anketler",
          value: 2,
          description: "Katılım bekliyor",
          icon: LuCalendarClock,
        },
        {
          title: "Daire Borcu",
          value: session?.user?.role === "RESIDENT" ? "320 ₺" : "3.240 ₺",
          description: session?.user?.role === "RESIDENT" ? "Ödeme bekleniyor" : "Toplam tahsilat bekleyen",
          icon: LuInfo,
          change: {
            value: 5,
            type: "decrease",
          },
        },
      ]);

      setRecentAnnouncements([
        {
          id: "1",
          title: "Asansör Bakımı Hakkında",
          content: "Önümüzdeki pazartesi (10 Mayıs) asansör bakımı yapılacaktır. Saat 10:00-14:00 arası asansör kullanılamayacaktır.",
          createdAt: "2023-05-05T14:30:00Z",
          createdBy: {
            name: "Ahmet Yılmaz",
            role: "MANAGER",
          },
        },
        {
          id: "2",
          title: "Su Kesintisi Bildirimi",
          content: "Yarın (6 Mayıs) saat 09:00-13:00 arası apartmanımızda su kesintisi olacaktır. Lütfen hazırlıklı olun.",
          createdAt: "2023-05-05T10:15:00Z",
          createdBy: {
            name: "Ahmet Yılmaz",
            role: "MANAGER",
          },
        },
      ]);

      setUpcomingDues([
        {
          id: "1",
          amount: 320,
          description: "Mayıs 2023 Aidatı",
          dueDate: "2023-05-15T00:00:00Z",
          isPaid: false,
        },
        {
          id: "2",
          amount: 150,
          description: "Otopark Ücreti",
          dueDate: "2023-05-20T00:00:00Z",
          isPaid: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [session?.user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gösterge Paneli</h1>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <LuBuilding className="h-5 w-5" />
          <span>Akasya Apartmanı</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-blue-50 dark:bg-blue-900/30 p-3">
                  <metric.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {metric.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {metric.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {metric.description}
                </span>
                {metric.change && (
                  <span
                    className={`ml-2 ${
                      metric.change.type === "increase"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.change.type === "increase" ? <LuArrowUp className="inline h-4 w-4" /> : <LuArrowDown className="inline h-4 w-4" />}
                    {metric.change.value}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Announcements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Son Duyurular</h2>
              <Link
                href="/dashboard/announcements"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Tümünü Gör
              </Link>
            </div>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="shrink-0 mt-1">
                      <MdOutlineAnnouncement className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{announcement.content}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{announcement.createdBy.name}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Dues */}
        {session?.user?.role === "RESIDENT" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Yaklaşan Ödemeler</h2>
                <Link
                  href="/dashboard/payments"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingDues.map((due) => (
                  <div
                    key={due.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{due.description}</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Son Ödeme: {new Date(due.dueDate).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{due.amount} ₺</span>
                        <Link
                          href={`/dashboard/payments/${due.id}`}
                          className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Öde
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Expenses for Managers and Admins */}
        {(session?.user?.role === "MANAGER" || session?.user?.role === "ADMIN") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Son Harcamalar</h2>
                <Link
                  href="/dashboard/expenses"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "1",
                    amount: 750,
                    description: "Apartman Temizliği",
                    expenseDate: "2023-05-01T00:00:00Z",
                    createdBy: {
                      name: "Ahmet Yılmaz",
                    },
                  },
                  {
                    id: "2",
                    amount: 320,
                    description: "Bahçe Bakımı",
                    expenseDate: "2023-04-28T00:00:00Z",
                    createdBy: {
                      name: "Ahmet Yılmaz",
                    },
                  },
                ].map((expense) => (
                  <div
                    key={expense.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{expense.description}</h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{expense.createdBy.name}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(expense.expenseDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-red-600 dark:text-red-400">-{expense.amount} ₺</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 