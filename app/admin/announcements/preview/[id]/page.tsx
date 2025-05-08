"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuArrowLeft, LuCalendar, LuInfo, LuClock, LuPencil } from "react-icons/lu";
import { useRouter } from "next/navigation";

// Mock announcements for development
const mockAnnouncements = [
  {
    id: "1",
    title: "Su Kesintisi Hakkında",
    content: "Yarın 10:00-14:00 saatleri arasında bakım çalışması nedeniyle su kesintisi yaşanacaktır.",
    date: "2023-06-15",
    time: "14:30",
    isImportant: true,
    isActive: true,
  },
  {
    id: "2",
    title: "Aylık Aidat Ödemeleri",
    content: "Haziran ayı aidat ödemelerini lütfen ay sonuna kadar tamamlayınız.",
    date: "2023-06-10",
    time: "09:15",
    isImportant: true,
    isActive: true,
  },
  {
    id: "3",
    title: "Apartman Toplantısı",
    content: "20 Haziran Pazar saat 19:00'da apartman toplantısı düzenlenecektir. Tüm kat maliklerinin katılımı beklenmektedir.",
    date: "2023-06-05",
    time: "10:00",
    isImportant: false,
    isActive: true,
  },
  {
    id: "4",
    title: "Çatı Tamiratı",
    content: "Önümüzdeki hafta çatı tamiratı yapılacaktır. Detaylar için yöneticiyle iletişime geçiniz.",
    date: "2023-05-28",
    time: "16:45",
    isImportant: false,
    isActive: false,
  },
];

export default function AnnouncementPreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [announcement, setAnnouncement] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // In real app, this would be a fetch from API
    const foundAnnouncement = mockAnnouncements.find(a => a.id === id);
    if (foundAnnouncement) {
      setAnnouncement(foundAnnouncement);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Duyuru Bulunamadı</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">İstediğiniz duyuru bulunamadı veya silinmiş olabilir.</p>
          <Link 
            href="/admin/announcements" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <LuArrowLeft className="mr-1" /> Duyuru Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Duyuru yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            href="/admin/announcements" 
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
          >
            <LuArrowLeft className="mr-1" /> Geri
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Duyuru Önizleme</h1>
        </div>
        <button
          onClick={() => router.push(`/admin/announcements/edit/${announcement.id}`)}
          className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          <LuPencil className="mr-2" /> Düzenle
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Duyuru başlığı ve durumu */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{announcement.title}</h2>
            <div className="flex space-x-2">
              {announcement.isImportant && (
                <span className="inline-flex items-center bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  <LuInfo className="w-3 h-3 mr-1" /> Önemli
                </span>
              )}
              <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                announcement.isActive 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}>
                {announcement.isActive ? "Aktif" : "Pasif"}
              </span>
            </div>
          </div>

          {/* Duyuru detayları */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center">
                <LuCalendar className="w-4 h-4 mr-1" />
                {new Date(announcement.date).toLocaleDateString('tr-TR')}
              </span>
              {announcement.time && (
                <span className="flex items-center">
                  <LuClock className="w-4 h-4 mr-1" />
                  {announcement.time}
                </span>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {announcement.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 