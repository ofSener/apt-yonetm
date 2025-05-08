import Link from "next/link";
import { LuBuilding2 } from "react-icons/lu";
import { FaMoneyBillWave, FaClipboardList, FaVoteYea } from "react-icons/fa";
import { MdAnnouncement } from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LuBuilding2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AptYonetim</h1>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Giriş Yap
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Modern Apartman Yönetim Çözümü</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Apartmanınızı dijital ortamda kolayca yönetmenin en modern yolu. Aidat takibi, duyurular, anketler ve daha fazlası...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium">
              Hesabınıza Giriş Yapın
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg font-medium text-gray-800 dark:text-white">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Özellikler</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center text-center">
              <FaMoneyBillWave className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Aidat & Ödeme Yönetimi</h4>
              <p className="text-gray-600 dark:text-gray-300">Kolayca aidat takibi yapın ve çevrimiçi ödeme alın</p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center text-center">
              <MdAnnouncement className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Duyurular</h4>
              <p className="text-gray-600 dark:text-gray-300">Önemli bilgileri tüm apartman sakinleriyle paylaşın</p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center text-center">
              <FaVoteYea className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Anketler</h4>
              <p className="text-gray-600 dark:text-gray-300">Ortak kararları almak için anketler oluşturun</p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center text-center">
              <FaClipboardList className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Finansal Raporlar</h4>
              <p className="text-gray-600 dark:text-gray-300">Detaylı harcama takibi ve finansal raporlar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} AptYonetim. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
