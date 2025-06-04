
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Glass Morphism */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
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
                className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-gray-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
              <Button 
                onClick={() => navigate('/create-ticket')}
                className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700/80 text-white border border-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid with Glass Morphism */}
        <div className="mb-8">
          <DashboardStats tickets={tickets} />
        </div>

        {/* Main Content with Glass Morphism */}
        <div className="mt-8">
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-lg border border-white/20 p-1">
              <TabsTrigger 
                value="tickets" 
                className="flex items-center gap-2 data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
              >
                <Car className="h-4 w-4" />
                Active Tickets
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Ticket Management</CardTitle>
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
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Average Response Time</span>
                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">4.2 mins</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Customer Satisfaction</span>
                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">94%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Completion Rate</span>
                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">98%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Ticket #{ticket.ticket_number}</p>
                            <p className="text-xs text-gray-600">{ticket.car_model} - {ticket.plate_number}</p>
                          </div>
                          <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30">{ticket.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">System Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50/50 backdrop-blur-sm rounded-r-lg">
                      <p className="font-medium text-gray-900">System Update Available</p>
                      <p className="text-sm text-gray-600">New voice messaging features are ready to install.</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-500 bg-green-50/50 backdrop-blur-sm rounded-r-lg">
                      <p className="font-medium text-gray-900">All Systems Operational</p>
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
