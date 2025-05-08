"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  LuBell, 
  LuCreditCard, 
  LuClipboardList, 
  LuUsers,
  LuFileText,
  LuChevronRight,
  LuMessageSquare,
  LuTriangle,
  LuCheck,
  LuCalendar
} from "react-icons/lu";

// Örnek veri
const mockAnnouncements = [
  {
    id: "1",
    title: "Su Kesintisi Hakkında",
    content: "Yarın 10:00-14:00 saatleri arasında bakım çalışması nedeniyle su kesintisi yaşanacaktır.",
    date: "2023-06-15",
    isImportant: true,
    isActive: true,
  },
  {
    id: "2",
    title: "Aylık Aidat Ödemeleri",
    content: "Haziran ayı aidat ödemelerini lütfen ay sonuna kadar tamamlayınız.",
    date: "2023-06-10",
    isImportant: true,
    isActive: true,
  }
];

const mockPayments = [
  {
    id: "1",
    description: "Haziran 2023 Aidatı",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: false
  },
  {
    id: "2",
    description: "Mayıs 2023 Aidatı",
    amount: 550,
    dueDate: "2023-05-15",
    isPaid: true,
    paymentDate: "2023-05-10"
  }
];

const mockRequests = [
  {
    id: "1",
    title: "Su Tesisatı Arızası",
    status: "completed", // pending, inProgress, completed, rejected
    createdAt: "2023-06-10T14:30:00",
    updatedAt: "2023-06-12T09:15:00"
  },
  {
    id: "2",
    title: "Elektrik Arızası",
    status: "inProgress",
    createdAt: "2023-06-15T08:45:00",
    updatedAt: "2023-06-15T11:20:00"
  }
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name || "Daire Sakini";
  const userUnit = (session?.user as any)?.unitNumber || "5";

  // Bugünün tarihini al
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today);

  // Ödenmemiş aidat sayısı
  const unpaidDues = mockPayments.filter(payment => !payment.isPaid).length;
  
  // Bekleyen talep sayısı
  const pendingRequests = mockRequests.filter(request => 
    request.status === "pending" || request.status === "inProgress"
  ).length;

  // Son duyurular
  const latestAnnouncements = mockAnnouncements
    .filter(announcement => announcement.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Merhaba, {userName}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {formattedDate} - Daire {userUnit}
        </p>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ödenmemiş Aidat</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {unpaidDues > 0 ? unpaidDues : "Yok"}
              </p>
            </div>
            <div className={`p-3 rounded-full ${unpaidDues > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
              <LuCreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/payments" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              Aidat ödemelerine git <LuChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bakım Talepleri</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {pendingRequests > 0 ? pendingRequests : "Yok"}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <LuClipboardList className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/maintenance" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              Bakım taleplerine git <LuChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Duyurular</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {latestAnnouncements.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <LuBell className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/announcements" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              Tüm duyuruları görüntüle <LuChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Apartman Sakinleri</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <LuUsers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/residents" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              Sakinleri görüntüle <LuChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* İkinci Satır */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Son Duyurular */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md md:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son Duyurular</h2>
          </div>
          <div className="p-6">
            {latestAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {latestAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start">
                      {announcement.isImportant ? (
                        <LuTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      ) : (
                        <LuBell className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <Link 
                          href={`/dashboard/announcements/${announcement.id}`}
                          className="text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {announcement.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {announcement.content.length > 100 
                            ? `${announcement.content.substring(0, 100)}...` 
                            : announcement.content}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(announcement.date).toLocaleDateString('tr-TR')}
                          </span>
                          <Link 
                            href={`/dashboard/announcements/${announcement.id}`}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Detayları gör
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Aktif duyuru bulunmamaktadır.</p>
            )}
            <div className="mt-4 text-right">
              <Link 
                href="/dashboard/announcements"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tüm duyuruları görüntüle <LuChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hızlı Erişim</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link 
                href="/dashboard/payments/new" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <LuCreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">Aidat Öde</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Kredi kartı veya havale</span>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/maintenance/create" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <LuClipboardList className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">Arıza Bildir</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Bakım veya tamir talebi</span>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/documents" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <LuFileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">Belgeler</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Yönetim planı ve kararlar</span>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/message" 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <LuMessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">Yöneticiye Mesaj</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Soru veya önerileriniz</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Üçüncü Satır */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ödeme Durumu */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ödeme Durumu</h2>
          </div>
          <div className="p-6">
            {mockPayments.length > 0 ? (
              <div className="space-y-4">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className={`mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                        payment.isPaid 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {payment.isPaid ? (
                          <LuCheck className="w-5 h-5" />
                        ) : (
                          <LuCreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.isPaid 
                            ? `Ödendi: ${new Date(payment.paymentDate!).toLocaleDateString('tr-TR')}` 
                            : `Son Ödeme: ${new Date(payment.dueDate).toLocaleDateString('tr-TR')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        payment.isPaid 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {payment.amount.toLocaleString('tr-TR')} ₺
                      </span>
                      {!payment.isPaid && (
                        <Link
                          href={`/dashboard/payments/${payment.id}`}
                          className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Öde
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Ödeme bilgisi bulunmamaktadır.</p>
            )}
            <div className="mt-4 text-right">
              <Link 
                href="/dashboard/payments"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tüm ödemeleri görüntüle <LuChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bakım Talepleri */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bakım Taleplerim</h2>
          </div>
          <div className="p-6">
            {mockRequests.length > 0 ? (
              <div className="space-y-4">
                {mockRequests.map((request) => {
                  // Durum bilgisi
                  let statusInfo = {
                    color: "text-gray-600 dark:text-gray-400",
                    bgColor: "bg-gray-100 dark:bg-gray-700",
                    icon: <LuClipboardList className="w-4 h-4 mr-1" />,
                    text: "Bekliyor"
                  };
                  
                  if (request.status === "completed") {
                    statusInfo = {
                      color: "text-green-600 dark:text-green-400",
                      bgColor: "bg-green-100 dark:bg-green-900/30",
                      icon: <LuCheck className="w-4 h-4 mr-1" />,
                      text: "Tamamlandı"
                    };
                  } else if (request.status === "inProgress") {
                    statusInfo = {
                      color: "text-blue-600 dark:text-blue-400",
                      bgColor: "bg-blue-100 dark:bg-blue-900/30",
                      icon: <LuClipboardList className="w-4 h-4 mr-1" />,
                      text: "İşleme Alındı"
                    };
                  }
                  
                  return (
                    <div key={request.id} className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{request.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Oluşturulma: {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        <Link
                          href={`/dashboard/maintenance/${request.id}`}
                          className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <LuChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Bakım talebi bulunmamaktadır.</p>
            )}
            <div className="mt-4 text-right">
              <Link 
                href="/dashboard/maintenance"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tüm talepleri görüntüle <LuChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 