"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LuSave, LuX, LuArrowLeft, LuUsers, LuInfo } from "react-icons/lu";

// Bakım kategorileri
const maintenanceCategories = [
  { id: "plumbing", label: "Su/Tesisat" },
  { id: "electrical", label: "Elektrik" },
  { id: "elevator", label: "Asansör" },
  { id: "heating", label: "Isıtma" },
  { id: "security", label: "Güvenlik" },
  { id: "common", label: "Ortak Alan" },
  { id: "lock", label: "Kilit/Kapı" },
  { id: "other", label: "Diğer" }
];

interface MaintenanceRequestFormData {
  title: string;
  description: string;
  priority: string;
  category: string;
  contactPhone: string;
  preferredTime: string;
  additionalInfo: string;
  isPublic: boolean;
}

export default function CreateMaintenanceRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<MaintenanceRequestFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      contactPhone: "",
      preferredTime: "",
      additionalInfo: "",
      isPublic: false
    }
  });

  const onSubmit = async (data: MaintenanceRequestFormData) => {
    setIsSubmitting(true);
    
    try {
      // API çağrısı burada yapılacak
      console.log("Bakım talebi verileri:", data);
      
      // Başarılı kayıt sonrası
      setTimeout(() => {
        setIsSubmitting(false);
        router.push("/dashboard/maintenance");
      }, 1000);
    } catch (error) {
      console.error("Bakım talebi oluşturma hatası:", error);
      setIsSubmitting(false);
    }
  };

  // Formdan isPublic değerini takip et
  const isPublic = watch("isPublic");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/dashboard/maintenance" 
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <LuArrowLeft className="mr-1" /> Geri
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Bakım/Arıza Talebi</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Talep Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Talep başlığı gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Sorunu kısaca açıklayın"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detaylı Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                {...register("description", { required: "Detaylı açıklama gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Sorunu detaylı olarak açıklayın"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register("category", { required: "Kategori seçimi gereklidir" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                >
                  {maintenanceCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Öncelik Durumu <span className="text-red-500">*</span>
                </label>
                <select
                  id="priority"
                  {...register("priority", { required: "Öncelik durumu gereklidir" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                >
                  <option value="low">Düşük - Acil değil, uygun zamanda</option>
                  <option value="medium">Orta - Normal sürede çözülmeli</option>
                  <option value="high">Yüksek - Acil müdahale gerekiyor</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İletişim Telefonu
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  {...register("contactPhone")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="05XX XXX XX XX"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tercih Edilen Zaman Aralığı
                </label>
                <select
                  id="preferredTime"
                  {...register("preferredTime")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Herhangi bir zaman</option>
                  <option value="morning">Sabah (09:00 - 12:00)</option>
                  <option value="afternoon">Öğleden Sonra (12:00 - 17:00)</option>
                  <option value="evening">Akşam (17:00 - 20:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ek Bilgiler
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                {...register("additionalInfo")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Eklemek istediğiniz başka bilgiler varsa yazabilirsiniz"
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register("isPublic")}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                />
                <div className="ml-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <LuUsers className="w-4 h-4 mr-1" /> Toplulukta Paylaş
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                    Bu talebi diğer daire sakinleri de görebilir. Benzer sorunları olan sakinler yorumlar yapabilir.
                  </span>
                </div>
              </label>
            </div>

            {isPublic && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4 flex items-start">
                <LuInfo className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Talebiniz toplulukta paylaşılacak. Bu seçeneği, eğer diğer sakinlerin de bu sorunu yaşayabileceğini düşünüyorsanız veya ortak alanları ilgilendiren bir sorun bildiriyorsanız seçmenizi öneririz.
                  </p>
                </div>
              </div>
            )}
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
              <LuSave className="mr-2" /> {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 