'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye,
  FileText,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { BankTransferStatus } from '@/app/generated/prisma';

// Type definitions
interface BankTransfer {
  id: string;
  amount: number;
  transferDate: string;
  referenceCode: string;
  senderName?: string;
  description?: string;
  receiptUrl?: string;
  status: BankTransferStatus;
  statusNote?: string;
  createdAt: string;
  verifiedAt?: string;
  bankAccount: {
    id: string;
    bankName: string;
    iban: string;
  };
  due?: {
    id: string;
    description: string;
    amount: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    unit?: {
      number: string;
    };
  };
}

export default function AdminBankTransfersPage() {
  const { data: session, status } = useSession();
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransfer | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/bank-transfers');
        
        if (!res.ok) {
          throw new Error('Failed to fetch bank transfers');
        }
        
        const data = await res.json();
        setTransfers(data.transfers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user && session.user.role === 'ADMIN') {
      fetchTransfers();
    }
  }, [session]);

  const handleApprove = async (transferId: string) => {
    await updateTransferStatus(transferId, BankTransferStatus.VERIFIED);
  };

  const handleReject = (transfer: BankTransfer) => {
    setSelectedTransfer(transfer);
    setStatusNote('');
    setShowModal(true);
  };

  const confirmReject = async () => {
    if (!selectedTransfer) return;
    
    await updateTransferStatus(
      selectedTransfer.id, 
      BankTransferStatus.REJECTED, 
      statusNote
    );
    
    setShowModal(false);
  };

  const updateTransferStatus = async (
    transferId: string, 
    status: BankTransferStatus,
    note?: string
  ) => {
    try {
      setUpdating(true);
      
      const res = await fetch('/api/admin/bank-transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transferId,
          status,
          statusNote: note,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update bank transfer status');
      }
      
      const data = await res.json();
      
      // Update local state
      setTransfers(prevTransfers => 
        prevTransfers.map(transfer => 
          transfer.id === transferId
            ? {
                ...transfer,
                status,
                statusNote: note,
                verifiedAt: new Date().toISOString(),
                verifiedBy: {
                  id: session?.user?.id || '',
                  name: session?.user?.name || '',
                },
              }
            : transfer
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  // Format date with Turkish locale
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
        <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Havale Bildirimleri Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sakinler tarafından bildirilen banka havalelerini onaylayın veya reddedin.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {transfers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            İşlem bekleyen havale bildirimi bulunmuyor
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Tüm havale bildirimleri işlenmiş durumda. Yeni bildirimler geldiğinde burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Referans
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Daire
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banka
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aidat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dekont
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{transfer.referenceCode}</div>
                      <div className="text-xs text-gray-500">{formatDate(transfer.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {transfer.user.unit ? `No: ${transfer.user.unit.number}` : '-'}
                      </div>
                      <div className="text-xs text-gray-500">{transfer.user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transfer.transferDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transfer.bankAccount.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {transfer.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transfer.due ? (
                        <div>
                          <div>{transfer.due.description}</div>
                          <div className="text-xs font-medium">{transfer.due.amount.toLocaleString('tr-TR')} ₺</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transfer.receiptUrl ? (
                        <a 
                          href={transfer.receiptUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Görüntüle</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">Dekont yok</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfer.status === BankTransferStatus.PENDING ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(transfer.id)}
                            disabled={updating}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(transfer)}
                            disabled={updating}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reddet
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm">
                          {transfer.status === BankTransferStatus.VERIFIED && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Onaylandı
                            </span>
                          )}
                          {transfer.status === BankTransferStatus.REJECTED && (
                            <span className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reddedildi
                            </span>
                          )}
                          {transfer.statusNote && (
                            <div className="text-xs text-gray-500 mt-1">
                              {transfer.statusNote}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showModal && selectedTransfer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Havale Bildirimini Reddet
              </h3>
              
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      <span>Gönderen</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedTransfer.user.name}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Tarih</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedTransfer.transferDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      <span>Referans</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedTransfer.referenceCode}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>Tutar</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedTransfer.amount.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ret Nedeni
                  </label>
                  <textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    placeholder="Havale bildiriminin reddedilme nedenini açıklayın"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </button>
                <button
                  onClick={confirmReject}
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <span className="mr-2">İşleniyor</span>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  ) : 'Reddet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 