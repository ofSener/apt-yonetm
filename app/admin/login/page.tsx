"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuBuilding2, LuShieldCheck } from "react-icons/lu";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      apartmentCode: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");

    try {
      // Admin giriş denemesi
      const result = await signIn("credentials", {
        redirect: false,
        apartmentCode: data.apartmentCode,
        password: data.password,
        isAdmin: true, // Admin girişi olduğunu belirten özel alan
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Admin paneline yönlendir
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <LuBuilding2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AptYonetim</h1>
            </Link>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <LuShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Yönetici Girişi</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="apartmentCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apartman Kodu
              </label>
              <input
                id="apartmentCode"
                type="text"
                {...register("apartmentCode", { required: "Apartman kodu gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Apartman kodunu girin"
              />
              {errors.apartmentCode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.apartmentCode.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Admin Şifresi
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "Şifre gereklidir" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="Yönetici şifrenizi girin"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Giriş yapılıyor..." : "Yönetici Girişi"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Site sakini misiniz? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Normal giriş yapın</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 