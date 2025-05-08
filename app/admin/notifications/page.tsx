"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LuPlus, 
  LuBell, 
  LuMail, 
  LuUsers,
  LuCalendar,
  LuCreditCard,
  LuFilter,
  LuSearch,
  LuCheck,
  LuMessageCircle,
  LuSend
} from "react-icons/lu";

// Bildirim şablonları
const notificationTemplates = [
  {
    id: "1",
    name: "Aidat Hatırlatıcısı",
    description: "Zamanı gelen aidat ödemeleri için hatırlatma bildirimi",
    subject: "Aidat Ödemesi Hatırlatma",
    body: "Sayın {{name}}, {{month}} ayı aidat ödemesi için son ödeme tarihi {{dueDate}} tarihidir. Ödemenizi zamanında yapmanızı rica ederiz.",
    type: "email", // email, push, sms
    triggers: ["manual", "schedule"], // manual, schedule, event
    category: "payment"
  },
  {
    id: "2",
    name: "Gecikmiş Aidat Bildirimi",
    description: "Vadesi geçmiş aidat ödemeleri için ikinci hatırlatma",
    subject: "Gecikmiş Aidat Ödemesi",
    body: "Sayın {{name}}, {{month}} ayı aidat ödemesi için son ödeme tarihi geçmiştir. En kısa sürede ödeme yapmanızı rica ederiz.",
    type: "email",
    triggers: ["manual", "event"],
    category: "payment"
  },
  {
    id: "3",
    name: "Toplantı Bildirimi",
    description: "Yaklaşan toplantılar için bildirim",
    subject: "Apartman Toplantı Duyurusu",
    body: "Sayın {{name}}, {{date}} tarihinde saat {{time}} saatinde {{location}} konumunda apartman toplantısı yapılacaktır. Katılımınızı rica ederiz.",
    type: "email",
    triggers: ["manual", "schedule"],
    category: "meeting"
  },
  {
    id: "4",
    name: "Arıza Bildirimi Onayı",
    description: "Arıza bildirimi alındığında otomatik onay mesajı",
    subject: "Arıza Bildiriminiz Alındı",
    body: "Sayın {{name}}, {{date}} tarihinde oluşturduğunuz arıza bildiriminiz alınmıştır. En kısa sürede ilgilenilecektir.",
    type: "email",
    triggers: ["event"],
    category: "maintenance"
  },
  {
    id: "5",
    name: "Yeni Duyuru Bildirimi",
    description: "Yeni apartman duyuruları için otomatik bildirim",
    subject: "Yeni Apartman Duyurusu",
    body: "Sayın {{name}}, apartman yönetimi tarafından yeni bir duyuru paylaşıldı: {{title}}. Detaylar için uygulamayı ziyaret ediniz.",
    type: "push",
    triggers: ["event"],
    category: "announcement"
  }
];

// Son gönderilen bildirimler
const sentNotifications = [
  {
    id: "1",
    templateId: "1",
    date: "2023-11-15T10:30:00",
    recipients: 24,
    delivered: 22,
    opened: 18,
    subject: "Kasım 2023 Aidat Ödemesi Hatırlatma"
  },
  {
    id: "2",
    templateId: "3",
    date: "2023-11-10T09:15:00",
    recipients: 24,
    delivered: 23,
    opened: 20,
    subject: "Apartman Toplantı Duyurusu"
  },
  {
    id: "3",
    templateId: "2",
    date: "2023-10-20T14:45:00",
    recipients: 5,
    delivered: 5,
    opened: 4,
    subject: "Gecikmiş Aidat Ödemesi"
  },
  {
    id: "4",
    templateId: "5",
    date: "2023-10-05T16:20:00",
    recipients: 24,
    delivered: 20,
    opened: 17,
    subject: "Yeni Apartman Duyurusu"
  }
];

