
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car, Clock, Users, TrendingUp } from 'lucide-react';
import { Ticket } from '../types/Ticket';

interface DashboardStatsProps {
  tickets: Ticket[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tickets }) => {
  const activeTickets = tickets.filter(t => ['running', 'requested', 'assigned'].includes(t.status));
  const completedToday = tickets.filter(t => 
    t.status === 'completed' && 
    t.completed_at && 
    new Date(t.completed_at.toDate()).toDateString() === new Date().toDateString()
  );
  const avgResponseTime = '4.2'; // Mock data - calculate from actual ticket data
  const customerSatisfaction = '94'; // Mock data

  const stats = [
    {
      title: 'Active Tickets',
      value: activeTickets.length.toString(),
      icon: Car,
      description: 'Currently in progress',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed Today',
      value: completedToday.length.toString(),
      icon: TrendingUp,
      description: 'Tickets resolved today',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Response Time',
      value: `${avgResponseTime} min`,
      icon: Clock,
      description: 'Average time to assign',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Satisfaction Rate',
      value: `${customerSatisfaction}%`,
      icon: Users,
      description: 'Customer satisfaction',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
