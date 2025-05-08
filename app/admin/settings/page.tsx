'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, Save, Users, Building, CreditCard, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
        <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }
  
  const handleSave = async () => {
    setSaving(true);
    // Burada ayarları kaydetme işlemi yapılacak
    await new Promise(resolve => setTimeout(resolve, 1000)); // Demo için gecikme
    setSaving(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <Settings className="w-6 h-6 mr-2" />
          Yönetim Ayarları
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Apartman yönetim sistemi ayarlarını buradan yapılandırabilirsiniz.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 flex items-center text-sm font-medium ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Genel Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('residents')}
            className={`px-4 py-3 flex items-center text-sm font-medium ${
              activeTab === 'residents'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Sakin Ayarları
          </button>
          <button
            onClick={() => setActiveTab('apartment')}
            className={`px-4 py-3 flex items-center text-sm font-medium ${
              activeTab === 'apartment'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Building className="w-4 h-4 mr-2" />
            Apartman Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-3 flex items-center text-sm font-medium ${
              activeTab === 'payments'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Ödeme Ayarları
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 flex items-center text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Bildirim Ayarları
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Genel Sistem Ayarları</h2>
              
              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Adı
                </label>
                <input
                  type="text"
                  id="site-name"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="AptYonetim"
                />
              </div>
              
              <div>
                <label htmlFor="site-timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Zaman Dilimi
                </label>
                <select
                  id="site-timezone"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="Europe/Istanbul"
                >
                  <option value="Europe/Istanbul">Türkiye (UTC+3)</option>
                  <option value="Europe/London">Londra (UTC+0/+1)</option>
                  <option value="America/New_York">New York (UTC-5/-4)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tarih Formatı
                </label>
                <select
                  id="date-format"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="DD.MM.YYYY"
                >
                  <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Para Birimi
                </label>
                <select
                  id="currency"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="TRY"
                >
                  <option value="TRY">Türk Lirası (₺)</option>
                  <option value="USD">Amerikan Doları ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          )}
          
          {activeTab === 'residents' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Sakin Ayarları</h2>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked 
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Yeni sakinlerin kendi hesaplarını oluşturmasına izin ver
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked 
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Sakinlerin kişisel bilgilerini güncellemesine izin ver
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked 
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Ödeme geçmişini sakinlere göster
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Diğer sakinlerin iletişim bilgilerini göster
                  </span>
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'apartment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Apartman Bilgileri</h2>
              
              <div>
                <label htmlFor="apartment-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apartman Adı
                </label>
                <input
                  type="text"
                  id="apartment-name"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="Örnek Apartmanı"
                />
              </div>
              
              <div>
                <label htmlFor="apartment-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adres
                </label>
                <textarea
                  id="apartment-address"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="Örnek Mahallesi, Örnek Caddesi No:123, İstanbul"
                />
              </div>
              
              <div>
                <label htmlFor="apartment-floors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kat Sayısı
                </label>
                <input
                  type="number"
                  id="apartment-floors"
                  min="1"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="5"
                />
              </div>
              
              <div>
                <label htmlFor="apartment-units" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Daire Sayısı
                </label>
                <input
                  type="number"
                  id="apartment-units"
                  min="1"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="20"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ödeme Ayarları</h2>
              
              <div>
                <label htmlFor="due-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aidat Ödeme Günü
                </label>
                <select
                  id="due-day"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="5"
                >
                  {[...Array(28)].map((_, i) => (
                    <option key={i+1} value={i+1}>Her ayın {i+1}. günü</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked 
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Kredi kartı ödemelerine izin ver
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked 
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Banka havalesi ödemelerine izin ver
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Gecikmiş ödemeler için otomatik hatırlatma gönder
                  </span>
                </label>
              </div>
              
              <div>
                <label htmlFor="late-fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gecikme Cezası (%)
                </label>
                <input
                  type="number"
                  id="late-fee"
                  min="0"
                  step="0.1"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  defaultValue="1.5"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bildirim Ayarları</h2>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Yönetici Bildirimleri</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Yeni bakım talepleri
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Havale bildirimleri
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Gecikmiş ödemeler
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sakin Bildirimleri</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Yaklaşan ödemeler
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Ödeme onayları
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Yeni duyurular
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Bakım talebi güncellemeleri
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bildirim Kanalları</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Uygulama bildirimleri
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked 
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      E-posta bildirimleri
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      SMS bildirimleri
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="mr-2">Kaydediliyor</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 