// Zamanlanmış bildirimler
const scheduledNotifications = [
  {
    id: "1",
    templateId: "1",
    scheduledDate: "2023-12-01T10:00:00",
    recipients: "all",
    subject: "Aralık 2023 Aidat Ödemesi Hatırlatma"
  },
  {
    id: "2",
    templateId: "3",
    scheduledDate: "2023-11-30T09:00:00",
    recipients: "all",
    subject: "Aralık Ayı Yönetim Toplantısı"
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "sent" | "scheduled">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Şablon filtreleme
  const filteredTemplates = notificationTemplates
    .filter(template => {
      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.subject.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(template => {
      // Kategori filtresi
      if (categoryFilter === "all") return true;
      return template.category === categoryFilter;
    })
    .filter(template => {
      // Tip filtresi
      if (typeFilter === "all") return true;
      return template.type === typeFilter;
    });

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // Kategori bilgisi
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'payment':
        return { label: 'Ödeme', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30', icon: <LuCreditCard className="w-4 h-4 mr-1" /> };
      case 'meeting':
        return { label: 'Toplantı', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30', icon: <LuCalendar className="w-4 h-4 mr-1" /> };
      case 'maintenance':
        return { label: 'Bakım/Arıza', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30', icon: <LuMessageCircle className="w-4 h-4 mr-1" /> };
      case 'announcement':
        return { label: 'Duyuru', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30', icon: <LuBell className="w-4 h-4 mr-1" /> };
      default:
        return { label: 'Diğer', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30', icon: <LuBell className="w-4 h-4 mr-1" /> };
    }
  };

  // Bildirim tipi bilgisi
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'email':
        return { label: 'E-posta', icon: <LuMail className="w-4 h-4 mr-1" /> };
      case 'push':
        return { label: 'Uygulama Bildirimi', icon: <LuBell className="w-4 h-4 mr-1" /> };
      case 'sms':
        return { label: 'SMS', icon: <LuMessageCircle className="w-4 h-4 mr-1" /> };
      default:
        return { label: 'Diğer', icon: <LuBell className="w-4 h-4 mr-1" /> };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bildirim Yönetimi</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/notifications/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <LuPlus className="mr-2" /> Yeni Şablon
          </Link>
          <Link
            href="/admin/notifications/send"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <LuSend className="mr-2" /> Bildirim Gönder
          </Link>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "templates"
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Şablonlar
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sent"
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Gönderilen Bildirimler
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "scheduled"
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Zamanlanmış Bildirimler
          </button>
        </nav>
      </div>

      {/* Filtreler (Şablonlar sekmesi için) */}
      {activeTab === "templates" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Şablon adı veya açıklaması ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="payment">Ödeme</option>
                <option value="meeting">Toplantı</option>
                <option value="maintenance">Bakım/Arıza</option>
                <option value="announcement">Duyuru</option>
              </select>
            </div>
            
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tüm Bildirim Tipleri</option>
                <option value="email">E-posta</option>
                <option value="push">Uygulama Bildirimi</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            
            <div>
              <button
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setTypeFilter("all");
                }}
              >
                <LuFilter className="mr-2" /> Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Şablonlar */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category);
              const typeInfo = getTypeInfo(template.type);
              
              return (
                <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            {categoryInfo.icon}
                            {categoryInfo.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {typeInfo.icon}
                            {typeInfo.label}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/notifications/templates/${template.id}`}
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Düzenle
                        </Link>
                        <Link
                          href={`/admin/notifications/send?template=${template.id}`}
                          className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <LuSend className="w-4 h-4 mr-1" /> Gönder
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konu:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.subject}
                      </p>
                      
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İçerik:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {template.body}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Tetikleyiciler:</h4>
                      {template.triggers.map((trigger, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {trigger === 'manual' ? 'Manuel' : trigger === 'schedule' ? 'Zamanlanmış' : 'Olay Tabanlı'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Belirtilen kriterlere uygun şablon bulunamadı.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Gönderilen Bildirimler */}
      {activeTab === "sent" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bildirim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gönderim Tarihi
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kişi Sayısı
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İletildi
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Açıldı
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sentNotifications.map((notification) => {
                  const template = notificationTemplates.find(t => t.id === notification.templateId);
                  const categoryInfo = template ? getCategoryInfo(template.category) : { label: 'Diğer', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700' };
                  
                  return (
                    <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.subject}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(notification.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                        {notification.recipients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="text-green-600 dark:text-green-400">
                          {notification.delivered} ({Math.round((notification.delivered / notification.recipients) * 100)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="text-blue-600 dark:text-blue-400">
                          {notification.opened} ({Math.round((notification.opened / notification.recipients) * 100)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/notifications/sent/${notification.id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Detaylar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Zamanlanmış Bildirimler */}
      {activeTab === "scheduled" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bildirim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Planlanan Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Alıcılar
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {scheduledNotifications.map((notification) => {
                  const template = notificationTemplates.find(t => t.id === notification.templateId);
                  const categoryInfo = template ? getCategoryInfo(template.category) : { label: 'Diğer', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700' };
                  
                  return (
                    <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.subject}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(notification.scheduledDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                        {notification.recipients === "all" ? "Tüm Sakinler" : notification.recipients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/notifications/scheduled/${notification.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Düzenle
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          İptal Et
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 