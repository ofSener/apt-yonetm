"use client";

import { useState, useEffect } from "react";
import { LuCopy, LuCheck, LuCreditCard, LuTriangle } from "react-icons/lu";

interface BankTransferProps {
  amount: number;
  reference: string;
  apartmentName: string;
}

export default function BankTransfer({ amount, reference, apartmentName }: BankTransferProps) {
  const [copied, setCopied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Bank account details - example data
  const bankDetails = {
    bank: "Ziraat Bankası",
    accountName: `${apartmentName} Apartman Yönetimi`,
    iban: "TR12 3456 7890 1234 5678 9012 34",
    swiftCode: "TCZBTR2A",
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handlePaymentConfirmation = () => {
    // Here you would normally submit a database record or API call
    // to record that the payment has been made manually
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <LuCreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Banka Havalesi ile Ödeme</h2>
      </div>
      
      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-md mb-4 flex items-start">
          <LuCheck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Ödeme bildirimi başarıyla kaydedildi. Yönetici tarafından onaylandıktan sonra ödeme geçmişinize yansıyacaktır.</p>
        </div>
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 p-4 rounded-md mb-6 flex items-start">
        <LuTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <p>Lütfen aşağıdaki banka hesabına havale yapın ve açıklama kısmına referans kodunuzu yazmayı unutmayın.</p>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="pb-4 border-b dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Referans Kodu</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900 dark:text-white">{reference}</p>
            <button 
              onClick={() => copyToClipboard(reference)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
            >
              {copied ? <LuCheck className="w-5 h-5" /> : <LuCopy className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="pb-4 border-b dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tutar</p>
          <p className="font-bold text-2xl text-gray-900 dark:text-white">{amount.toLocaleString('tr-TR')} ₺</p>
        </div>
        
        <div className="pb-4 border-b dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Banka</p>
          <p className="font-medium text-gray-900 dark:text-white">{bankDetails.bank}</p>
        </div>
        
        <div className="pb-4 border-b dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hesap Adı</p>
          <p className="font-medium text-gray-900 dark:text-white">{bankDetails.accountName}</p>
        </div>
        
        <div className="pb-4 border-b dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">IBAN</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900 dark:text-white">{bankDetails.iban}</p>
            <button 
              onClick={() => copyToClipboard(bankDetails.iban)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
            >
              {copied ? <LuCheck className="w-5 h-5" /> : <LuCopy className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">SWIFT Kodu</p>
          <p className="font-medium text-gray-900 dark:text-white">{bankDetails.swiftCode}</p>
        </div>
      </div>
      
      <button
        onClick={handlePaymentConfirmation}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ödemeyi Bildirin
      </button>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Ödeme yaptıktan sonra lütfen "Ödemeyi Bildirin" butonuna tıklayın.
      </p>
    </div>
  );
}