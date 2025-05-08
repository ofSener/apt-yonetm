"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  LuPlus, 
  LuClock, 
  LuCheck, 
  LuX, 
  LuCalendar,
  LuMessageSquare,
  LuTriangle,
  LuClipboardList,
  LuFilter,
  LuEye,
  LuEyeOff,
  LuSend,
  LuUser,
  LuUsers,
  LuInfo,
  LuRepeat
} from "react-icons/lu";

// Örnek bakım talepleri - daha sonra API'den alınacak
const mockRequests = [
  {
    id: "1",
    unitNumber: "5",
    title: "Su Tesisatı Arızası",
    description: "Mutfak lavabosundan su sızıntısı var. Acil müdahale gerekli.",
    status: "completed", // pending, inProgress, completed, rejected
    priority: "high", // low, medium, high
    createdAt: "2023-06-10T14:30:00",
    updatedAt: "2023-06-12T09:15:00",
    completedAt: "2023-06-12T09:15:00",
    isPublic: false,
    category: "plumbing",
    comments: [
      {
        id: "c1",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Tesisatçı bugün saat 14:00'da gelecek.",
        createdAt: "2023-06-11T10:00:00",
        isPrivate: false,
      },
      {
        id: "c2",
        author: "Ahmet Yılmaz",
        authorRole: "RESIDENT",
        content: "Teşekkürler, evde olacağım.",
        createdAt: "2023-06-11T10:15:00",
        isPrivate: false,
      },
      {
        id: "c3",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Arıza giderildi. İyi günler.",
        createdAt: "2023-06-12T09:15:00",
        isPrivate: false,
      }
    ]
  },
  {
    id: "2",
    unitNumber: "5",
    title: "Elektrik Arızası",
    description: "Salondaki prizler çalışmıyor, diğer odalarda sorun yok.",
    status: "inProgress",
    priority: "medium",
    createdAt: "2023-06-15T08:45:00",
    updatedAt: "2023-06-15T11:20:00",
    completedAt: null,
    isPublic: true,
    category: "electrical",
    comments: [
      {
        id: "c4",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Elektrikçi yarın saat 11:00'da gelecek.",
        createdAt: "2023-06-15T11:20:00",
        isPrivate: false,
      },
      {
        id: "c5",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Bu sorun birkaç dairede daha bildirildi. Muhtemelen apartman genelinde bir problem var.",
        createdAt: "2023-06-15T11:25:00",
        isPrivate: false,
      }
    ]
  },
  {
    id: "3",
    unitNumber: "5",
    title: "Kapı Kilidi Arızalı",
    description: "Daire kapısı zor kilitleniyor, kilit mekanizması eskimiş olabilir.",
    status: "pending",
    priority: "low",
    createdAt: "2023-06-17T17:30:00",
    updatedAt: "2023-06-17T17:30:00",
    completedAt: null,
    isPublic: false,
    category: "lock",
    comments: []
  },
  {
    id: "4",
    unitNumber: "8", // Başka daire
    title: "Asansör Arızası",
    description: "B blok asansörü 3. katta kalıyor ve hareket etmiyor.",
    status: "inProgress",
    priority: "high",
    createdAt: "2023-06-18T10:30:00",
    updatedAt: "2023-06-18T11:45:00",
    completedAt: null,
    isPublic: true,
    category: "elevator",
    comments: [
      {
        id: "c6",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Asansör firması bilgilendirildi, acil müdahale için geliyorlar.",
        createdAt: "2023-06-18T11:00:00",
        isPrivate: false,
      },
      {
        id: "c7",
        author: "Mehmet Demir",
        authorRole: "RESIDENT",
        content: "Teşekkürler, yaşlı sakinlerimiz için zor bir durum oldu.",
        createdAt: "2023-06-18T11:15:00",
        isPrivate: false,
      },
      {
        id: "c8",
        author: "Yönetici",
        authorRole: "MANAGER",
        content: "Firma yaklaşık 1 saat içinde gelecek, acil durumlarda beni arayabilirsiniz.",
        createdAt: "2023-06-18T11:45:00",
        isPrivate: false,
      }
    ]
  }
];

