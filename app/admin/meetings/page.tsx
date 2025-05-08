"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LuPlus, 
  LuPencil, 
  LuTrash, 
  LuSearch,
  LuFilter,
  LuCalendar,
  LuClock,
  LuUsers,
  LuCheck,
  LuX,
  LuChevronDown
} from "react-icons/lu";

// Örnek toplantı verileri
const mockMeetings = [
  {
    id: "1",
    title: "Yıllık Genel Kurul Toplantısı",
    description: "2023 yılı faaliyetlerinin değerlendirilmesi ve yeni dönem planlaması.",
    date: "2023-12-15",
    time: "19:00",
    location: "Apartman Toplantı Salonu",
    status: "upcoming", // upcoming, completed, cancelled
    attendees: 18,
    totalResidents: 24,
    agenda: [
      "Açılış ve yoklama",
      "2023 faaliyet raporunun sunulması",
      "Mali raporların sunulması",
      "Yeni dönem bütçesinin görüşülmesi",
      "Dilek ve öneriler"
    ],
    minutes: null
  },
  {
    id: "2",
    title: "Olağanüstü Yönetim Toplantısı",
    description: "Acil çatı onarımı için müteahhit seçimi.",
    date: "2023-11-05",
    time: "20:00",
    location: "Çevrimiçi (Zoom)",
    status: "completed",
    attendees: 22,
    totalResidents: 24,
    agenda: [
      "Açılış ve yoklama",
      "Çatı hasarının durumu",
      "Teklif veren firmaların değerlendirilmesi",
      "Karar alınması",
      "Kapanış"
    ],
    minutes: "Toplantıda ABC İnşaat firmasının teklifi kabul edilmiştir. Çatı onarımı 15 Kasım'da başlayacaktır."
  },
  {
    id: "3",
    title: "Aylık Yönetim Toplantısı",
    description: "Ekim ayı rutin yönetim toplantısı.",
    date: "2023-10-10",
    time: "19:30",
    location: "Apartman Toplantı Salonu",
    status: "completed",
    attendees: 20,
    totalResidents: 24,
    agenda: [
      "Açılış ve yoklama",
      "Geçen ay alınan kararların takibi",
      "Aidatların durumu",
      "Yeni talepler",
      "Dilek ve öneriler"
    ],
    minutes: "Ekim ayı aidat ödemelerinin %92'si tamamlanmıştır. Asansör bakımının Kasım ayına ertelenmesine karar verilmiştir."
  },
  {
    id: "4",
    title: "Güvenlik Sistemi Bilgilendirme Toplantısı",
    description: "Yeni güvenlik sistemi hakkında bilgilendirme.",
    date: "2023-09-20",
    time: "18:00",
    location: "Apartman Toplantı Salonu",
    status: "completed",
    attendees: 19,
    totalResidents: 24,
    agenda: [
      "Açılış ve yoklama",
      "Yeni güvenlik sistemi tanıtımı",
      "Kullanım talimatları",
      "Soru ve cevaplar"
    ],
    minutes: "Yeni güvenlik sistemi tanıtıldı ve kullanım talimatları verildi. Tüm dairelere yeni kartlar dağıtıldı."
  },
  {
    id: "5",
    title: "Bütçe Planlama Toplantısı",
    description: "2024 yılı bütçe planlaması.",
    date: "2023-12-20",
    time: "19:00",
    location: "Apartman Toplantı Salonu",
    status: "upcoming",
    attendees: 0,
    totalResidents: 24,
    agenda: [
      "Açılış ve yoklama",
      "2023 mali durumunun değerlendirilmesi",
      "2024 bütçe taslağının sunulması",
      "Aidat artışının görüşülmesi",
      "Dilek ve öneriler"
    ],
    minutes: null
  }
];

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, upcoming, completed, cancelled
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  
  // Silme işlemi için onay modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  // Filtreleme
  const filteredMeetings = mockMeetings
    .filter(meeting => {
      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          meeting.title.toLowerCase().includes(searchLower) ||
          meeting.description.toLowerCase().includes(searchLower) ||
          meeting.location.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(meeting => {
      // Durum filtresi
      if (statusFilter === "all") return true;
      return meeting.status === statusFilter;
    })
    .sort((a, b) => {
      // Tarih sıralaması
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const confirmDelete = (id: string) => {
    setMeetingToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteMeeting = () => {
    if (meetingToDelete) {
      // Silme işlemi burada gerçekleştirilir
      console.log(`Toplantı silindi: ${meetingToDelete}`);
      setShowDeleteModal(false);
      setMeetingToDelete(null);
    }
  };

  // Toplantı durumu bilgisi
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30', label: 'Yaklaşan' };
      case 'completed':
        return { color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30', label: 'Tamamlandı' };
      case 'cancelled':
        return { color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30', label: 'İptal Edildi' };
      default:
        return { color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', label: 'Bilinmiyor' };
    }
  };

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Toplantı Yönetimi</h1>
        <Link
          href="/admin/meetings/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <LuPlus className="mr-2" /> Yeni Toplantı
        </Link>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Başlık, açıklama veya konum ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Toplantılar</option>
              <option value="upcoming">Yaklaşan Toplantılar</option>
              <option value="completed">Tamamlanan Toplantılar</option>
              <option value="cancelled">İptal Edilen Toplantılar</option>
            </select>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">En Yeni Tarih</option>
              <option value="asc">En Eski Tarih</option>
            </select>
          </div>
          
          <div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSortOrder("desc");
              }}
            >
              <LuFilter className="mr-2" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Toplantı Listesi */}
      <div className="space-y-6">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => {
            const statusInfo = getStatusInfo(meeting.status);
            
            return (
              <div key={meeting.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {meeting.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {meeting.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/meetings/${meeting.id}`}
                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Görüntüle
                      </Link>
                      {meeting.status === 'upcoming' && (
                        <>
                          <Link
                            href={`/admin/meetings/${meeting.id}/edit`}
                            className="flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <LuPencil className="w-4 h-4 mr-1" /> Düzenle
                          </Link>
                          <button
                            onClick={() => confirmDelete(meeting.id)}
                            className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <LuTrash className="w-4 h-4 mr-1" /> Sil
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <LuCalendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <LuClock className="w-4 h-4 mr-2" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <LuUsers className="w-4 h-4 mr-2" />
                      <span>{meeting.status === 'upcoming' ? `${meeting.totalResidents} davetli` : `${meeting.attendees}/${meeting.totalResidents} katılımcı`}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gündem Maddeleri:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {meeting.agenda.slice(0, 3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                      {meeting.agenda.length > 3 && (
                        <li className="list-none text-blue-600 dark:text-blue-400 cursor-pointer">
                          +{meeting.agenda.length - 3} daha...
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {meeting.minutes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toplantı Notları:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {meeting.minutes.length > 150 
                          ? `${meeting.minutes.substring(0, 150)}...` 
                          : meeting.minutes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Belirtilen kriterlere uygun toplantı bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Toplantıyı Sil</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bu toplantıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={deleteMeeting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 