
import { useState, useEffect } from 'react';
import { 
  getDrivers, 
  getETAConfig, 
  subscribeToDrivers, 
  subscribeToETAConfig,
  updateDriverAvailability,
  removeDriver,
  addDriver,
  updateETAConfig
} from '../services/adminConfigService';
import { Driver, ETAConfig } from '../types/AdminConfig';
import { useToast } from '@/hooks/use-toast';

export const useAdminConfig = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [etaConfig, setETaConfig] = useState<ETAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeDrivers = subscribeToDrivers((updatedDrivers) => {
      setDrivers(updatedDrivers);
    });

    const unsubscribeETAConfig = subscribeToETAConfig((updatedConfig) => {
      setETaConfig(updatedConfig);
    });

    // Initial load
    const loadInitialData = async () => {
      try {
        const [driversData, etaConfigData] = await Promise.all([
          getDrivers(),
          getETAConfig()
        ]);
        
        setDrivers(driversData);
        setETaConfig(etaConfigData);
      } catch (error) {
        console.error('Error loading admin config:', error);
        toast({
          title: "Error",
          description: "Failed to load admin configuration",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    return () => {
      unsubscribeDrivers();
      unsubscribeETAConfig();
    };
  }, [toast]);

  const handleAddDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDriver(driverData);
      toast({
        title: "Success",
        description: "Driver added successfully"
      });
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive"
      });
    }
  };

  const handleToggleDriverAvailability = async (driverId: string, isActive: boolean) => {
    try {
      await updateDriverAvailability(driverId, isActive);
      toast({
        title: "Success",
        description: `Driver ${isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error updating driver availability:', error);
      toast({
        title: "Error",
        description: "Failed to update driver availability",
        variant: "destructive"
      });
    }
  };

  const handleRemoveDriver = async (driverId: string) => {
    try {
      await removeDriver(driverId);
      toast({
        title: "Success",
        description: "Driver removed successfully"
      });
    } catch (error) {
      console.error('Error removing driver:', error);
      toast({
        title: "Error",
        description: "Failed to remove driver",
        variant: "destructive"
      });
    }
  };

  const handleUpdateETAConfig = async (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>) => {
    try {
      await updateETAConfig(config);
      toast({
        title: "Success",
        description: "ETA configuration updated successfully"
      });
    } catch (error) {
      console.error('Error updating ETA config:', error);
      toast({
        title: "Error",
        description: "Failed to update ETA configuration",
        variant: "destructive"
      });
    }
  };

  return {
    drivers,
    etaConfig,
    isLoading,
    handleAddDriver,
    handleToggleDriverAvailability,
    handleRemoveDriver,
    handleUpdateETAConfig
  };
};
