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
  LuMail,
  LuPhone,
  LuBuilding
} from "react-icons/lu";

// Örnek sakin verileri
const mockResidents = [
  {
    id: "1",
    unitNumber: "5",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 555 123 4567",
    isOwner: true,
    moveInDate: "2022-01-15",
    vehiclePlate: "34 ABC 123",
    hasAdminAccess: false,
    isActive: true,
  },
  {
    id: "2",
    unitNumber: "12",
    name: "Ayşe Demir",
    email: "ayse@example.com",
    phone: "+90 555 765 4321",
    isOwner: true,
    moveInDate: "2020-05-20",
    vehiclePlate: "34 XYZ 789",
    hasAdminAccess: false,
    isActive: true,
  },
  {
    id: "3",
    unitNumber: "8",
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    phone: "+90 555 987 6543",
    isOwner: false,
    moveInDate: "2023-02-10",
    vehiclePlate: "34 DEF 456",
    hasAdminAccess: false,
    isActive: true,
  },
  {
    id: "4",
    unitNumber: "3",
    name: "Zeynep Şahin",
    email: "zeynep@example.com",
    phone: "+90 555 456 7890",
    isOwner: true,
    moveInDate: "2021-08-05",
    vehiclePlate: "",
    hasAdminAccess: false,
    isActive: true,
  },
  {
    id: "5",
    unitNumber: "1",
    name: "Mustafa Öztürk",
    email: "mustafa@example.com",
    phone: "+90 555 234 5678",
    isOwner: true,
    moveInDate: "2020-03-12",
    vehiclePlate: "34 MNO 567",
    hasAdminAccess: true,
    isActive: true,
  }
];

export default function ResidentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, owner, tenant
  const [selectedResident, setSelectedResident] = useState<string | null>(null);

  // Silme işlemi için onay modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<string | null>(null);

  // Filtreleme
  const filteredResidents = mockResidents
    .filter(resident => {
      // Arama filtresi
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          resident.name.toLowerCase().includes(searchLower) ||
          resident.email.toLowerCase().includes(searchLower) ||
          resident.unitNumber.toLowerCase().includes(searchLower) ||
          (resident.vehiclePlate && resident.vehiclePlate.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(resident => {
      // Durum filtresi
      if (statusFilter === "all") return true;
      if (statusFilter === "owner") return resident.isOwner;
      if (statusFilter === "tenant") return !resident.isOwner;
      return true;
    })
    .sort((a, b) => parseInt(a.unitNumber) - parseInt(b.unitNumber));

  const confirmDelete = (id: string) => {
    setResidentToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteResident = () => {
    if (residentToDelete) {
      // Silme işlemi burada gerçekleştirilir
      console.log(`Sakin silindi: ${residentToDelete}`);
      setShowDeleteModal(false);
      setResidentToDelete(null);
    }
  };

  // Toplu e-posta gönderme
  const sendEmail = () => {
    alert(`${filteredResidents.length} kişiye e-posta gönderilecek`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daire Sakinleri</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/residents/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <LuPlus className="mr-2" /> Yeni Sakin
          </Link>
          <button
            onClick={sendEmail}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <LuMail className="mr-2" /> Toplu E-posta
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
              placeholder="İsim, e-posta, daire no veya plaka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Sakinler</option>
              <option value="owner">Mal Sahipleri</option>
              <option value="tenant">Kiracılar</option>
            </select>
          </div>
          
          <div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              <LuFilter className="mr-2" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Sakinler Tablosu */}
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
                  İletişim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statü
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Araç Plakası
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResidents.length > 0 ? (
                filteredResidents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <LuBuilding className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{resident.unitNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {resident.name}
                      </div>
                      {resident.hasAdminAccess && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          Yönetici
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <LuMail className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`mailto:${resident.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {resident.email}
                          </a>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <LuPhone className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`tel:${resident.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {resident.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${
                          resident.isOwner
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {resident.isOwner ? "Mal Sahibi" : "Kiracı"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {resident.vehiclePlate || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/residents/${resident.id}`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Detayları Görüntüle"
                        >
                          <LuSearch className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/residents/edit/${resident.id}`)}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Düzenle"
                        >
                          <LuPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(resident.id)}
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
                    Sakin bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{filteredResidents.length}</span> sakin gösteriliyor
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
                      Sakini Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bu sakini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={deleteResident}
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