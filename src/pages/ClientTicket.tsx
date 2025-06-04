
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTicket } from '../hooks/useTicket';

const ClientTicket: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { ticket, isLoading, error } = useTicket(ticketId || '');

  if (isLoading || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Error loading ticket</div>
      </div>
    );
  }

  // Generate QR code URL (using a QR code service)
  const qrCodeData = `Ticket: ${ticket.ticket_number}\nPlate: ${ticket.plate_number}\nVehicle: ${ticket.car_model}\nTime: ${ticket.created_at.toDate().toLocaleString()}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}`;

  const formatArabicDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header with back button */}
      <div className="flex items-center p-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/entry')}
          className="text-white hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        {/* QR Code Card */}
        <div className="bg-gray-700/50 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <img 
              src={qrCodeUrl}
              alt="Ticket QR Code"
              className="w-full h-auto"
            />
          </div>

          {/* Ticket Information in Arabic style */}
          <div className="text-center space-y-3 text-white">
            <div className="text-lg">
              <span className="text-gray-300">رقم التذكرة: </span>
              <span className="font-bold">{String(ticket.ticket_number).padStart(4, '0')}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-gray-300">رقم اللوحة: </span>
              <span className="font-bold">{ticket.plate_number}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-gray-300">موديل السيارة: </span>
              <span className="font-bold">{ticket.car_model}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-gray-300">وقت الدخول: </span>
              <span className="font-bold">{formatArabicDate(ticket.created_at.toDate())}</span>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/entry')}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg rounded-xl"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTicket;
