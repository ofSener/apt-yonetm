"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuUser, LuPhone, LuMail, LuCheck, LuTriangle, LuLock } from "react-icons/lu";

// Örnek profil verisi - normalde veritabanından gelir
const mockUserData = {
  name: "Ahmet Yılmaz",
  email: "ahmet.yilmaz@gmail.com",
  phone: "0532 123 45 67",
  unitNumber: "12",
  block: "B",
  floor: "3",
};

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    // Profil güncelleme işlemleri burada yapılır
    // Normalde API çağrısı yapılır
    
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Şifre değiştirme kontrolü
      if (changePassword) {
        if (data.newPassword !== data.confirmPassword) {
          setErrorMessage("Yeni şifreler eşleşmiyor");
          return;
        }
        
        // Şifre değiştirme işlemi burada yapılır
        console.log("Şifre değiştirme", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }
      
      // Profil bilgilerini güncelleme
      console.log("Profil güncelleme", {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      
      // Başarılı güncelleme
      setSuccessMessage("Profil bilgileriniz başarıyla güncellendi");
      setEditMode(false);
      setChangePassword(false);
      
      // Form sıfırlama
      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Başarı mesajını 3 saniye sonra kaldır
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (error) {
      setErrorMessage("Profil güncellenirken bir hata oluştu");
      
      // Hata mesajını 3 saniye sonra kaldır
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };
  
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-blue-600 dark:bg-blue-700">
          <h1 className="text-2xl font-bold text-white">Profil Bilgileri</h1>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 flex items-center">
            <LuCheck className="w-5 h-5 mr-2" />
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 flex items-center">
            <LuTriangle className="w-5 h-5 mr-2" />
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kişisel Bilgiler */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <LuUser className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Kişisel Bilgiler
                </h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad Soyad
                  </label>
                  <div className="flex items-center">
                    <LuUser className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="name"
                      type="text"
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editMode ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
                      } ${
                        errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                      {...register("name", { required: "Ad soyad gereklidir" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta Adresi
                  </label>
                  <div className="flex items-center">
                    <LuMail className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="email"
                      type="email"
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editMode ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
                      } ${
                        errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                      {...register("email", { 
                        required: "E-posta gereklidir",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Geçerli bir e-posta adresi giriniz"
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon Numarası
                  </label>
                  <div className="flex items-center">
                    <LuPhone className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      id="phone"
                      type="tel"
                      disabled={!editMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        editMode ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"
                      } ${
                        errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                      {...register("phone", { required: "Telefon numarası gereklidir" })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              {/* Daire Bilgileri */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <LuUser className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Daire Bilgileri
                </h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blok
                    </label>
                    <input
                      type="text"
                      value={mockUserData.block}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kat
                    </label>
                    <input
                      type="text"
                      value={mockUserData.floor}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Daire No
                    </label>
                    <input
                      type="text"
                      value={mockUserData.unitNumber}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Not: Daire bilgileriniz sadece apartman yöneticisi tarafından güncellenebilir.
                </p>
                
                {/* Şifre Değiştirme */}
                {editMode && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <LuLock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Şifre Değiştirme
                      </h2>
                      <button
                        type="button"
                        onClick={() => setChangePassword(!changePassword)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {changePassword ? "İptal" : "Şifremi Değiştir"}
                      </button>
                    </div>
                    
                    {changePassword && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mevcut Şifre
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 ${
                              errors.currentPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                            {...register("currentPassword", { 
                              required: changePassword ? "Mevcut şifre gereklidir" : false
                            })}
                          />
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Yeni Şifre
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 ${
                              errors.newPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                            {...register("newPassword", { 
                              required: changePassword ? "Yeni şifre gereklidir" : false,
                              minLength: {
                                value: 6,
                                message: "Şifre en az 6 karakter olmalıdır"
                              }
                            })}
                          />
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Yeni Şifre Tekrar
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 ${
                              errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                            {...register("confirmPassword", { 
                              required: changePassword ? "Şifre tekrarı gereklidir" : false,
                              validate: value => 
                                !changePassword || value === watch("newPassword") || "Şifreler eşleşmiyor"
                            })}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setChangePassword(false);
                      reset({
                        name: mockUserData.name,
                        email: mockUserData.email,
                        phone: mockUserData.phone,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 mr-3"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Kaydet
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Düzenle
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 