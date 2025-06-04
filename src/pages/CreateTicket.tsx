import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QRScannerArea from '../components/QRScannerArea';
import CreateTicketForm from '../components/CreateTicketForm';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center p-8 animated-gradient">
      {/* Floating back button */}
      <Button 
        variant="outline"
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 right-4 glass-button"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Main Content */}
      <div className="w-full max-w-md space-y-6">
        {/* QR Scanner Area */}
        <div className="glass-card p-6">
          <QRScannerArea />
        </div>

        {/* Form Card */}
        <div className="glass-card">
          <CreateTicketForm />
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;