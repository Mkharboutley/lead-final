
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QRScannerArea from '../components/QRScannerArea';
import CreateTicketForm from '../components/CreateTicketForm';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* QR Scanner Area */}
        <QRScannerArea />

        {/* Form Card */}
        <CreateTicketForm />

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/entry')}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
