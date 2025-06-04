
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CreditCard, X } from 'lucide-react';

const Entry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Phone mockup container */}
      <div className="relative w-full max-w-sm">
        {/* QR Code display area */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Phone frame */}
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-4 rounded-3xl shadow-2xl">
              <div className="bg-black rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                {/* QR Code placeholder */}
                <div className="bg-white p-6 rounded-lg">
                  <QrCode className="h-24 w-24 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Large QR code on the side */}
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
              <QrCode className="h-20 w-20 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/create-ticket')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 text-lg rounded-xl flex items-center justify-center gap-3"
          >
            <CreditCard className="h-6 w-6" />
            بطاقة جديدة (New Card)
          </Button>

          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-4 text-lg rounded-xl flex items-center justify-center gap-3"
          >
            <QrCode className="h-6 w-6" />
            إغلاق بطاقة (Close Card)
          </Button>
        </div>
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Scan QR code or choose an action</p>
      </div>
    </div>
  );
};

export default Entry;
