'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Settings, 
  Database, 
  Shield, 
  Server, 
  Gauge, 
  AlertTriangle,
  Activity
} from 'lucide-react';

// SuperAdmin dashboard card component
interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

const DashboardCard = ({ title, value, description, icon, trend, trendValue, color }: DashboardCardProps) => {
  // Color mappings
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800/50',
      iconColor: 'text-green-600 dark:text-green-400',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800/50',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-800/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-800/50',
      iconColor: 'text-red-600 dark:text-red-400',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
    },
  };

  return (
    <div className={`${colorClasses[color].bg} rounded-lg p-6`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${colorClasses[color].iconBg} rounded-md p-3`}>
          <div className={colorClasses[color].iconColor}>
            {icon}
          </div>
        </div>
        <div className="ml-5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <p className={`ml-2 text-sm font-medium ${
                trend === 'up' ? colorClasses[color].trendUp : 
                trend === 'down' ? colorClasses[color].trendDown : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {trendValue}
              </p>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function SuperAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
        <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          SuperAdmin Kontrol Paneli
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tüm apartmanları, kullanıcıları ve sistem ayarlarını yönetin.
        </p>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Toplam Apartman"
          value="24"
          description="Sistemdeki aktif apartman sayısı"
          icon={<Building className="h-6 w-6" />}
          trend="up"
          trendValue="2 yeni"
          color="blue"
        />
        <DashboardCard
          title="Toplam Kullanıcı"
          value="578"
          description="Kayıtlı tüm kullanıcılar"
          icon={<Users className="h-6 w-6" />}
          trend="up"
          trendValue="32 yeni"
          color="green"
        />
        <DashboardCard
          title="Sistem Performansı"
          value="98%"
          description="Ortalama yanıt süresi: 250ms"
          icon={<Gauge className="h-6 w-6" />}
          trend="neutral"
          trendValue="Stabil"
          color="purple"
        />
        <DashboardCard
          title="Aktif Hatalar"
          value="3"
          description="Dikkat gerektiren uyarılar"
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="down"
          trendValue="5 çözüldü"
          color="red"
        />
      </div>
      
      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
            <Building className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Apartman Yönetimi
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Sistemdeki tüm apartmanları yönetin, yeni apartmanlar ekleyin veya ayarları değiştirin.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/superadmin/apartments"
              className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium"
            >
              Tüm Apartmanlar
            </Link>
            <Link
              href="/superadmin/apartments/add"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Yeni Apartman Ekle
            </Link>
            <Link
              href="/superadmin/apartments/settings"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Apartman Ayarları
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
            <Users className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Kullanıcı Yönetimi
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Kullanıcıları yönetin, yeni yöneticiler ekleyin ve kullanıcı rollerini düzenleyin.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/superadmin/users"
              className="block w-full text-left px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 font-medium"
            >
              Tüm Kullanıcılar
            </Link>
            <Link
              href="/superadmin/users/admins"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Yöneticiler
            </Link>
            <Link
              href="/superadmin/users/add"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Yeni Kullanıcı Ekle
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
            <Settings className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Sistem Yönetimi
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Sistem ayarlarını yapılandırın, performansı izleyin ve güvenlik ayarlarını yönetin.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/superadmin/settings"
              className="block w-full text-left px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 font-medium"
            >
              Sistem Ayarları
            </Link>
            <Link
              href="/superadmin/security"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Güvenlik Ayarları
            </Link>
            <Link
              href="/superadmin/logs"
              className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/30"
            >
              Sistem Logları
            </Link>
          </div>
        </div>
      </div>
      
      {/* System Monitor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
          <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Sistem Monitörü
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">CPU Kullanımı</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">25% (2.1 GHz)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Bellek Kullanımı</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">45% (3.6 GB / 8 GB)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Disk Kullanımı</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-600 dark:bg-yellow-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">72% (230 GB / 320 GB)</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Son Olaylar</h3>
            <div className="text-xs space-y-2 max-h-40 overflow-y-auto">
              <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">Sistem yedeklemesi tamamlandı</p>
                <p className="text-gray-500 dark:text-gray-400">15 dakika önce</p>
              </div>
              <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">Yeni apartman kaydedildi: Park Residence</p>
                <p className="text-gray-500 dark:text-gray-400">2 saat önce</p>
              </div>
              <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">Kullanıcı yetkilendirmesi güncellendi</p>
                <p className="text-gray-500 dark:text-gray-400">3 saat önce</p>
              </div>
              <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">Veritabanı bakımı tamamlandı</p>
                <p className="text-gray-500 dark:text-gray-400">6 saat önce</p>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white">Sistem güncellemesi yüklendi: v2.3.4</p>
                <p className="text-gray-500 dark:text-gray-400">1 gün önce</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Aktif Servisler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-900 dark:text-white">Web Sunucusu</span>
                </div>
                <span className="text-green-600 dark:text-green-400 text-xs">Çalışıyor</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-900 dark:text-white">Veritabanı</span>
                </div>
                <span className="text-green-600 dark:text-green-400 text-xs">Çalışıyor</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-900 dark:text-white">Ödeme Servisi</span>
                </div>
                <span className="text-green-600 dark:text-green-400 text-xs">Çalışıyor</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-gray-900 dark:text-white">E-posta Servisi</span>
                </div>
                <span className="text-yellow-600 dark:text-yellow-400 text-xs">Kısmi Çalışma</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-gray-900 dark:text-white">SMS Gateway</span>
                </div>
                <span className="text-red-600 dark:text-red-400 text-xs">Çalışmıyor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg shadow-md p-4 text-left flex items-center">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Veri Yedekle</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tam sistem yedeği oluştur</p>
          </div>
        </button>
        
        <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg shadow-md p-4 text-left flex items-center">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Güvenlik Taraması</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sistemde güvenlik taraması başlat</p>
          </div>
        </button>
        
        <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg shadow-md p-4 text-left flex items-center">
          <Server className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sistem Bakımı</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bakım modu ve veritabanı optimizasyonu</p>
          </div>
        </button>
        
        <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg shadow-md p-4 text-left flex items-center">
          <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Konfigürasyon</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gelişmiş sistem ayarları</p>
          </div>
        </button>
      </div>
    </div>
  );
} 