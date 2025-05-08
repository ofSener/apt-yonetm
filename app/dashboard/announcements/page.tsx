"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LuSearch, 
  LuInfo, 
  LuCalendar, 
  LuClock, 
  LuChevronDown, 
  LuChevronUp 
} from "react-icons/lu";

// Örnek duyuru verileri
const mockAnnouncements = [
  {
    id: "1",
    title: "Su Kesintisi Hakkında",
    content: "Yarın 10:00-14:00 saatleri arasında bakım çalışması nedeniyle su kesintisi yaşanacaktır. Lütfen su ihtiyacınızı önceden karşılayınız ve gerekli tedbirleri alınız. Çalışma planlanandan erken biterse ayrıca bilgilendirme yapılacaktır. Anlayışınız için teşekkür ederiz.",
    date: "2023-06-15",
    time: "14:30",
    isImportant: true,
    isActive: true,
  },
  {
    id: "2",
    title: "Aylık Aidat Ödemeleri",
    content: "Haziran ayı aidat ödemelerini lütfen ay sonuna kadar tamamlayınız. Ödemelerinizi banka havalesi yöntemiyle referans numaranızı belirterek yapabilirsiniz. Geç ödemeler için yasal faiz işletilecektir.",
    date: "2023-06-10",
    time: "09:15",
    isImportant: true,
    isActive: true,
  },
  {
    id: "3",
    title: "Apartman Toplantısı",
    content: "20 Haziran Pazar saat 19:00'da apartman toplantısı düzenlenecektir. Tüm kat maliklerinin katılımı beklenmektedir. Toplantı gündemine eklemek istediğiniz konuları 18 Haziran'a kadar yönetime bildirebilirsiniz.",
    date: "2023-06-05",
    time: "10:00",
    isImportant: false,
    isActive: true,
  },
  {
    id: "4",
    title: "Çatı Tamiratı",
    content: "Önümüzdeki hafta çatı tamiratı yapılacaktır. Çalışmalar hafta içi mesai saatlerinde gerçekleştirilecek ve yaklaşık 3 gün sürecektir. Bu süre zarfında gürültü olabileceğinden anlayışınız için şimdiden teşekkür ederiz.",
    date: "2023-05-28",
    time: "16:45",
    isImportant: false,
    isActive: true,
  },
  {
    id: "5",
    title: "Apartman Güvenlik Önlemleri",
    content: "Son günlerde çevre binalarda yaşanan hırsızlık olayları nedeniyle, apartmanımızın giriş kapısını her zaman kapalı tutmanız ve tanımadığınız kişileri içeri almamanız rica olunur. Şüpheli bir durum gördüğünüzde lütfen apartman yönetimini veya doğrudan polisi arayınız.",
    date: "2023-05-25",
    time: "11:30",
    isImportant: true,
    isActive: true,
  },
];

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null);

  // Aktif ve önemli duyuruları önce göster, sonra tarih sırasına göre sırala
  const sortedAnnouncements = [...mockAnnouncements]
    .filter(a => a.isActive)
    .sort((a, b) => {
      // Önemli duyuruları en üste
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      
      // Sonra tarih sırasına göre yeniden eskiye
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Arama fonksiyonu
  const filteredAnnouncements = sortedAnnouncements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    if (expandedAnnouncementId === id) {
      setExpandedAnnouncementId(null);
    } else {
      setExpandedAnnouncementId(id);
    }
  };

  // Duyurunun okunma durumu - gerçek uygulamada veritabanında saklanır
  const isRead = (id: string) => {
    // Örnek implementasyon - gerçekte localStorage veya API kullanılır
    return false;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Duyurular</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Apartman yönetiminden gelen tüm duyurulara buradan ulaşabilirsiniz.
        </p>
      </div>

      {/* Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="Duyurularda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Duyuru Listesi */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${
                announcement.isImportant 
                  ? "border-red-500" 
                  : "border-blue-500"
              }`}
            >
              <button
                onClick={() => toggleExpand(announcement.id)}
                className="w-full text-left px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-start">
                  {announcement.isImportant && (
                    <div className="mr-3 mt-1">
                      <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${isRead(announcement.id) ? 'hidden' : ''}`}></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span className="flex items-center">
                        <LuCalendar className="w-4 h-4 mr-1" />
                        {new Date(announcement.date).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center">
                        <LuClock className="w-4 h-4 mr-1" />
                        {announcement.time}
                      </span>
                      {announcement.isImportant && (
                        <span className="inline-flex items-center bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                          <LuInfo className="w-3 h-3 mr-1" /> Önemli
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {expandedAnnouncementId === announcement.id ? (
                    <LuChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <LuChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedAnnouncementId === announcement.id && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {announcement.content}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Duyuru bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
} 