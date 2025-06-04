import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTicket, getLatestTicketNumber } from '../services/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import QRCode from 'qrcode';

const CreateTicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    plateNumber: '',
    carModel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateQRCode = async (data: any) => {
    try {
      // Create QR code data object
      const qrData = {
        ticketNumber: data.ticket_number,
        plateNumber: data.plate_number,
        carModel: data.car_model,
        entryTime: new Date().toISOString(),
        url: data.url
      };

      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء رمز QR",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const latestTicketNumber = await getLatestTicketNumber();
      const newTicketNumber = latestTicketNumber + 1;

      const newTicketData = {
        ticket_number: newTicketNumber,
        visitor_id: generateUniqueId(),
        plate_number: formData.plateNumber,
        car_model: formData.carModel,
        vehicle_info: `${formData.carModel} - ${formData.plateNumber}`,
        status: 'running' as const,
        requested_at: null,
        assigned_at: null,
        assigned_worker: null,
        cancelled_at: null,
        completed_at: null,
        eta_minutes: null,
        ticket_url: '',
        pre_alert_sent: false,
        client_token: generateUniqueId(),
        location: '',
        description: '',
        priority: 'medium',
        voice_message_count: 0
      };

      const ticketId = await createTicket(newTicketData);
      
      const firestore = getFirestoreInstance();
      const ticketRef = doc(firestore, 'tickets', ticketId);
      const correctTicketUrl = `${window.location.origin}/ticket/${ticketId}`;
      
      await updateDoc(ticketRef, {
        ticket_url: correctTicketUrl
      });

      const fullTicketData = {
        ...newTicketData,
        id: ticketId,
        url: correctTicketUrl
      };

      setTicketData(fullTicketData);
      await generateQRCode(fullTicketData);

      toast({
        title: "تم إنشاء البطاقة بنجاح",
        description: `تم إنشاء البطاقة رقم ${newTicketNumber}`
      });

      setShowQR(true);
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('فشل في إنشاء البطاقة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowQR(false);
    setTicketData(null);
    setQrCodeUrl('');
    setFormData({ plateNumber: '', carModel: '' });
    navigate('/entry');
  };

  if (showQR && ticketData && qrCodeUrl) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative mx-auto w-64 h-64 bg-white rounded-2xl p-4 shadow-xl">
            <img 
              src={qrCodeUrl} 
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-2 text-white/80 text-right">
            <p>رقم التذكرة: {ticketData.ticket_number}</p>
            <p>رقم اللوحة: {ticketData.plate_number}</p>
            <p>موديل السيارة: {ticketData.car_model}</p>
            <p>وقت الدخول: {new Date().toLocaleString('ar')}</p>
          </div>

          <Button
            onClick={handleClose}
            variant="gradient"
            size="lg"
            className="w-full mt-6"
          >
            إغلاق
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <Car className="h-5 w-5" />
          أدخل معلومات السيارة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="plateNumber">رقم اللوحة</Label>
            <Input
              id="plateNumber"
              placeholder="ABC 1234"
              value={formData.plateNumber}
              onChange={(e) => handleInputChange('plateNumber', e.target.value)}
              className="text-center text-lg font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carModel">موديل السيارة</Label>
            <Input
              id="carModel"
              placeholder="Toyota Camry"
              value={formData.carModel}
              onChange={(e) => handleInputChange('carModel', e.target.value)}
              className="text-center text-lg font-medium"
              required
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء البطاقة'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTicketForm;