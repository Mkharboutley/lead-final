
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTicket } from '../hooks/useTicket';

const ClientTicket: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { ticket, isLoading, error } = useTicket(ticketId || '');

  console.log('ClientTicket - ticketId:', ticketId);
  console.log('ClientTicket - ticket:', ticket);
  console.log('ClientTicket - isLoading:', isLoading);
  console.log('ClientTicket - error:', error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div>جاري تحميل بيانات البطاقة...</div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-red-200 mb-4">خطأ في تحميل البطاقة</div>
          <Button 
            onClick={() => navigate('/create-ticket')}
            className="mt-4 bg-white text-blue-600 hover:bg-gray-100"
          >
            العودة
          </Button>
        </div>
      </div>
    );
  }

  const formatArabicDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white" dir="rtl">
      {/* Header with iVALET branding */}
      <div className="pt-16 pb-8 text-center">
        <h1 className="text-4xl font-light tracking-[0.5em] text-white">
          iVALET
        </h1>
      </div>

      {/* Main content card */}
      <div className="flex flex-col items-center justify-center px-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm border border-white/20">
          
          {/* Clock icon and header */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4 ml-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">معلومات</h2>
              <h2 className="text-xl font-semibold text-white">البطاقة</h2>
            </div>
          </div>

          <div className="border-t border-white/30 my-6"></div>

          {/* Ticket Information */}
          <div className="space-y-4 text-center text-white">
            <div className="text-lg">
              <span className="text-white/80">رقم البطاقة : </span>
              <span className="font-bold">{String(ticket.ticket_number).padStart(2, '0')}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-white/80">رقم اللوحة : </span>
              <span className="font-bold">{ticket.plate_number}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-white/80">موديل السيارة : </span>
              <span className="font-bold">{ticket.car_model}</span>
            </div>
            
            <div className="text-lg">
              <span className="text-white/80">وقت الدخول : </span>
              <span className="font-bold">{formatArabicDate(ticket.created_at.toDate())}</span>
            </div>

            <div className="text-lg">
              <span className="text-white/80">الحالة : </span>
              <span className="font-bold">مركونة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-xl border border-white/20"
            >
              اطلب سيارتك
            </Button>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg rounded-xl border border-white/20"
            >
              Record Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTicket;
