
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Clock } from 'lucide-react';
import { Ticket } from '../types/Ticket';

interface AssignWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onAssign: (ticketId: string, workerName: string, etaMinutes: number, notes?: string) => void;
}

const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onAssign
}) => {
  const [workerName, setWorkerName] = useState('');
  const [etaMinutes, setEtaMinutes] = useState<number>(15);
  const [notes, setNotes] = useState('');

  // Mock worker list - in real app this would come from a database
  const availableWorkers = [
    'John Smith',
    'Sarah Johnson',
    'Mike Wilson',
    'Lisa Brown',
    'David Garcia'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !workerName) return;

    onAssign(ticket.id, workerName, etaMinutes, notes || undefined);
    
    // Reset form
    setWorkerName('');
    setEtaMinutes(15);
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setWorkerName('');
    setEtaMinutes(15);
    setNotes('');
    onClose();
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assign Worker to Ticket #{ticket.ticket_number}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worker">Select Worker</Label>
            <Select value={workerName} onValueChange={setWorkerName} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a worker..." />
              </SelectTrigger>
              <SelectContent>
                {availableWorkers.map((worker) => (
                  <SelectItem key={worker} value={worker}>
                    {worker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eta" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Estimated Time (minutes)
            </Label>
            <Select value={etaMinutes.toString()} onValueChange={(value) => setEtaMinutes(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!workerName}>
              Assign Worker
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignWorkerModal;
