
import React from 'react';
import { QrCode } from 'lucide-react';

const QRScannerArea: React.FC = () => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
          <QrCode className="h-16 w-16 text-gray-600" />
          <p className="text-gray-600 text-center text-sm">
            Scan QR code or enter details below
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScannerArea;
