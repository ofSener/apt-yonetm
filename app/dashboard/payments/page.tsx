"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  LuCreditCard, 
  LuCalendar, 
  LuCheck, 
  LuX, 
  LuFilter,
  LuBanknote,
  LuDollarSign,
  LuBuilding
} from "react-icons/lu";

// Örnek ödeme verileri
const mockPayments = [
  {
    id: "1",
    unitNumber: "5",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: true,
    paymentDate: "2023-06-10",
    paymentMethod: "Havale/EFT",
    description: "Haziran 2023 Aidatı",
  },
  {
    id: "2",
    unitNumber: "5",
    amount: 550,
    dueDate: "2023-05-15",
    isPaid: true,
    paymentDate: "2023-05-14",
    paymentMethod: "Havale/EFT",
    description: "Mayıs 2023 Aidatı",
  },
  {
    id: "3",
    unitNumber: "5",
    amount: 550,
    dueDate: "2023-04-15",
    isPaid: true,
    paymentDate: "2023-04-12",
    paymentMethod: "Havale/EFT",
    description: "Nisan 2023 Aidatı",
  },
  {
    id: "4",
    unitNumber: "5",
    amount: 500,
    dueDate: "2023-03-15",
    isPaid: true,
    paymentDate: "2023-03-15",
    paymentMethod: "Havale/EFT",
    description: "Mart 2023 Aidatı",
  },
  {
    id: "5",
    unitNumber: "5",
    amount: 500,
    dueDate: "2023-02-15",
    isPaid: true,
    paymentDate: "2023-02-10",
    paymentMethod: "Havale/EFT",
    description: "Şubat 2023 Aidatı",
  },
  {
    id: "6",
    unitNumber: "5",
    amount: 500,
    dueDate: "2023-01-15",
    isPaid: true,
    paymentDate: "2023-01-10",
    paymentMethod: "Havale/EFT",
    description: "Ocak 2023 Aidatı",
  },
  {
    id: "7",
    unitNumber: "5",
    amount: 600,
    dueDate: "2023-07-15",
    isPaid: false,
    paymentDate: null,
    paymentMethod: null,
    description: "Temmuz 2023 Aidatı",
  },
];

