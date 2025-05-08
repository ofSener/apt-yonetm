'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Banknote
} from 'lucide-react';
import { BankTransferStatus } from '@/app/generated/prisma';

// Type definitions
interface BankTransfer {
  id: string;
  amount: number;
  transferDate: string;
  referenceCode: string;
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
  verifiedBy?: {
    id: string;
    name: string;
  };
}

export default function BankTransfersPage() {
  const { data: session } = useSession();
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/payments/bank-transfers');
        
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

    if (session?.user) {
      fetchTransfers();
    }
  }, [session]);

  // Status badge component
  const StatusBadge = ({ status }: { status: BankTransferStatus }) => {
    switch (status) {
      case BankTransferStatus.PENDING:
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Beklemede
          </span>
        );
      case BankTransferStatus.VERIFIED:
        return (
          <span className="flex items-center text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylandı
          </span>
        );
      case BankTransferStatus.REJECTED:
        return (
          <span className="flex items-center text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 px-2 py-1 rounded text-xs font-medium">
            <XCircle className="w-3 h-3 mr-1" />
            Reddedildi
          </span>
        );
      case BankTransferStatus.COMPLETED:
        return (
          <span className="flex items-center text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Tamamlandı
          </span>
        );
      default:
        return <span>Bilinmiyor</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Havale Geçmişi
        </h1>
        <Link
          href="/dashboard/payments/new-bank-transfer"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="mr-2" />
          Yeni Havale Bildir
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {transfers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Banknote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz havale bildirimi yapılmamış</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Havale ile ödeme yapmak için bir havale bildirimi oluşturun.
          </p>
          <Link
            href="/dashboard/payments/new-bank-transfer"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="mr-2" />
            Yeni Havale Bildir
          </Link>
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
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {transfer.referenceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transfer.transferDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transfer.bankAccount.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {transfer.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transfer.due ? transfer.due.description : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={transfer.status} />
                      {transfer.statusNote && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Not: {transfer.statusNote}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 