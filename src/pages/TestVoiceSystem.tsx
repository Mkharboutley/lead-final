
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TestTube, Play } from 'lucide-react';
import VoiceTestingPanel from '../components/VoiceTestingPanel';
import { initializeFirebase } from '../services/firebase';

const TestVoiceSystem: React.FC = () => {
  const [ticketId, setTicketId] = useState('test-ticket-123');
  const [ticketNumber, setTicketNumber] = useState(123);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitialize = () => {
    try {
      initializeFirebase();
      setIsInitialized(true);
    } catch (error) {
      console.log('Firebase already initialized or error:', error);
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Initialize Voice System Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Click the button below to initialize Firebase and start testing the voice messaging system.
              </p>
              <Button onClick={handleInitialize} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Initialize Firebase & Start Testing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Voice System Testing</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive testing suite for voice messaging, real-time updates, and push notifications
          </p>
        </div>

        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ticket-id">Ticket ID</Label>
                <Input
                  id="ticket-id"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter ticket ID for testing"
                />
              </div>
              <div>
                <Label htmlFor="ticket-number">Ticket Number</Label>
                <Input
                  id="ticket-number"
                  type="number"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(parseInt(e.target.value) || 0)}
                  placeholder="Enter ticket number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Testing Panel */}
        <VoiceTestingPanel 
          ticketId={ticketId}
          ticketNumber={ticketNumber}
        />

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Voice Message Testing:</h4>
                <p className="text-gray-600">
                  1. Switch between Client and Admin roles to test both perspectives<br/>
                  2. Record voice messages and verify they appear in real-time<br/>
                  3. Check that notifications fire when messages are received
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Real-time Updates Testing:</h4>
                <p className="text-gray-600">
                  1. Update ticket status and verify updated_at field syncs<br/>
                  2. Check that status changes trigger real-time updates<br/>
                  3. Verify timestamp accuracy for all status transitions
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Push Notifications Testing:</h4>
                <p className="text-gray-600">
                  1. Enter your Pusher Beams instance ID<br/>
                  2. Grant notification permissions when prompted<br/>
                  3. Test notifications by sending messages from different roles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestVoiceSystem;
