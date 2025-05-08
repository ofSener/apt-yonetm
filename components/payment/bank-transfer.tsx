// components/payment/bank-transfer.tsx
export function BankTransferDetails() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
      <h3 className="font-medium mb-2">Havale Bilgileri</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Banka:</span>
          <span className="font-medium">Example Bank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">IBAN:</span>
          <span className="font-medium">TR00 0000 0000 0000 0000 0000 00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Alıcı:</span>
          <span className="font-medium">Apartman Yönetimi</span>
        </div>
      </div>
      <div className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-500">
        Açıklama kısmına "Daire No + İsim" yazınız. Havale dekontunu sisteme yüklemeniz gerekmektedir.
      </div>
    </div>
  );
}