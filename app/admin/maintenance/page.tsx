"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LuPencil, 
  LuClock, 
  LuCheck, 
  LuX, 
  LuCalendar,
  LuMessageSquare,
  LuTriangle,
  LuClipboardList,
  LuFilter,
  LuChevronLeft,
  LuChevronRight,
  LuSearch
} from "react-icons/lu";

// Örnek bakım talepleri
const mockRequests = [
  {
    id: "1",
    unitNumber: "5",
    residentName: "Ahmet Yılmaz",
    title: "Su Tesisatı Arızası",
    description: "Mutfak lavabosundan su sızıntısı var. Acil müdahale gerekli.",
    status: "completed", // pending, inProgress, completed, rejected
    priority: "high", // low, medium, high
    createdAt: "2023-06-10T14:30:00",
    updatedAt: "2023-06-12T09:15:00",
    completedAt: "2023-06-12T09:15:00",
    comments: [
      {
        id: "c1",
        author: "Yönetici",
        content: "Tesisatçı bugün saat 14:00'da gelecek.",
        createdAt: "2023-06-11T10:00:00",
      },
      {
        id: "c2",
        author: "Ahmet Yılmaz",
        content: "Teşekkürler, evde olacağım.",
        createdAt: "2023-06-11T10:15:00",
      },
      {
        id: "c3",
        author: "Yönetici",
        content: "Arıza giderildi. İyi günler.",
        createdAt: "2023-06-12T09:15:00",
      }
    ]
  },
  {
    id: "2",
    unitNumber: "12",
    residentName: "Ayşe Demir",
    title: "Elektrik Arızası",
    description: "Salondaki prizler çalışmıyor, diğer odalarda sorun yok.",
    status: "inProgress",
    priority: "medium",
    createdAt: "2023-06-15T08:45:00",
    updatedAt: "2023-06-15T11:20:00",
    completedAt: null,
    comments: [
      {
        id: "c4",
        author: "Yönetici",
        content: "Elektrikçi yarın saat 11:00'da gelecek.",
        createdAt: "2023-06-15T11:20:00",
      }
    ]
  },
  {
    id: "3",
    unitNumber: "8",
    residentName: "Mehmet Kaya",
    title: "Kapı Kilidi Arızalı",
    description: "Daire kapısı zor kilitleniyor, kilit mekanizması eskimiş olabilir.",
    status: "pending",
    priority: "low",
    createdAt: "2023-06-17T17:30:00",
    updatedAt: "2023-06-17T17:30:00",
    completedAt: null,
    comments: []
  },
  {
    id: "4",
    unitNumber: "3",
    residentName: "Zeynep Şahin",
    title: "Asansör Arızası",
    description: "Asansör 2. katta takılı kalıyor, lütfen kontrol edilsin.",
    status: "pending",
    priority: "high",
    createdAt: "2023-06-18T09:10:00",
    updatedAt: "2023-06-18T09:10:00",
    completedAt: null,
    comments: []
  }
];

export default function AdminMaintenancePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, inProgress, completed, rejected
  const [priorityFilter, setPriorityFilter] = useState("all"); // all, low, medium, high

  // Filtreleme
  const filteredRequests = mockRequests
    .filter(request => {
      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          request.unitNumber.toLowerCase().includes(searchLower) ||
          request.residentName.toLowerCase().includes(searchLower) ||
          request.title.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(request => {
      // Durum filtresi
      if (statusFilter === "all") return true;
      return request.status === statusFilter;
    })
    .filter(request => {
      // Öncelik filtresi
      if (priorityFilter === "all") return true;
      return request.priority === priorityFilter;
    })
    .sort((a, b) => {
      // Önceliğe ve tarihe göre sıralama
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (a.priority !== "high" && b.priority === "high") return 1;
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Durum renklerini ve metinlerini belirleme
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Bekliyor",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-800 dark:text-yellow-400",
          icon: <LuClock className="w-4 h-4 mr-1" />
        };
      case "inProgress":
        return {
          label: "İşleme Alındı",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-800 dark:text-blue-400",
          icon: <LuClipboardList className="w-4 h-4 mr-1" />
        };
      case "completed":
        return {
          label: "Tamamlandı",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-800 dark:text-green-400",
          icon: <LuCheck className="w-4 h-4 mr-1" />
        };
      case "rejected":
        return {
          label: "Reddedildi",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-400",
          icon: <LuX className="w-4 h-4 mr-1" />
        };
      default:
        return {
          label: "Bilinmiyor",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          textColor: "text-gray-800 dark:text-gray-400",
          icon: <LuTriangle className="w-4 h-4 mr-1" />
        };
    }
  };

  // Öncelik renklerini ve metinlerini belirleme
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "low":
        return {
          label: "Düşük",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-800 dark:text-blue-400"
        };
      case "medium":
        return {
          label: "Orta",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-800 dark:text-yellow-400"
        };
      case "high":
        return {
          label: "Yüksek",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-400"
        };
      default:
        return {
          label: "Bilinmiyor",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          textColor: "text-gray-800 dark:text-gray-400"
        };
    }
  };

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bakım ve Arıza Talepleri</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Apartman sakinlerinden gelen tüm bakım ve arıza taleplerini buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Daire no, isim veya başlık ara..."
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
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekleyenler</option>
              <option value="inProgress">İşleme Alınanlar</option>
              <option value="completed">Tamamlananlar</option>
              <option value="rejected">Reddedilenler</option>
            </select>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="high">Yüksek Öncelikli</option>
              <option value="medium">Orta Öncelikli</option>
              <option value="low">Düşük Öncelikli</option>
            </select>
          </div>
        </div>
      </div>

      {/* Talepler Tablosu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Daire/Sakin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Talep Başlığı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Öncelik
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const statusInfo = getStatusInfo(request.status);
                  const priorityInfo = getPriorityInfo(request.priority);
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Daire {request.unitNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.residentName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {request.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {request.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.textColor}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/maintenance/${request.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <LuMessageSquare className="w-5 h-5 inline mr-1" /> Yanıtla
                        </Link>
                        <button
                          onClick={() => router.push(`/admin/maintenance/edit/${request.id}`)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          <LuPencil className="w-5 h-5 inline mr-1" /> Düzenle
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Bakım ve arıza talebi bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{filteredRequests.length}</span> talep gösteriliyor
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 