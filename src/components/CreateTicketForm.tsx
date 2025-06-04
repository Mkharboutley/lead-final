
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTicket, getLatestTicketNumber } from '../services/firestore';

const CreateTicketForm: React.FC = () => {
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

      // Create ticket data with minimal required fields - removed clientName, clientPhoneNumber, and guest_name
      const ticketData = {
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
        ticket_url: `${window.location.origin}/ticket/${generateUniqueId()}`,
        pre_alert_sent: false,
        client_token: generateUniqueId(),
        location: '',
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
  );
};

export default CreateTicketForm;
