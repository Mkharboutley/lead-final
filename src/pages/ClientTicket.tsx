
import React from 'react';
import { useParams } from 'react-router-dom';
import VoiceChatModule from '../components/VoiceChatModule';

const ClientTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // For demo purposes, using the route param as ticketId
  // In a real app, you'd fetch the ticket data based on the ID
  const ticketId = id || 'demo-ticket';
  const ticketNumber = parseInt(id || '1', 10);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ticket #{ticketNumber}</h1>
        <p className="text-gray-600">Client Ticket View</p>
      </div>
      
      <div className="grid gap-6">
        {/* Voice Chat Module */}
        <VoiceChatModule
          ticketId={ticketId}
          ticketNumber={ticketNumber}
          userRole="client"
        />
        
        {/* Additional ticket information could go here */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Ticket Information</h2>
          <p className="text-gray-600">
            This is the client view of ticket #{ticketNumber}. 
            Use the voice messaging feature above to communicate with support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientTicket;
