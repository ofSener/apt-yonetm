"use client";

import { useState } from "react";
import Link from "next/link";
import { LuInfo, LuChevronDown, LuChevronUp, LuMessageSquare, LuPhone, LuMail } from "react-icons/lu";

// FAQ Data
const faqData = [
  {
    question: "Aidatımı nasıl ödeyebilirim?",
    answer: "Aidatlarınızı uygulamanın ödeme sayfasından banka havalesi yöntemiyle ödeyebilirsiniz. Ödeme yaparken, size özel referans kodunu açıklama kısmına eklemeyi unutmayın."
  },
  {
    question: "Aidat tutarımı nasıl öğrenebilirim?",
    answer: "Aidat tutarınız, dashboard sayfasındaki ödemeler bölümünde görüntülenebilir. Ayrıca geçmiş ödemelerinizi ve varsa gecikmiş ödemelerinizi de buradan görebilirsiniz."
  },
  {
    question: "Dairem için teknik destek talebinde bulunmak istiyorum. Ne yapmalıyım?",
    answer: "Dashboard üzerindeki 'Teknik Destek' bölümünden yeni bir talep oluşturabilirsiniz. Talebinizin durumunu yine aynı sayfadan takip edebilirsiniz."
  },
  {
    question: "Şifremi unuttum. Nasıl sıfırlayabilirim?",
    answer: "Giriş sayfasındaki 'Şifremi Unuttum' bağlantısını kullanarak şifrenizi sıfırlayabilirsiniz. Apartman kodunuzu ve daire numaranızı girmeniz gerekecektir."
  },
  {
    question: "Kişisel bilgilerimi nasıl güncelleyebilirim?",
    answer: "Profil sayfanızdan kişisel bilgilerinizi (telefon, e-posta vb.) güncelleyebilirsiniz. Daire bilgilerinizle ilgili değişiklikler için lütfen apartman yöneticinizle iletişime geçin."
  },
  {
    question: "Apartman yöneticisiyle nasıl iletişime geçebilirim?",
    answer: "Uygulama içindeki mesajlaşma özelliğini kullanarak yöneticiyle doğrudan iletişime geçebilirsiniz. Ayrıca yöneticinin iletişim bilgilerine de 'İletişim' sayfasından ulaşabilirsiniz."
  },
  {
    question: "Duyuruları nasıl görebilirim?",
    answer: "Tüm apartman duyuruları ana dashboard sayfasında görüntülenmektedir. Ayrıca önemli duyurular için bildirim alabilirsiniz."
  }
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  
  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Yardım & Destek Merkezi</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Apartman yönetim sistemi hakkında sık sorulan sorular ve destek bilgilerini burada bulabilirsiniz.
        </p>
      </div>
      
      {/* Sık Sorulan Sorular */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <LuInfo className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            Sık Sorulan Sorular
          </h2>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="border dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {openItems.includes(index) ? (
                    <LuChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <LuChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* İletişim Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <LuMessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Canlı Destek</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Teknik destek ekibimizle canlı sohbet edin.</p>
          <button className="mt-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Sohbete Başla
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <LuPhone className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Telefon Desteği</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Hafta içi 09:00-18:00 saatleri arasında bize ulaşın.</p>
          <p className="font-medium text-gray-900 dark:text-white mb-2">0212 123 45 67</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <LuMail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">E-posta Desteği</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Sorularınız için e-posta ile ulaşabilirsiniz.</p>
          <a href="mailto:destek@aptyonetim.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            destek@aptyonetim.com
          </a>
        </div>
      </div>
      
      {/* Kullanım Kılavuzu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kullanım Kılavuzu</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          AptYönetim uygulamasının tüm özelliklerini kullanmak için detaylı kullanım kılavuzumuzu inceleyebilirsiniz.
        </p>
        <Link 
          href="/documents/user-guide.pdf"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Kullanım Kılavuzunu İndir
        </Link>
      </div>
    </div>
  );
} 