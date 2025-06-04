
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketList from './TicketList';

interface TicketTabsProps {
  tickets: Ticket[];
  messageCounts?: Record<string, number>;
  unreadCounts?: Record<string, number>;
  latestAudioUrls?: Record<string, string>;
  onTicketSelect?: (ticket: Ticket) => void;
  onStatusUpdate?: (ticketId: string, status: TicketStatus) => void;
  onAssignWorker?: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

const TicketTabs: React.FC<TicketTabsProps> = ({
  tickets,
  messageCounts = {},
  unreadCounts = {},
  latestAudioUrls = {},
  onTicketSelect,
  onStatusUpdate,
  onAssignWorker,
  selectedTicketId
}) => {
  const filterTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-lg border border-white/20 p-1">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
        >
          All ({tickets.length})
        </TabsTrigger>
        <TabsTrigger 
          value="running"
          className="data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
        >
          Running ({filterTicketsByStatus('running').length})
        </TabsTrigger>
        <TabsTrigger 
          value="requested"
          className="data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
        >
          Requested ({filterTicketsByStatus('requested').length})
        </TabsTrigger>
        <TabsTrigger 
          value="assigned"
          className="data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
        >
          Assigned ({filterTicketsByStatus('assigned').length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed"
          className="data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-sm"
        >
          Completed ({filterTicketsByStatus('completed').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TicketList 
          tickets={tickets} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
        />
      </TabsContent>

      <TabsContent value="running">
        <TicketList 
          tickets={filterTicketsByStatus('running')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
        />
      </TabsContent>

      <TabsContent value="requested">
        <TicketList 
          tickets={filterTicketsByStatus('requested')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
        />
      </TabsContent>

      <TabsContent value="assigned">
        <TicketList 
          tickets={filterTicketsByStatus('assigned')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
        />
      </TabsContent>

      <TabsContent value="completed">
        <TicketList 
          tickets={filterTicketsByStatus('completed')} 
          messageCounts={messageCounts}
          unreadCounts={unreadCounts}
          latestAudioUrls={latestAudioUrls}
          onTicketSelect={onTicketSelect}
          onStatusUpdate={onStatusUpdate}
          onAssignWorker={onAssignWorker}
          selectedTicketId={selectedTicketId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TicketTabs;
