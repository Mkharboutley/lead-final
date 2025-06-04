import React from 'react';
import QRScannerArea from '../components/QRScannerArea';
import CreateTicketForm from '../components/CreateTicketForm';

const CreateTicket: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 animated-gradient">
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