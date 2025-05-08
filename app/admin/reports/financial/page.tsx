"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LuDownload, 
  LuFilter, 
  LuCalendar,
  LuCircle,
  LuActivity,
  LuTrendingUp,
  LuPrinter,
  LuCreditCard,
  LuClipboard,
  LuChevronDown
} from "react-icons/lu";

// Gelirlerin ay bazında dağılımını temsil eden mock veri
const monthlyIncomeData = [
  { month: "Ocak", amount: 13240 },
  { month: "Şubat", amount: 13240 },
  { month: "Mart", amount: 13240 },
  { month: "Nisan", amount: 13240 },
  { month: "Mayıs", amount: 13240 },
  { month: "Haziran", amount: 14040 },
  { month: "Temmuz", amount: 14040 },
  { month: "Ağustos", amount: 14040 },
  { month: "Eylül", amount: 14040 },
  { month: "Ekim", amount: 14040 },
  { month: "Kasım", amount: 14040 },
  { month: "Aralık", amount: 14040 }
];

// Giderlerin kategorilere göre dağılımını temsil eden mock veri
const expensesByCategory = [
  { category: "Temizlik", amount: 36000 },
  { category: "Elektrik", amount: 24000 },
  { category: "Su", amount: 18000 },
  { category: "Asansör Bakımı", amount: 12000 },
  { category: "Güvenlik", amount: 30000 },
  { category: "Tamirat", amount: 15000 },
  { category: "Diğer", amount: 8000 }
];

// Aylık gider dağılımını temsil eden mock veri
const monthlyExpensesData = [
  { month: "Ocak", amount: 10500 },
  { month: "Şubat", amount: 11200 },
  { month: "Mart", amount: 9800 },
  { month: "Nisan", amount: 10300 },
  { month: "Mayıs", amount: 12100 },
  { month: "Haziran", amount: 11500 },
  { month: "Temmuz", amount: 10900 },
  { month: "Ağustos", amount: 11700 },
  { month: "Eylül", amount: 10600 },
  { month: "Ekim", amount: 11800 },
  { month: "Kasım", amount: 12300 },
  { month: "Aralık", amount: 11400 }
];

// Ödeme durumu dağılımını temsil eden mock veri
const paymentStatusData = {
  paid: 85, // yüzde
  pending: 10, // yüzde
  overdue: 5 // yüzde
};

export default function FinancialReportsPage() {
  const [year, setYear] = useState<string>("2023");
  const [reportType, setReportType] = useState<string>("all"); // all, income, expenses, balances

  // Toplam gelir (aidat)
  const totalIncome = monthlyIncomeData.reduce((sum, item) => sum + item.amount, 0);
  
  // Toplam gider
  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
  
  // Bakiye
  const balance = totalIncome - totalExpenses;
  
  // Raporu yazdırma
  const printReport = () => {
    window.print();
  };
  
  // Raporu indirme (Excel/PDF)
  const downloadReport = (format: string) => {
    alert(`Rapor ${format} formatında indiriliyor...`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finansal Raporlar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Apartman gelir ve giderlerinin detaylı analizi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={printReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <LuPrinter className="mr-2" /> Yazdır
          </button>
          <div className="relative inline-block">
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <LuDownload className="mr-2" /> İndir <LuChevronDown className="ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => downloadReport('excel')}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  role="menuitem"
                >
                  Excel (.xlsx)
                </button>
                <button
                  onClick={() => downloadReport('pdf')}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  role="menuitem"
                >
                  PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="all">Tüm Raporlar</option>
              <option value="income">Gelir Raporları</option>
              <option value="expenses">Gider Raporları</option>
              <option value="balances">Bakiye Raporları</option>
            </select>
          </div>
          
          <div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setYear("2023");
                setReportType("all");
              }}
            >
              <LuFilter className="mr-2" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Özet Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalIncome.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <LuTrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Gider</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalExpenses.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <LuClipboard className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bakiye</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {balance.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <LuCreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler ve Tablolar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Aylık Gelir Grafiği */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aylık Gelir Dağılımı</h3>
            <LuActivity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-64 flex items-end space-x-2">
            {monthlyIncomeData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                  style={{ 
                    height: `${(data.amount / Math.max(...monthlyIncomeData.map(d => d.amount))) * 200}px` 
                  }}
                ></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month.substring(0, 3)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kategori Bazında Giderler */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori Bazında Giderler</h3>
            <LuCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Yüzde
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {expensesByCategory.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {category.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {Math.round((category.amount / totalExpenses) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="row" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Toplam
                  </th>
                  <td className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-white">
                    {totalExpenses.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-white">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Aylık Gelir/Gider Karşılaştırması */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aylık Gelir/Gider Karşılaştırması</h3>
            <LuActivity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ay
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gelir
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gider
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fark
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {monthlyIncomeData.map((income, index) => {
                  const expense = monthlyExpensesData[index];
                  const difference = income.amount - expense.amount;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {income.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                        {income.amount.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                        {expense.amount.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {difference.toLocaleString('tr-TR')} ₺
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="row" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Yıllık Toplam
                  </th>
                  <td className="px-6 py-3 text-right text-xs font-medium text-green-600 dark:text-green-400">
                    {totalIncome.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-3 text-right text-xs font-medium text-red-600 dark:text-red-400">
                    {totalExpenses.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className={`px-6 py-3 text-right text-xs font-medium ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {balance.toLocaleString('tr-TR')} ₺
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 