'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  LuCalendar, 
  LuBanknote, 
  LuClipboard, 
  LuPiggyBank,
  LuUpload,
  LuCheck,
  LuAlertCircle
} from 'react-icons/lu';

// API çağrısı için gerekli tip tanımları
interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
  branch?: string;
}

interface Due {
  id: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  description: string;
  unitId: string;
}

// Form değerleri için tip tanımı
interface FormValues {
  bankAccountId: string;
  amount: number;
  transferDate: string;
  dueId?: string;
  senderName: string;
  description: string;
  receiptFile?: File | null;
}

// Validasyon şeması
const validationSchema = Yup.object({
  bankAccountId: Yup.string().required('Banka hesabı seçimi zorunludur'),
  amount: Yup.number().positive('Tutar pozitif olmalıdır').required('Tutar zorunludur'),
  transferDate: Yup.date().required('Tarih zorunludur').max(new Date(), 'Gelecek bir tarih seçemezsiniz'),
  senderName: Yup.string().required('Gönderen adı zorunludur'),
  receiptFile: Yup.mixed().nullable(),
});

export default function BankTransferForm({ dueId }: { dueId?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  
  // Banka hesaplarını ve ödenmemiş aidatları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Banka hesaplarını getir
        const bankAccountsRes = await fetch('/api/payments/bank-accounts');
        if (!bankAccountsRes.ok) throw new Error('Banka hesapları alınamadı');
        const bankAccountsData = await bankAccountsRes.json();
        
        // Ödenmemiş aidatları getir - eğer belirli bir aidat ID'si yoksa
        if (!dueId) {
          const duesRes = await fetch('/api/payments/dues?status=unpaid');
          if (!duesRes.ok) throw new Error('Aidat bilgileri alınamadı');
          const duesData = await duesRes.json();
          setDues(duesData.dues || []);
        }
        
        setBankAccounts(bankAccountsData.bankAccounts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dueId]);
  
  // Form gönderim işlemi
  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    try {
      setError('');
      setSuccess(false);
      
      const formData = new FormData();
      formData.append('bankAccountId', values.bankAccountId);
      formData.append('amount', values.amount.toString());
      formData.append('transferDate', new Date(values.transferDate).toISOString());
      if (dueId || values.dueId) formData.append('dueId', dueId || values.dueId || '');
      formData.append('senderName', values.senderName);
      formData.append('description', values.description || '');
      if (values.receiptFile) formData.append('receiptFile', values.receiptFile);
      
      const res = await fetch('/api/payments/bank-transfer', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Havale bildirimi yapılırken bir hata oluştu');
      }
      
      const data = await res.json();
      
      setSuccess(true);
      resetForm();
      
      // 3 saniye sonra kullanıcıyı havale geçmişine yönlendir
      setTimeout(() => {
        router.push('/dashboard/payments/bank-transfers');
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Seçilen banka hesabını güncelle
  const handleBankAccountChange = (bankAccountId: string) => {
    const selected = bankAccounts.find(account => account.id === bankAccountId) || null;
    setSelectedBankAccount(selected);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const initialValues: FormValues = {
    bankAccountId: '',
    amount: dueId && dues.length > 0 ? dues[0].amount : 0,
    transferDate: new Date().toISOString().split('T')[0],
    dueId: dueId || '',
    senderName: session?.user?.name || '',
    description: '',
    receiptFile: null,
  };
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Havale Bildirimi
      </h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md flex items-center">
          <LuCheck className="h-5 w-5 mr-2" />
          <span>Havale bildiriminiz başarıyla oluşturuldu. Yönetici tarafından incelendikten sonra onaylanacaktır.</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-center">
          <LuAlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* Banka Hesabı Seçimi */}
            <div>
              <label htmlFor="bankAccountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Havale Yapılacak Banka Hesabı*
              </label>
              <div className="relative">
                <Field
                  as="select"
                  id="bankAccountId"
                  name="bankAccountId"
                  className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('bankAccountId', e.target.value);
                    handleBankAccountChange(e.target.value);
                  }}
                >
                  <option value="">Banka hesabı seçin</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountName} - {account.iban}
                    </option>
                  ))}
                </Field>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuPiggyBank className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ErrorMessage name="bankAccountId" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>
            
            {/* Seçilen banka hesap bilgileri */}
            {selectedBankAccount && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Havale Bilgileri</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><span className="font-medium">Banka:</span> {selectedBankAccount.bankName}</p>
                  <p><span className="font-medium">Hesap Sahibi:</span> {selectedBankAccount.accountName}</p>
                  <p><span className="font-medium">IBAN:</span> {selectedBankAccount.iban}</p>
                  {selectedBankAccount.branch && (
                    <p><span className="font-medium">Şube:</span> {selectedBankAccount.branch}</p>
                  )}
                  <p className="text-xs mt-2 text-red-600 dark:text-red-400">
                    Havale açıklamasına <strong>"{session?.user?.name} - {session?.user?.id?.substring(0, 8)}"</strong> yazmanız, ödemenizin daha hızlı eşleştirilmesini sağlayacaktır.
                  </p>
                </div>
              </div>
            )}
            
            {/* Aidat Seçimi - eğer spesifik bir aidat ID'si yoksa */}
            {!dueId && dues.length > 0 && (
              <div>
                <label htmlFor="dueId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ödenecek Aidat
                </label>
                <Field
                  as="select"
                  id="dueId"
                  name="dueId"
                  className="block w-full pl-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedDueId = e.target.value;
                    setFieldValue('dueId', selectedDueId);
                    
                    if (selectedDueId) {
                      const selectedDue = dues.find(due => due.id === selectedDueId);
                      if (selectedDue) {
                        setFieldValue('amount', selectedDue.amount);
                      }
                    }
                  }}
                >
                  <option value="">Aidat seçin (opsiyonel)</option>
                  {dues.map(due => (
                    <option key={due.id} value={due.id}>
                      {due.description} - {due.amount}₺ (Son Ödeme: {new Date(due.dueDate).toLocaleDateString('tr-TR')})
                    </option>
                  ))}
                </Field>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Aidat seçerseniz, ödemeniz otomatik olarak bu aidata sayılacaktır.
                </p>
              </div>
            )}
            
            {/* Tutar */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Havale Tutarı (₺)*
              </label>
              <div className="relative">
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  min="0"
                  className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuBanknote className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>
            
            {/* Havale Tarihi */}
            <div>
              <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Havale Tarihi*
              </label>
              <div className="relative">
                <Field
                  type="date"
                  id="transferDate"
                  name="transferDate"
                  max={new Date().toISOString().split('T')[0]}
                  className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuCalendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ErrorMessage name="transferDate" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>
            
            {/* Gönderen Adı */}
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gönderen Adı*
              </label>
              <Field
                type="text"
                id="senderName"
                name="senderName"
                className="block w-full pl-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="Havaleyi yapan kişi"
              />
              <ErrorMessage name="senderName" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
            </div>
            
            {/* Açıklama */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Açıklama
              </label>
              <div className="relative">
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="Havale hakkında ek bilgiler"
                />
                <div className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                  <LuClipboard className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Dekont Yükleme */}
            <div>
              <label htmlFor="receiptFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dekont (Opsiyonel)
              </label>
              <div className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <LuUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Dekont yükle</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*, application/pdf"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] || null;
                          setFieldValue('receiptFile', file);
                        }}
                      />
                    </label>
                    <p className="pl-1">veya buraya sürükle</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF (maks. 5MB)
                  </p>
                </div>
              </div>
              {values.receiptFile && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {values.receiptFile.name} yüklendi
                </p>
              )}
            </div>
            
            {/* Gönder Butonu */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Gönderiliyor</span>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </>
                ) : 'Havale Bildir'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
} 