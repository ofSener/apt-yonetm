'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BankTransferForm from '@/components/payment/BankTransferForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBankTransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dueId = searchParams.get('dueId');
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/payments/bank-transfers" 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Havale Geçmişine Dön</span>
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yeni Havale Bildirimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Lütfen yaptığınız banka havalesi ile ilgili bilgileri aşağıdaki forma girin.
        </p>
      </div>
      
      <BankTransferForm dueId={dueId || undefined} />
    </div>
  );
} 