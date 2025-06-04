
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QRScannerArea from '../components/QRScannerArea';
import CreateTicketForm from '../components/CreateTicketForm';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Ticket</h1>
              <p className="text-gray-300 mt-1">Scan QR code or manually enter vehicle details</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* QR Scanner Area */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <QRScannerArea />
          </div>

          {/* Form Card */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <CreateTicketForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
