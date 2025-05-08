"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LuPlus, 
  LuPencil, 
  LuTrash, 
  LuSearch,
  LuFilter,
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuX,
  LuDownload,
  LuMail
} from "react-icons/lu";

// Örnek ödeme verileri
const mockPayments = [
  {
    id: "1",
    unitNumber: "5",
    residentName: "Ahmet Yılmaz",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: true,
    paymentDate: "2023-06-10",
    paymentMethod: "Havale/EFT",
  },
  {
    id: "2",
    unitNumber: "12",
    residentName: "Ayşe Demir",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: true,
    paymentDate: "2023-06-12",
    paymentMethod: "Kredi Kartı",
  },
  {
    id: "3",
    unitNumber: "8",
    residentName: "Mehmet Kaya",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: false,
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: "4",
    unitNumber: "3",
    residentName: "Zeynep Şahin",
    amount: 550,
    dueDate: "2023-06-15",
    isPaid: false,
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: "5",
    unitNumber: "5",
    residentName: "Ahmet Yılmaz",
    amount: 550,
    dueDate: "2023-05-15",
    isPaid: true,
    paymentDate: "2023-05-14",
    paymentMethod: "Havale/EFT",
  },
  {
    id: "6",
    unitNumber: "12",
    residentName: "Ayşe Demir",
    amount: 550,
    dueDate: "2023-05-15",
    isPaid: true,
    paymentDate: "2023-05-13",
    paymentMethod: "Kredi Kartı",
  },
  {
    id: "7",
    unitNumber: "8",
    residentName: "Mehmet Kaya",
    amount: 550,
    dueDate: "2023-05-15",
    isPaid: true,
    paymentDate: "2023-05-18",
    paymentMethod: "Nakit",
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, paid, unpaid
  const [selectedMonth, setSelectedMonth] = useState("06-2023");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Silme işlemi için onay modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  // Ödeme alma modalı
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentToProcess, setPaymentToProcess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Havale/EFT");

  // Mevcut ay ve yıl
  const months = [
    { value: "06-2023", label: "Haziran 2023" },
    { value: "05-2023", label: "Mayıs 2023" },
    { value: "04-2023", label: "Nisan 2023" },
  ];

  // Filtreleme
  const filteredPayments = mockPayments.filter(payment => {
    // Ay filtresi
    const paymentMonth = new Date(payment.dueDate).toISOString().substring(5, 7);
    const paymentYear = new Date(payment.dueDate).toISOString().substring(0, 4);
    const paymentMonthYear = `${paymentMonth}-${paymentYear}`;
    
    if (paymentMonthYear !== selectedMonth) return false;
    
    // Durum filtresi
    if (statusFilter === "paid" && !payment.isPaid) return false;
    if (statusFilter === "unpaid" && payment.isPaid) return false;
    
    // Arama filtresi
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        payment.unitNumber.toLowerCase().includes(searchLower) ||
        payment.residentName.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const confirmDelete = (id: string) => {
    setPaymentToDelete(id);
    setShowDeleteModal(true);
  };

  const deletePayment = () => {
    if (paymentToDelete) {
      // Silme işlemi burada gerçekleştirilir
      console.log(`Ödeme silindi: ${paymentToDelete}`);
      setShowDeleteModal(false);
      setPaymentToDelete(null);
    }
  };

  const openPaymentModal = (id: string) => {
    setPaymentToProcess(id);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (paymentToProcess) {
      // Ödeme alma işlemi burada gerçekleştirilir
      console.log(`Ödeme alındı: ${paymentToProcess}, Yöntem: ${paymentMethod}`);
      setShowPaymentModal(false);
      setPaymentToProcess(null);
    }
  };

  // Toplu e-posta gönderme
  const sendReminders = () => {
    const unpaidCount = filteredPayments.filter(p => !p.isPaid).length;
    alert(`${unpaidCount} kişiye ödeme hatırlatma e-postası gönderilecek`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aidat Yönetimi</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/payments/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <LuPlus className="mr-2" /> Aidat Tanımla
          </Link>
          <button
            onClick={sendReminders}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <LuMail className="mr-2" /> Hatırlatma Gönder
          </button>
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Daire no veya isim ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Ödemeler</option>
              <option value="paid">Ödenenler</option>
              <option value="unpaid">Ödenmeyenler</option>
            </select>
          </div>
          
          <div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSelectedMonth("06-2023");
              }}
            >
              <LuFilter className="mr-2" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Ödeme Tablosu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Daire No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sakin
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
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.unitNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.residentName}
                      </div>
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
                      <div className="flex space-x-2">
                        {!payment.isPaid && (
                          <button
                            onClick={() => openPaymentModal(payment.id)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Ödeme Al"
                          >
                            <LuCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/admin/payments/edit/${payment.id}`)}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Düzenle"
                        >
                          <LuPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(payment.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Sil"
                        >
                          <LuTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Ödeme kaydı bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{filteredPayments.length}</span> ödeme kaydı
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <LuTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Ödeme Kaydını Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bu ödeme kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={deletePayment}
                >
                  Sil
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Alma Modalı */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <LuCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Ödeme Kaydet
                    </h3>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ödeme Yöntemi
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Havale/EFT">Havale/EFT</option>
                        <option value="Kredi Kartı">Kredi Kartı</option>
                        <option value="Nakit">Nakit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={processPayment}
                >
                  Ödemeyi Kaydet
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPaymentModal(false)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 