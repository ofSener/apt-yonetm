"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuSave, LuX, LuArrowLeft, LuLoader, LuCheck, LuX as LuXIcon } from "react-icons/lu";

// Örnek bakım talebi - normalde API'den alınacak
const getMockRequest = (id: string) => {
  return {
    id,
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
      }
    ]
  };
};

interface StatusUpdateFormData {
  status: string;
  internalNote: string;
  assignTo: string;
}

export default function EditMaintenanceRequestPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '0';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [formData, setFormData] = useState<StatusUpdateFormData>({
    status: "",
    internalNote: "",
    assignTo: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Admin veya Yönetici kontrolü
  const isAdminOrManager = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (sessionStatus === "authenticated" && !isAdminOrManager) {
      router.push("/dashboard/maintenance");
      return;
    }

    // Bakım talebi verilerini getir
    const fetchData = async () => {
      try {
        // Gerçek uygulamada API çağrısı yapılacak
        // const response = await fetch(`/api/maintenance/${id}`);
        // const data = await response.json();
        
        // Mock veri kullanımı
        const mockData = getMockRequest(id);
        setRequest(mockData);
        setFormData({
          status: mockData.status,
          internalNote: "",
          assignTo: ""
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        setError("Bakım talebi bilgileri yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router, sessionStatus, isAdminOrManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Gerçek uygulamada API çağrısı yapılacak
      // const response = await fetch(`/api/maintenance/${id}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Güncelleme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı
      setSuccessMessage("Bakım talebi başarıyla güncellendi");
      setTimeout(() => {
        router.push("/dashboard/maintenance");
      }, 1500);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      setError("Bakım talebi güncellenirken bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  // Durum bilgisi fonksiyonu
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Bekliyor";
      case "inProgress": return "İşleme Alındı";
      case "completed": return "Tamamlandı";
      case "rejected": return "Reddedildi";
      default: return "Bilinmiyor";
    }
  };

  // Formatlanmış tarih
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex items-center space-x-2">
          <LuLoader className="animate-spin h-5 w-5 text-blue-600" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <LuXIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <p className="text-red-700 dark:text-red-300 font-medium">Hata</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            <Link 
              href="/dashboard/maintenance" 
              className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <LuArrowLeft className="mr-1" /> Bakım Taleplerine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start">
          <LuXIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">Kayıt Bulunamadı</p>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
              Aradığınız bakım talebi bulunamadı veya erişim izniniz yok.
            </p>
            <Link 
              href="/dashboard/maintenance" 
              className="mt-2 inline-flex items-center text-sm text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              <LuArrowLeft className="mr-1" /> Bakım Taleplerine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/dashboard/maintenance" 
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <LuArrowLeft className="mr-1" /> Geri
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bakım Talebi Durumu Güncelle</h1>
      </div>

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start">
          <LuCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 mr-2" />
          <p className="text-green-700 dark:text-green-300">{successMessage}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{request.title}</h2>
          
          {/* Talep Detayları */}
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Talep Bilgileri</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Daire:</span> {request.unitNumber}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Durum:</span> {getStatusLabel(request.status)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Oluşturulma:</span> {formatDate(request.createdAt)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Son Güncelleme:</span> {formatDate(request.updatedAt)}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{request.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Durum Güncelleme Formu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Durum Güncelle <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                required
              >
                <option value="pending">Bekliyor</option>
                <option value="inProgress">İşleme Alındı</option>
                <option value="completed">Tamamlandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Görevi Ata
              </label>
              <select
                id="assignTo"
                name="assignTo"
                value={formData.assignTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Seçiniz...</option>
                <option value="user1">Ali Yılmaz (Yönetici)</option>
                <option value="user2">Mehmet Demir (Teknik Personel)</option>
              </select>
            </div>

            <div>
              <label htmlFor="internalNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yönetici Notu (Sadece yöneticiler görebilir)
              </label>
              <textarea
                id="internalNote"
                name="internalNote"
                rows={3}
                value={formData.internalNote}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none"
                placeholder="Ekip için notlar ekleyin"
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-4">
            <Link
              href="/dashboard/maintenance"
              className="px-4 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LuX className="mr-2" /> İptal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuSave className="mr-2" /> {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 