"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LuPlus, 
  LuPencil, 
  LuTrash, 
  LuSearch,
  LuFolder,
  LuFileText,
  LuDownload,
  LuEye,
  LuUsers,
  LuLock,
  LuCalendar
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

// Örnek dokümanlar
const mockDocuments = [
  {
    id: "1",
    title: "2023 Yılı Yönetim Planı",
    description: "Apartman yönetim planı, haklar ve sorumluluklar.",
    category: "Yönetim Planı",
    fileType: "pdf", // pdf, docx, xlsx, jpg, png, etc.
    fileSize: "2.4 MB",
    uploadDate: "2023-01-15",
    uploadedBy: "Ahmet Yılmaz",
    visibility: "all", // all, admin
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
    uploadedBy: "Ahmet Yılmaz",
    visibility: "all",
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
    uploadedBy: "Ahmet Yılmaz",
    visibility: "all",
    viewCount: 56,
    downloadCount: 42
  },
  {
    id: "4",
    title: "Asansör Bakım Sözleşmesi",
    description: "Asansör bakım hizmeti için yapılan sözleşme.",
    category: "Diğer",
    fileType: "pdf",
    fileSize: "3.1 MB",
    uploadDate: "2023-03-05",
    uploadedBy: "Ahmet Yılmaz",
    visibility: "admin",
    viewCount: 12,
    downloadCount: 8
  },
  {
    id: "5",
    title: "Bina Sigortası Poliçesi",
    description: "Apartman binası için yaptırılan sigorta poliçesi.",
    category: "Diğer",
    fileType: "pdf",
    fileSize: "5.7 MB",
    uploadDate: "2023-04-22",
    uploadedBy: "Ahmet Yılmaz",
    visibility: "admin",
    viewCount: 9,
    downloadCount: 7
  }
];

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  
  // Silme işlemi için onay modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

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
    .filter(document => {
      // Görünürlük filtresi
      if (visibilityFilter === "all") return true;
      return document.visibility === visibilityFilter;
    })
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  // Dosya türüne göre ikon ve renk
  const getFileTypeInfo = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return { icon: LuFileText, color: 'text-red-500 dark:text-red-400' };
      case 'docx':
      case 'doc':
        return { icon: LuFileText, color: 'text-blue-500 dark:text-blue-400' };
      case 'xlsx':
      case 'xls':
        return { icon: LuFileText, color: 'text-green-500 dark:text-green-400' };
      case 'jpg':
      case 'jpeg':
      case 'png':
        return { icon: LuFileText, color: 'text-purple-500 dark:text-purple-400' };
      default:
        return { icon: LuFileText, color: 'text-gray-500 dark:text-gray-400' };
    }
  };

  // Görünürlük bilgisi
  const getVisibilityInfo = (visibility: string) => {
    if (visibility === 'all') {
      return {
        icon: LuUsers,
        text: 'Tüm Sakinler',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30'
      };
    } else {
      return {
        icon: LuLock,
        text: 'Sadece Yönetim',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30'
      };
    }
  };

  // Doküman silme onayı
  const confirmDelete = (id: string) => {
    setDocumentToDelete(id);
    setShowDeleteModal(true);
  };

  // Doküman silme işlemi
  const deleteDocument = () => {
    if (documentToDelete) {
      // Silme işlemi burada gerçekleştirilir
      console.log(`Doküman silindi: ${documentToDelete}`);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doküman Yönetimi</h1>
        <Link
          href="/admin/documents/upload"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-fit"
        >
          <LuPlus className="mr-2" /> Yeni Doküman Yükle
        </Link>
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
              placeholder="Doküman ara..."
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
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
            >
              <option value="all">Tüm Görünürlükler</option>
              <option value="all">Tüm Sakinlere Görünür</option>
              <option value="admin">Sadece Yönetime Görünür</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doküman Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Doküman
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yüklenme Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Görünürlük
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İstatistik
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
                  const FileIcon = fileTypeInfo.icon;
                  const visibilityInfo = getVisibilityInfo(document.visibility);
                  const VisibilityIcon = visibilityInfo.icon;
                  
                  return (
                    <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 mr-3 ${fileTypeInfo.color}`}>
                            <FileIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {document.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {document.description}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {document.fileType.toUpperCase()} • {document.fileSize}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <LuFolder className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{document.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <LuCalendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(document.uploadDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {document.uploadedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${visibilityInfo.bgColor} ${visibilityInfo.color}`}>
                          <VisibilityIcon className="w-3 h-3 mr-1" /> {visibilityInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <LuEye className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{document.viewCount} görüntüleme</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <LuDownload className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{document.downloadCount} indirme</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/documents/${document.id}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Görüntüle"
                          >
                            <LuEye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/documents/edit/${document.id}`}
                            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Düzenle"
                          >
                            <LuPencil className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(document.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Sil"
                          >
                            <LuTrash className="w-5 h-5" />
                          </button>
                          <Link
                            href={`#`} // Gerçek bir uygulamada dokümanın URL'si olacak
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
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Doküman bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                      Dokümanı Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bu dokümanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={deleteDocument}
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
    </div>
  );
} 