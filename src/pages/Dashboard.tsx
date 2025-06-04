
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Clock, 
  Users, 
  TrendingUp, 
  Plus,
  BarChart3,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import TicketTabs from '../components/TicketTabs';
import DashboardStats from '../components/DashboardStats';

const Dashboard: React.FC = () => {
  const { tickets, isLoading } = useTickets();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
    navigate(`/ticket/${ticket.id}`);
  };

  const handleStatusUpdate = (ticketId: string, status: string) => {
    console.log('Status update:', ticketId, status);
    // Implement status update logic
  };

  const handleAssignWorker = (ticket: any) => {
    console.log('Assign worker:', ticket);
    // Implement worker assignment logic
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Valet Dashboard</h1>
              <p className="text-gray-600">Manage tickets and monitor operations</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => navigate('/test-voice')}
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
              <Button onClick={() => navigate('/create-ticket')}>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <DashboardStats tickets={tickets} />

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Active Tickets
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketTabs 
                    tickets={tickets}
                    onTicketSelect={handleTicketSelect}
                    onStatusUpdate={handleStatusUpdate}
                    onAssignWorker={handleAssignWorker}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <Badge variant="secondary">4.2 mins</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <Badge variant="secondary">94%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion Rate</span>
                        <Badge variant="secondary">98%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="flex items-center gap-3 p-2 border rounded">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Ticket #{ticket.ticket_number}</p>
                            <p className="text-xs text-gray-500">{ticket.guest_name}</p>
                          </div>
                          <Badge variant="outline">{ticket.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>System Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <p className="font-medium">System Update Available</p>
                      <p className="text-sm text-gray-600">New voice messaging features are ready to install.</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <p className="font-medium">All Systems Operational</p>
                      <p className="text-sm text-gray-600">Voice messaging and real-time updates are working normally.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
