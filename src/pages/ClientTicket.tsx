
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Car, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTicket } from '../hooks/useTicket';
import { updateTicketStatus } from '../services/firestore';
import { useToast } from '@/hooks/use-toast';
import VoiceChatModule from '../components/voice/VoiceChatModule';

const ClientTicket: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { ticket, isLoading, error, reloadTicket } = useTicket(ticketId || '');
  const { toast } = useToast();

  console.log('ClientTicket - ticketId:', ticketId);
  console.log('ClientTicket - ticket:', ticket);
  console.log('ClientTicket - isLoading:', isLoading);
  console.log('ClientTicket - error:', error);

  const handleRequestCar = async () => {
    if (!ticket) return;

    try {
      await updateTicketStatus(ticket.id, 'requested');
      await reloadTicket();
      
      toast({
        title: "طلب مقبول",
        description: "تم طلب سيارتك بنجاح. سيتم إحضارها قريباً",
      });
    } catch (error) {
      console.error('Error requesting car:', error);
      toast({
        title: "خطأ",
        description: "فشل في طلب السيارة. حاول مرة أخرى",
        variant: "destructive"
      });
    }
  };

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'مركونة';
      case 'requested':
        return 'تم الطلب';
      case 'assigned':
        return 'جاري الإحضار';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'مركونة';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'requested':
        return 'text-yellow-400';
      case 'assigned':
        return 'text-blue-400';
      case 'completed':
        return 'text-gray-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  const canRequestCar = ticket.status === 'running';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white" dir="rtl">
      {/* Header with iVALET branding */}
      <div className="pt-16 pb-8 text-center">
        <h1 className="text-4xl font-light tracking-[0.5em] text-white">
          iVALET
        </h1>
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center justify-center px-6 space-y-6">
        {/* Main ticket card */}
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
              <span className={`font-bold ${getStatusColor(ticket.status)}`}>
                {getStatusText(ticket.status)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Button 
              onClick={handleRequestCar}
              disabled={!canRequestCar}
              className={`w-full py-4 text-lg rounded-xl border border-white/20 ${
                canRequestCar 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-500 cursor-not-allowed text-gray-300'
              }`}
            >
              <Car className="h-5 w-5 ml-2" />
              {canRequestCar ? 'اطلب سيارتك' : 'تم الطلب بالفعل'}
            </Button>
          </div>
        </div>

        {/* Voice Chat Module */}
        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-white ml-2" />
              <h3 className="text-lg font-semibold text-white">رسائل صوتية</h3>
            </div>
            <VoiceChatModule
              ticketId={ticket.id}
              ticketNumber={ticket.ticket_number}
              userRole="client"
            />
          </div>
        </div>

        {/* Back button */}
        <Button 
          onClick={() => navigate('/create-ticket')}
          variant="outline"
          className="mt-6 bg-white/20 text-white border-white/30 hover:bg-white/30"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default ClientTicket;