// Bakım kategorileri
const maintenanceCategories = [
  { id: "all", label: "Tümü" },
  { id: "plumbing", label: "Su/Tesisat" },
  { id: "electrical", label: "Elektrik" },
  { id: "elevator", label: "Asansör" },
  { id: "heating", label: "Isıtma" },
  { id: "security", label: "Güvenlik" },
  { id: "common", label: "Ortak Alan" },
  { id: "other", label: "Diğer" }
];

export default function MaintenancePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, inProgress, completed, rejected
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("my"); // my, public, all (all için admin/manager yetkisi gerekli)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState(mockRequests);

  const isAdminOrManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";
  
  // Filtreleme
  const userUnitNumber = (session?.user as any)?.unitNumber || "5";
  
  // Arama ve filtreleme işlemleri
  const filteredRequests = requests
    .filter(request => {
      // Görüntüleme modu filtresi
      if (viewMode === "my") return request.unitNumber === userUnitNumber;
      if (viewMode === "public") return request.isPublic;
      if (viewMode === "all" && isAdminOrManager) return true;
      return request.unitNumber === userUnitNumber;
    })
    .filter(request => {
      // Durum filtresi
      if (statusFilter === "all") return true;
      return request.status === statusFilter;
    })
    .filter(request => {
      // Kategori filtresi
      if (categoryFilter === "all") return true;
      return request.category === categoryFilter;
    })
    .filter(request => {
      // Arama filtresi
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        request.title.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.comments.some(comment => comment.content.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const toggleExpand = (id: string) => {
    if (expandedRequestId === id) {
      setExpandedRequestId(null);
    } else {
      setExpandedRequestId(id);
    }
  };

  const handleCommentSubmit = (requestId: string) => {
    if (!newComment.trim()) return;

    // Yeni yorum ekleme işlemi - normalde API'ye gönderilir
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          comments: [
            ...request.comments,
            {
              id: `c${Date.now()}`,
              author: session?.user?.name || "Anonim",
              authorRole: session?.user?.role || "RESIDENT",
              content: newComment,
              createdAt: new Date().toISOString(),
              isPrivate: isPrivateMessage
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    setNewComment("");
    setIsPrivateMessage(false);
  };

  const togglePublicStatus = (requestId: string) => {
    // Talebin görünürlük durumunu değiştirme - normalde API'ye gönderilir
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          isPublic: !request.isPublic,
          updatedAt: new Date().toISOString()
        };
      }
      return request;
    });

    setRequests(updatedRequests);
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bakım ve Arıza Talepleri</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bakım ve arıza taleplerinizi görüntüleyin, oluşturun ve takip edin.
          </p>
        </div>
        <Link
          href="/dashboard/maintenance/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <LuPlus className="mr-2" /> Yeni Talep Oluştur
        </Link>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Görüntüleme Modu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Görüntüleme Modu
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("my")}
                className={`flex-1 px-3 py-2 text-sm text-center ${
                  viewMode === "my"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                } first:rounded-l-md`}
              >
                <LuUser className="inline mr-1" /> Taleplerim
              </button>
              <button
                onClick={() => setViewMode("public")}
                className={`flex-1 px-3 py-2 text-sm text-center ${
                  viewMode === "public"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <LuUsers className="inline mr-1" /> Topluluk
              </button>
              {isAdminOrManager && (
                <button
                  onClick={() => setViewMode("all")}
                  className={`flex-1 px-3 py-2 text-sm text-center ${
                    viewMode === "all"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } last:rounded-r-md`}
                >
                  <LuFilter className="inline mr-1" /> Tümü
                </button>
              )}
            </div>
          </div>

          {/* Durum Filtresi */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durum
            </label>
            <select
              id="status-filter"
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

          {/* Kategori Filtresi */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              id="category-filter"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {maintenanceCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Arama */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arama
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Talep ara..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bilgi Mesajı */}
      {viewMode === "public" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start">
          <LuInfo className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <p className="text-blue-700 dark:text-blue-300 font-medium">Topluluk Görünümü</p>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              Bu görünümde diğer daire sakinlerinin paylaştığı ortak sorunları görüntüleyebilirsiniz. 
              Kendi talebinizi topluluk görünümünde paylaşmak için "Paylaş" butonunu kullanabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* Talepler Listesi */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const statusInfo = getStatusInfo(request.status);
            const priorityInfo = getPriorityInfo(request.priority);
            const isExpanded = expandedRequestId === request.id;
            const isOwnRequest = request.unitNumber === userUnitNumber;
            
            return (
              <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => toggleExpand(request.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.title}</h3>
                        {request.isPublic && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            <LuUsers className="w-3 h-3 mr-1" /> Topluluk
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${priorityInfo.bgColor} ${priorityInfo.textColor}`}>
                          Öncelik: {priorityInfo.label}
                        </span>
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          <LuCalendar className="w-3 h-3 mr-1" /> {formatDate(request.createdAt)}
                        </span>
                        {!isOwnRequest && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                            Daire: {request.unitNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.comments.length > 0 && (
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          <LuMessageSquare className="w-3 h-3 mr-1" /> {request.comments.length}
                        </span>
                      )}
                      {isOwnRequest && !isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePublicStatus(request.id);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          title={request.isPublic ? "Gizle" : "Toplulukta Paylaş"}
                        >
                          {request.isPublic ? (
                            <LuEyeOff className="w-5 h-5" />
                          ) : (
                            <LuEye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-6 pb-4">
                    <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {request.description}
                      </p>
                    </div>
                    
                    {/* Görünürlük ve Durum Ayarları */}
                    {isOwnRequest && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={() => togglePublicStatus(request.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                            request.isPublic 
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                          }`}
                        >
                          {request.isPublic ? (
                            <>
                              <LuEyeOff className="w-4 h-4 mr-1" /> Gizle
                            </>
                          ) : (
                            <>
                              <LuEye className="w-4 h-4 mr-1" /> Toplulukta Paylaş
                            </>
                          )}
                        </button>
                        
                        {isAdminOrManager && (
                          <Link
                            href={`/dashboard/maintenance/${request.id}/edit`}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <LuRepeat className="w-4 h-4 mr-1" /> Durum Güncelle
                          </Link>
                        )}
                      </div>
                    )}
                    
                    {/* Yorumlar Bölümü */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Yorumlar ve Güncellemeler
                      </h4>
                      
                      {request.comments.length > 0 ? (
                        <div className="space-y-4 mb-4">
                          {request.comments.map(comment => (
                            <div key={comment.id} className={`p-3 rounded-lg ${
                              comment.isPrivate 
                                ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800"
                                : "bg-gray-50 dark:bg-gray-700/50"
                            }`}>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {comment.author}
                                  </span>
                                  {comment.authorRole === "MANAGER" && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                      Yönetici
                                    </span>
                                  )}
                                  {comment.authorRole === "ADMIN" && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                      Admin
                                    </span>
                                  )}
                                  {comment.isPrivate && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                      <LuMessageSquare className="w-3 h-3 mr-1" /> Özel Mesaj
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                          Henüz yorum yapılmamış.
                        </p>
                      )}
                      
                      {/* Yorum Ekleme Formu */}
                      <div className="mt-4">
                        <textarea
                          placeholder="Yorumunuzu yazın..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none"
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        
                        <div className="flex justify-between items-center mt-2">
                          {/* Özel Mesaj Seçeneği */}
                          {isOwnRequest && (
                            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                                checked={isPrivateMessage}
                                onChange={() => setIsPrivateMessage(!isPrivateMessage)}
                              />
                              Yöneticiye özel mesaj (sadece yönetici görebilir)
                            </label>
                          )}
                          
                          <button
                            onClick={() => handleCommentSubmit(request.id)}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            <LuSend className="mr-2" /> Gönder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {viewMode === "my" 
                ? "Henüz bakım veya arıza talebiniz bulunmamaktadır."
                : viewMode === "public" 
                  ? "Şu anda toplulukta paylaşılan talep bulunmamaktadır."
                  : "Kriterlere uygun talep bulunamadı."
              }
            </p>
            <Link
              href="/dashboard/maintenance/create"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <LuPlus className="mr-2" /> Yeni Talep Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 