// Banka hesap bilgileri
const bankAccounts = [
  {
    bank: "Ziraat Bankası",
    accountName: "Örnek Apt. Yönetimi",
    iban: "TR33 0001 0002 3456 7891 0123 45",
    description: "Aidat ödemelerinizi yaparken açıklamaya daire numaranızı yazınız."
  },
  {
    bank: "Garanti Bankası",
    accountName: "Örnek Apt. Yönetimi",
    iban: "TR63 0006 2000 1234 5678 9012 34",
    description: "Aidat ödemelerinizi yaparken açıklamaya daire numaranızı yazınız."
  }
];

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [paymentPeriod, setPaymentPeriod] = useState("all"); // all, unpaid, paid
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");

  // Tüm kullanıcılar için geçerli olacak şekilde filtreleme
  // Gerçek uygulamada session'daki kullanıcı bilgisine göre daire bazlı filtreleme yapılacak
  const userUnitNumber = (session?.user as any)?.unitNumber || "5"; // Default olarak 5 nolu daire
  
  const filteredPayments = mockPayments
    .filter(payment => payment.unitNumber === userUnitNumber)
    .filter(payment => {
      if (paymentPeriod === "paid") return payment.isPaid;
      if (paymentPeriod === "unpaid") return !payment.isPaid;
      return true;
    })
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const unpaidPayments = filteredPayments.filter(p => !p.isPaid);
  const hasUnpaidPayments = unpaidPayments.length > 0;

  const openPaymentDetails = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Ödeme işlemi simülasyonu
    setShowPaymentModal(false);
    setShowSuccessMessage(true);
    
    // 3 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aidat Ödemeleri</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aidat ödeme geçmişinizi görüntüleyebilir ve ödemelerinizi gerçekleştirebilirsiniz.
        </p>
      </div>

      {/* Başarılı Ödeme Mesajı */}
      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start">
          <LuCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <p className="text-green-700 dark:text-green-300 font-medium">Ödeme talebiniz alınmıştır!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Ödemeniz onaylandıktan sonra sistem otomatik olarak güncellenecektir.</p>
          </div>
        </div>
      )}

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Güncel Aidat</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {hasUnpaidPayments ? `${unpaidPayments[0].amount.toLocaleString('tr-TR')} ₺` : '0 ₺'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {hasUnpaidPayments ? `Son ödeme: ${new Date(unpaidPayments[0].dueDate).toLocaleDateString('tr-TR')}` : 'Ödenmemiş aidat bulunmuyor'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <LuBuilding className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Toplam Ödenmemiş</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {unpaidPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {unpaidPayments.length} ödenmemiş aidat
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <LuDollarSign className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ödenen Toplam (2023)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {filteredPayments
                  .filter(p => p.isPaid && new Date(p.dueDate).getFullYear() === 2023)
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredPayments.filter(p => p.isPaid && new Date(p.dueDate).getFullYear() === 2023).length} ödeme
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <LuCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Ödeme Yapma Alanı */}
      {hasUnpaidPayments && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hızlı Ödeme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Ödenmemiş Aidat:</span> {unpaidPayments[0].description}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Tutar:</span> {unpaidPayments[0].amount.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-medium">Son Ödeme Tarihi:</span> {new Date(unpaidPayments[0].dueDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => openPaymentDetails(unpaidPayments[0])}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
              >
                <LuCreditCard className="mr-2" /> Öde
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banka Hesap Bilgileri */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Banka Hesap Bilgileri</h2>
        <div className="space-y-4">
          {bankAccounts.map((account, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white font-medium mb-1">{account.bank}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <span className="font-medium">Hesap Adı:</span> {account.accountName}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-1 font-mono">
                <span className="font-medium font-sans">IBAN:</span> {account.iban}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {account.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ödeme Geçmişi</h2>
        <div className="flex items-center">
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            value={paymentPeriod}
            onChange={(e) => setPaymentPeriod(e.target.value)}
          >
            <option value="all">Tüm Ödemeler</option>
            <option value="paid">Ödenen</option>
            <option value="unpaid">Ödenmemiş</option>
          </select>
        </div>
      </div>

      {/* Ödeme Geçmişi */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tutar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Son Ödeme
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.description}
                      </div>
                      {payment.isPaid && payment.paymentDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Ödeme: {new Date(payment.paymentDate).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-semibold ${
                          payment.isPaid
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {payment.isPaid ? (
                          <>
                            <LuCheck className="w-4 h-4 mr-1" /> Ödendi
                          </>
                        ) : (
                          <>
                            <LuX className="w-4 h-4 mr-1" /> Ödenmedi
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!payment.isPaid ? (
                        <button
                          onClick={() => openPaymentDetails(payment)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Öde
                        </button>
                      ) : (
                        <button
                          onClick={() => openPaymentDetails(payment)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Detay
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Ödeme kaydı bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ödeme Detay Modalı - Ödeme yöntemi seçimi için güncellendi */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    {selectedPayment.isPaid ? (
                      <LuCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <LuBanknote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {selectedPayment.isPaid ? "Ödeme Detayı" : "Ödeme Yap"}
                    </h3>
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Aidat Dönemi:</span> {selectedPayment.description}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Tutar:</span> {selectedPayment.amount.toLocaleString('tr-TR')} ₺
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Son Ödeme Tarihi:</span> {new Date(selectedPayment.dueDate).toLocaleDateString('tr-TR')}
                      </p>
                      
                      {selectedPayment.isPaid ? (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Ödeme Tarihi:</span> {new Date(selectedPayment.paymentDate).toLocaleDateString('tr-TR')}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Ödeme Yöntemi:</span> {selectedPayment.paymentMethod}
                          </p>
                        </>
                      ) : (
                        <div className="mt-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Ödeme yapmak için aşağıdaki yöntemlerden birini seçebilirsiniz:
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                id="bank-transfer"
                                name="payment-method"
                                type="radio"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                checked={paymentMethod === "bank-transfer"}
                                onChange={() => setPaymentMethod("bank-transfer")}
                              />
                              <label htmlFor="bank-transfer" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Banka Havalesi / EFT
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="credit-card"
                                name="payment-method"
                                type="radio"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                checked={paymentMethod === "credit-card"}
                                onChange={() => setPaymentMethod("credit-card")}
                              />
                              <label htmlFor="credit-card" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Kredi Kartı
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!selectedPayment.isPaid && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={processPayment}
                  >
                    Ödeme Yap
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPaymentModal(false)}
                >
                  {selectedPayment.isPaid ? "Kapat" : "İptal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 