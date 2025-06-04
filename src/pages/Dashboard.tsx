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
  Bell,
  Settings,
  UserCog,
  AlertTriangle
} from 'lucide-react';
import { useTicketData } from '../hooks/useTicketData';
import { useAdminConfig } from '../hooks/useAdminConfig';
import TicketTabs from '../components/TicketTabs';
import DashboardStats from '../components/DashboardStats';
import DriverManagement from '../components/DriverManagement';
import ETAConfiguration from '../components/ETAConfiguration';

const Dashboard: React.FC = () => {
  const { 
    tickets, 
    messageCounts, 
    unreadCounts, 
    latestAudioUrls, 
    isLoading 
  } = useTicketData();
  const { 
    drivers, 
    etaConfig, 
    isLoading: isConfigLoading,
    hasPermissionError,
    handleAddDriver,
    handleToggleDriverAvailability,
    handleRemoveDriver,
    handleUpdateETAConfig
  } = useAdminConfig();
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

  if (isLoading || isConfigLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header with Enhanced Glass Morphism */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {hasPermissionError && (
                <div className="flex items-center gap-2 mt-2 text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Limited access mode - Some admin features may be restricted</span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => navigate('/test-voice')}
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
              <Button 
                onClick={() => navigate('/create-ticket')}
                className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid with Enhanced Glass Morphism */}
        <div className="mb-8">
          <DashboardStats tickets={tickets} />
        </div>

        {/* Permission Error Warning */}
        {hasPermissionError && (
          <Card className="mb-6 bg-yellow-500/20 backdrop-blur-xl border border-yellow-400/30 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-yellow-200">Limited Admin Access</h3>
                  <p className="text-sm text-yellow-300">
                    You are running in limited access mode. Some admin features like driver management and configuration 
                    may not be fully available due to Firebase permission restrictions. Contact your system administrator 
                    to configure proper Firestore security rules.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content with Enhanced Glass Morphism */}
        <div className="mt-8">
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-black/30 backdrop-blur-xl border border-white/10 p-1 shadow-2xl">
              <TabsTrigger 
                value="tickets" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
              >
                <Car className="h-4 w-4" />
                Tickets
              </TabsTrigger>
              <TabsTrigger 
                value="drivers" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
              >
                <UserCog className="h-4 w-4" />
                Drivers
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-lg data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Ticket Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketTabs 
                    tickets={tickets}
                    messageCounts={messageCounts}
                    unreadCounts={unreadCounts}
                    latestAudioUrls={latestAudioUrls}
                    onTicketSelect={handleTicketSelect}
                    onStatusUpdate={handleStatusUpdate}
                    onAssignWorker={handleAssignWorker}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers">
              <DriverManagement
                drivers={drivers}
                onAddDriver={handleAddDriver}
                onToggleAvailability={handleToggleDriverAvailability}
                onRemoveDriver={handleRemoveDriver}
              />
            </TabsContent>

            <TabsContent value="config">
              <ETAConfiguration
                etaConfig={etaConfig}
                onUpdateConfig={handleUpdateETAConfig}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average Response Time</span>
                        <Badge variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200">4.2 mins</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Customer Satisfaction</span>
                        <Badge variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200">94%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Completion Rate</span>
                        <Badge variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200">98%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">Ticket #{ticket.ticket_number}</p>
                            <p className="text-xs text-gray-400">{ticket.car_model} - {ticket.plate_number}</p>
                          </div>
                          <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-gray-200">{ticket.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">System Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-yellow-400 bg-yellow-400/10 backdrop-blur-md rounded-r-lg border border-yellow-400/20">
                      <p className="font-medium text-white">System Update Available</p>
                      <p className="text-sm text-gray-300">New voice messaging features are ready to install.</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-400 bg-green-400/10 backdrop-blur-md rounded-r-lg border border-green-400/20">
                      <p className="font-medium text-white">All Systems Operational</p>
                      <p className="text-sm text-gray-300">Voice messaging and real-time updates are working normally.</p>
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
