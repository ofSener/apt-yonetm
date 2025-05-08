"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuSave, LuX, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface AnnouncementFormData {
  title: string;
  content: string;
  isImportant: boolean;
  isActive: boolean;
}

// Mock announcements for development
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
  },
  {
    id: "3",
    title: "Apartman Toplantısı",
    content: "20 Haziran Pazar saat 19:00'da apartman toplantısı düzenlenecektir. Tüm kat maliklerinin katılımı beklenmektedir.",
    date: "2023-06-05",
    isImportant: false,
    isActive: true,
  },
  {
    id: "4",
    title: "Çatı Tamiratı",
    content: "Önümüzdeki hafta çatı tamiratı yapılacaktır. Detaylar için yöneticiyle iletişime geçiniz.",
    date: "2023-05-28",
    isImportant: false,
    isActive: false,
  },
];

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AnnouncementFormData>();

  useEffect(() => {
    // Fetch announcement data based on ID
    const announcement = mockAnnouncements.find(a => a.id === id);
    
    if (announcement) {
      // Pre-fill form with announcement data
      reset({
        title: announcement.title,
        content: announcement.content,
        isImportant: announcement.isImportant,
        isActive: announcement.isActive,
      });
    } else {
      setNotFound(true);
    }
  }, [id, reset]);

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true);
    
    try {
      // API call to update announcement would go here
      console.log("Güncellenen duyuru:", { id, ...data });
      
      // Simulate successful update
      setTimeout(() => {
        setIsSubmitting(false);
        router.push("/admin/announcements");
      }, 1000);
    } catch (error) {
      console.error("Duyuru güncelleme hatası:", error);
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/admin/announcements" 
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <LuArrowLeft className="mr-1" /> Geri
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Duyuru Düzenle</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duyuru Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Duyuru başlığı gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Duyuru başlığını giriniz"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duyuru İçeriği <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                rows={8}
                {...register("content", { required: "Duyuru içeriği gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Duyuru içeriğini detaylıca açıklayınız"
              ></textarea>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <input
                  id="isImportant"
                  type="checkbox"
                  {...register("isImportant")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isImportant" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Önemli Duyuru
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aktif Duyuru
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-4">
            <Link
              href="/admin/announcements"
              className="px-4 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LuX className="mr-2" /> İptal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuSave className="mr-2" /> {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 