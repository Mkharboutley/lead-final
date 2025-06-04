
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, User, Phone, Mail, Trash2 } from 'lucide-react';
import { Driver } from '../types/AdminConfig';

interface DriverManagementProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onToggleAvailability: (driverId: string, isActive: boolean) => Promise<void>;
  onRemoveDriver: (driverId: string) => Promise<void>;
}

const DriverManagement: React.FC<DriverManagementProps> = ({
  drivers,
  onAddDriver,
  onToggleAvailability,
  onRemoveDriver
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name.trim() || !newDriver.email.trim()) return;

    await onAddDriver({
      name: newDriver.name.trim(),
      email: newDriver.email.trim(),
      phone: newDriver.phone.trim() || undefined,
      isActive: newDriver.isActive
    });

    setNewDriver({ name: '', email: '', phone: '', isActive: true });
    setIsAddDialogOpen(false);
  };

  const activeDrivers = drivers.filter(d => d.isActive);
  const inactiveDrivers = drivers.filter(d => !d.isActive);

  return (
    <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Management
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Driver</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Name *</Label>
                  <Input
                    id="name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    placeholder="Driver's full name"
                    required
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    placeholder="driver@email.com"
                    required
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    placeholder="(optional)"
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newDriver.isActive}
                    onCheckedChange={(checked) => setNewDriver({ ...newDriver, isActive: checked })}
                  />
                  <Label htmlFor="active" className="text-gray-300">Active by default</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600/70 hover:bg-blue-600/90">Add Driver</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-4 text-sm text-gray-300">
          <span>Active: {activeDrivers.length}</span>
          <span>Inactive: {inactiveDrivers.length}</span>
          <span>Total: {drivers.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Phone</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No drivers found. Add your first driver to get started.
                  </TableCell>
                </TableRow>
              ) : (
                drivers.map((driver) => (
                  <TableRow key={driver.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{driver.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {driver.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {driver.phone ? (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {driver.phone}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={driver.isActive ? "default" : "secondary"}
                        className={driver.isActive ? "bg-green-500/80 text-white backdrop-blur-md" : "bg-gray-500/80 text-white backdrop-blur-md"}
                      >
                        {driver.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={driver.isActive}
                          onCheckedChange={(checked) => onToggleAvailability(driver.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveDriver(driver.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverManagement;
