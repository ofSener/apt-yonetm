'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { HelpCircle, MessageCircle, Mail, Phone, Send } from 'lucide-react';

export default function AdminSupportPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('technical');
  const [priority, setPriority] = useState('medium');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    setSent(true);
    setSending(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setMessage('');
      setCategory('technical');
      setPriority('medium');
      setSent(false);
    }, 3000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <HelpCircle className="w-6 h-6 mr-2" />
          Yardım ve Destek
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AptYonetim ekibinden yardım talep edin veya önerilerinizi paylaşın.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Destek Talebi</h2>
            
            {sent ? (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                      Destek talebiniz gönderildi
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                      <p>Ekibimiz en kısa sürede size geri dönüş yapacaktır.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  >
                    <option value="technical">Teknik Sorun</option>
                    <option value="billing">Faturalama / Ödeme</option>
                    <option value="feature">Özellik İsteği</option>
                    <option value="account">Hesap Yönetimi</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Öncelik
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                    placeholder="Lütfen sorununuzu veya önerinizi detaylı bir şekilde açıklayın..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ekler (Opsiyonel)
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40 cursor-pointer"
                    multiple
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || !message}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <span className="mr-2">Gönderiliyor</span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sık Sorulan Sorular</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Aidat ödemeleri nasıl yapılır?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Aidat ödemeleri kredi kartı veya banka havalesi ile yapılabilir. Ödeme sayfasından talimatları takip edebilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Yeni bir sakin nasıl eklenir?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Sakinler sayfasından "Yeni Sakin Ekle" butonunu kullanarak yeni sakin ekleyebilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Rapor oluşturma ve indirme işlemleri
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Raporlar sayfasından çeşitli filtreler kullanarak PDF veya Excel formatında raporlar oluşturabilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Fatura nasıl oluşturulur?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Ödeme sayfasından "Fatura Oluştur" seçeneğini kullanarak aidatlar için otomatik fatura oluşturabilirsiniz.
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://aptyonetim.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Tüm SSS'leri görüntüle →
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">E-posta</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    destek@aptyonetim.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Telefon</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    +90 (212) 123 4567
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Hafta içi: 09:00 - 18:00
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Canlı Destek</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Sağ alt köşedeki sohbet simgesine tıklayarak hemen canlı destek alabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 