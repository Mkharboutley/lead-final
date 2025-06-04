
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, AlertCircle, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTicket, getLatestTicketNumber } from '../services/firestore';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get the next ticket number
      const latestTicketNumber = await getLatestTicketNumber();
      const newTicketNumber = latestTicketNumber + 1;

      // Create ticket data with minimal required fields
      const ticketData = {
        ticket_number: newTicketNumber,
        visitor_id: generateUniqueId(),
        plate_number: formData.plateNumber,
        car_model: formData.carModel,
        vehicle_info: `${formData.carModel} - ${formData.plateNumber}`,
        guest_name: 'Guest', // Default value
        status: 'running' as const,
        requested_at: null,
        assigned_at: null,
        assigned_worker: null,
        cancelled_at: null,
        completed_at: null,
        eta_minutes: null,
        ticket_url: `${window.location.origin}/ticket/${generateUniqueId()}`,
        pre_alert_sent: false,
        client_token: generateUniqueId(),
        location: '',
        clientName: 'Guest',
        clientPhoneNumber: '',
        description: '',
        priority: 'medium',
        voice_message_count: 0
      };

      const ticketId = await createTicket(ticketData);

      toast({
        title: "Ticket Created Successfully",
        description: `Ticket #${newTicketNumber} has been created`
      });

      navigate(`/ticket/${ticketId}`);
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* QR Scanner Area */}
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

        {/* Form Card */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Car className="h-5 w-5" />
              New Valet Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Plate Number */}
              <div className="space-y-2">
                <Label htmlFor="plateNumber">License Plate *</Label>
                <Input
                  id="plateNumber"
                  placeholder="ABC 1234"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                  className="text-center text-lg font-medium"
                  required
                />
              </div>

              {/* Car Model */}
              <div className="space-y-2">
                <Label htmlFor="carModel">Vehicle Model *</Label>
                <Input
                  id="carModel"
                  placeholder="Toyota Camry"
                  value={formData.carModel}
                  onChange={(e) => handleInputChange('carModel', e.target.value)}
                  className="text-center text-lg font-medium"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 text-lg rounded-xl"
                >
                  {isLoading ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

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
