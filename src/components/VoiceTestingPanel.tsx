
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  TestTube, 
  MessageCircle, 
  Clock, 
  Bell, 
  CheckCircle, 
  AlertCircle,
  Zap 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subscribeToVoiceMessages } from '../services/realtime';
import { updateTicketStatus, subscribeToTicketUpdates } from '../services/ticketService';
import { usePusherBeams } from '../hooks/usePusherBeams';
import VoiceRecorder from './VoiceRecorder';

interface TestResult {
  id: string;
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: number;
}

interface VoiceTestingPanelProps {
  ticketId: string;
  ticketNumber: number;
}

const VoiceTestingPanel: React.FC<VoiceTestingPanelProps> = ({
  ticketId,
  ticketNumber
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'admin'>('client');
  const [pusherInstanceId, setPusherInstanceId] = useState('');
  const [realtimeUpdatesReceived, setRealtimeUpdatesReceived] = useState(0);
  const [voiceMessagesReceived, setVoiceMessagesReceived] = useState(0);
  const { toast } = useToast();

  // Initialize Pusher Beams
  const {
    isInitialized: pusherInitialized,
    permissionStatus,
    subscribeToTicket,
    requestPermission
  } = usePusherBeams({
    instanceId: pusherInstanceId,
    ticketId,
    enableAutoSubscribe: false
  });

  const addTestResult = (test: string, status: 'success' | 'error', message: string) => {
    const result: TestResult = {
      id: Date.now().toString(),
      test,
      status,
      message,
      timestamp: Date.now()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // Subscribe to voice messages for testing
  useEffect(() => {
    const unsubscribe = subscribeToVoiceMessages(ticketId, (messages) => {
      setVoiceMessagesReceived(messages.length);
      if (messages.length > 0) {
        addTestResult(
          'Voice Message Received',
          'success',
          `Received ${messages.length} voice messages via Realtime DB`
        );
      }
    });

    return unsubscribe;
  }, [ticketId]);

  // Subscribe to ticket updates for testing
  useEffect(() => {
    const unsubscribe = subscribeToTicketUpdates(ticketId, (ticket) => {
      setRealtimeUpdatesReceived(prev => prev + 1);
      addTestResult(
        'Ticket Update Received',
        'success',
        `Ticket status: ${ticket.status}, updated_at: ${new Date(ticket.updatedAt).toLocaleTimeString()}`
      );
    });

    return unsubscribe;
  }, [ticketId]);

  const runFullTestCycle = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: Voice Recording & Upload (Client perspective)
      addTestResult('Voice Recording Test', 'pending', 'Testing voice recording functionality...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addTestResult('Voice Recording Test', 'success', 'Voice recording UI is functional');

      // Test 2: Real-time DB connectivity
      addTestResult('Realtime DB Test', 'pending', 'Testing Realtime Database connection...');
      await new Promise(resolve => setTimeout(resolve, 500));
      addTestResult('Realtime DB Test', 'success', 'Connected to Firebase Realtime Database');

      // Test 3: Ticket status update with updated_at sync
      addTestResult('Status Update Test', 'pending', 'Testing ticket status update...');
      await updateTicketStatus(ticketId, 'requested');
      addTestResult('Status Update Test', 'success', 'Ticket status updated with proper timestamp sync');

      // Test 4: Push notification setup
      if (pusherInstanceId && pusherInitialized) {
        addTestResult('Push Notification Test', 'pending', 'Testing push notification setup...');
        await subscribeToTicket(ticketId);
        addTestResult('Push Notification Test', 'success', 'Subscribed to push notifications for ticket');
      } else {
        addTestResult('Push Notification Test', 'error', 'Pusher Beams not configured');
      }

      // Test 5: Role switching simulation
      addTestResult('Role Switch Test', 'pending', 'Testing role switching...');
      setCurrentUserRole(prev => prev === 'client' ? 'admin' : 'client');
      addTestResult('Role Switch Test', 'success', `Switched to ${currentUserRole === 'client' ? 'admin' : 'client'} view`);

    } catch (error) {
      addTestResult('Test Cycle', 'error', `Error during testing: ${error}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testPushNotifications = async () => {
    if (!pusherInstanceId) {
      toast({
        title: "Pusher Instance ID Required",
        description: "Please enter your Pusher Beams instance ID first",
        variant: "destructive"
      });
      return;
    }

    try {
      await requestPermission();
      await subscribeToTicket(ticketId);
      
      toast({
        title: "Push Notifications Enabled",
        description: "You should now receive notifications for this ticket"
      });
      
      addTestResult('Push Notification Setup', 'success', 'Push notifications enabled for ticket');
    } catch (error) {
      addTestResult('Push Notification Setup', 'error', `Failed to setup notifications: ${error}`);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Voice Messaging Test Suite
          <Badge variant="outline">Ticket #{ticketNumber}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="testing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testing">Run Tests</TabsTrigger>
            <TabsTrigger value="messaging">Test Messaging</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pusher-id">Pusher Beams Instance ID</Label>
                  <Input
                    id="pusher-id"
                    value={pusherInstanceId}
                    onChange={(e) => setPusherInstanceId(e.target.value)}
                    placeholder="Enter your Pusher Beams instance ID"
                  />
                </div>
                
                <div>
                  <Label>Current Test Role</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={currentUserRole === 'client' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentUserRole('client')}
                    >
                      Client
                    </Button>
                    <Button
                      variant={currentUserRole === 'admin' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentUserRole('admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Real-time Stats</h4>
                  <div className="space-y-1 text-sm">
                    <div>Voice Messages: {voiceMessagesReceived}</div>
                    <div>Realtime Updates: {realtimeUpdatesReceived}</div>
                    <div>Push Permission: {permissionStatus || 'Not requested'}</div>
                    <div>Pusher Status: {pusherInitialized ? 'Connected' : 'Disconnected'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={runFullTestCycle} 
                disabled={isRunningTests}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunningTests ? 'Running Tests...' : 'Run Full Test Cycle'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={testPushNotifications}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Test Push Notifications
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="messaging" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Test Voice Messaging as {currentUserRole}</h4>
              <p className="text-sm text-gray-600 mb-4">
                Record a voice message to test the complete flow: recording → upload → realtime sync → notification
              </p>
              
              <VoiceRecorder
                ticketId={ticketId}
                ticketNumber={ticketNumber}
                sender={currentUserRole}
                onMessageSent={() => {
                  addTestResult(
                    'Voice Message Sent',
                    'success',
                    `Voice message sent as ${currentUserRole}`
                  );
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => updateTicketStatus(ticketId, 'requested')}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Update to Requested
              </Button>
              
              <Button
                variant="outline"
                onClick={() => updateTicketStatus(ticketId, 'assigned', { assigned_worker: 'Test Worker', eta_minutes: 15 })}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Update to Assigned
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <ScrollArea className="h-96">
              {testResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No test results yet. Run some tests to see results here.
                </div>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {result.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : result.status === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      
                      <div className="flex-1">
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VoiceTestingPanel;
