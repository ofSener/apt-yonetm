'use client';

import { useState } from 'react';

export default function CreateSuperAdminPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const createSuperAdmin = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('/api/create-super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }
      
      setUser(data.user);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Super Admin Oluştur</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-6 text-gray-600">
          Bu sayfa bir SuperAdmin kullanıcısı oluşturmanıza olanak tanır. SuperAdmin, 
          uygulamanın tüm bölümlerine tam erişime sahip olacaktır.
        </p>
        
        <button
          onClick={createSuperAdmin}
          disabled={status === 'loading' || status === 'success'}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status === 'loading' ? 'Oluşturuluyor...' : 'SuperAdmin Oluştur'}
        </button>
        
        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-green-800 font-medium">SuperAdmin başarıyla oluşturuldu!</h3>
            <p className="mt-2 text-sm">Aşağıdaki bilgilerle giriş yapabilirsiniz:</p>
            <ul className="mt-2 text-sm space-y-1">
              <li><strong>E-posta:</strong> {user.email}</li>
              <li><strong>Şifre:</strong> SuperAdmin123!</li>
            </ul>
            <p className="mt-3 text-xs text-gray-600">
              Bu bilgileri güvenli bir yerde saklayın.
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium">Hata!</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 