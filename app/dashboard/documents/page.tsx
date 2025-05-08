"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LuSearch, 
  LuFilter, 
  LuFileText, 
  LuDownload, 
  LuEye,
  LuChevronRight
} from "react-icons/lu";

// Örnek doküman kategorileri
const categories = [
  "Yönetim Planı",
  "Yönetim Kararları",
  "Bütçe",
  "Toplantı Tutanakları",
  "Duyurular",
  "Diğer"
];

// Örnek dokümanlar (sadece 'all' görünürlüğünde olan dokümanlar)
const mockDocuments = [
  {
    id: "1",
    title: "2023 Yılı Yönetim Planı",
    description: "Apartman yönetim planı, haklar ve sorumluluklar.",
    category: "Yönetim Planı",
    fileType: "pdf",
    fileSize: "2.4 MB",
    uploadDate: "2023-01-15",
    uploadedBy: "Yönetim",
    viewCount: 45,
    downloadCount: 32
  },
  {
    id: "2",
    title: "2023 Mayıs Ayı Toplantı Tutanağı",
    description: "Mayıs ayı olağan yönetim toplantısı kararları.",
    category: "Toplantı Tutanakları",
    fileType: "docx",
    fileSize: "528 KB",
    uploadDate: "2023-05-20",
    uploadedBy: "Yönetim",
    viewCount: 28,
    downloadCount: 15
  },
  {
    id: "3",
    title: "2023 Bütçe Planı",
    description: "Yıllık gelir/gider planlaması ve aidat hesaplamaları.",
    category: "Bütçe",
    fileType: "xlsx",
    fileSize: "1.2 MB",
    uploadDate: "2023-02-10",
    uploadedBy: "Yönetim",
    viewCount: 56,
    downloadCount: 42
  }
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [documentView, setDocumentView] = useState<"grid" | "list">("grid");

  // Filtreleme
  const filteredDocuments = mockDocuments
    .filter(document => {
      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          document.title.toLowerCase().includes(searchLower) ||
          document.description.toLowerCase().includes(searchLower) ||
          document.category.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(document => {
      // Kategori filtresi
      if (categoryFilter === "all") return true;
      return document.category === categoryFilter;
    })
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  // Dosya türüne göre ikon ve renk
  const getFileTypeInfo = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'PDF' };
      case 'docx':
      case 'doc':
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Word' };
      case 'xlsx':
      case 'xls':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Excel' };
      case 'jpg':
      case 'jpeg':
      case 'png':
        return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Image' };
      default:
        return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400', label: fileType.toUpperCase() };
    }
  };

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apartman Belgeleri</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Yönetim tarafından paylaşılan belgelere buradan erişebilirsiniz.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setDocumentView("grid")}
            className={`p-2 rounded-md ${
              documentView === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setDocumentView("list")}
            className={`p-2 rounded-md ${
              documentView === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Belge ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
            >
              <LuFilter className="mr-2" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Doküman Listesi - Grid Görünümü */}
      {documentView === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document) => {
              const fileTypeInfo = getFileTypeInfo(document.fileType);
              
              return (
                <div key={document.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${fileTypeInfo.color} mr-4`}>
                        <LuFileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {document.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {document.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {document.category}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {fileTypeInfo.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {document.fileSize}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Yükleme: {formatDate(document.uploadDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                    <div className="flex text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-4">
                        <LuEye className="w-4 h-4 mr-1" />
                        {document.viewCount}
                      </span>
                      <span className="flex items-center">
                        <LuDownload className="w-4 h-4 mr-1" />
                        {document.downloadCount}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/documents/${document.id}`}
                        className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        title="Görüntüle"
                      >
                        <LuEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href="#" // Gerçek bir uygulamada dokümanın URL'si
                        className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                        title="İndir"
                        download
                      >
                        <LuDownload className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Belirtilen kriterlere uygun doküman bulunamadı.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Doküman Listesi - Liste Görünümü */}
      {documentView === "list" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Belge
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Boyut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Yüklenme Tarihi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => {
                    const fileTypeInfo = getFileTypeInfo(document.fileType);
                    
                    return (
                      <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 p-2 rounded-md ${fileTypeInfo.color} mr-3`}>
                              <LuFileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {document.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {document.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {document.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {document.fileSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(document.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/dashboard/documents/${document.id}`}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Görüntüle"
                            >
                              <LuEye className="w-5 h-5" />
                            </Link>
                            <Link
                              href="#" // Gerçek bir uygulamada dokümanın URL'si
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="İndir"
                              download
                            >
                              <LuDownload className="w-5 h-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Belirtilen kriterlere uygun doküman bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 