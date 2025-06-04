import React from 'react';
import QRScannerArea from '../components/QRScannerArea';
import CreateTicketForm from '../components/CreateTicketForm';

const CreateTicket: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative flex flex-col items-center justify-center p-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* QR Scanner Area */}
        <div className="glass-card p-8">
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