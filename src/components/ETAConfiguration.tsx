
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, AlertCircle, Save } from 'lucide-react';
import { ETAConfig } from '../types/AdminConfig';

interface ETAConfigurationProps {
  etaConfig: ETAConfig | null;
  onUpdateConfig: (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>) => Promise<void>;
}

const ETAConfiguration: React.FC<ETAConfigurationProps> = ({
  etaConfig,
  onUpdateConfig
}) => {
  const [formData, setFormData] = useState({
    defaultDeliveryTimeMinutes: 10,
    preAlertMarginMinutes: 3
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (etaConfig) {
      setFormData({
        defaultDeliveryTimeMinutes: etaConfig.defaultDeliveryTimeMinutes,
        preAlertMarginMinutes: etaConfig.preAlertMarginMinutes
      });
    }
  }, [etaConfig]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.defaultDeliveryTimeMinutes < 1 || formData.preAlertMarginMinutes < 0) {
      return;
    }

    await onUpdateConfig(formData);
    setHasChanges(false);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          ETA & Timing Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultTime">Default Delivery Time (minutes)</Label>
              <Input
                id="defaultTime"
                type="number"
                min="1"
                value={formData.defaultDeliveryTimeMinutes}
                onChange={(e) => handleInputChange('defaultDeliveryTimeMinutes', e.target.value)}
                className="bg-white/50 backdrop-blur-sm"
              />
              <p className="text-xs text-gray-600">
                Base time required to bring a vehicle to the customer
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preAlert">Pre-Alert Margin (minutes)</Label>
              <Input
                id="preAlert"
                type="number"
                min="0"
                value={formData.preAlertMarginMinutes}
                onChange={(e) => handleInputChange('preAlertMarginMinutes', e.target.value)}
                className="bg-white/50 backdrop-blur-sm"
              />
              <p className="text-xs text-gray-600">
                How many minutes before ETA to notify the customer
              </p>
            </div>
          </div>

          {/* ETA Logic Explanation */}
          <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">ETA Logic Rules</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Timer starts ONLY when ticket is assigned to a worker</li>
                  <li>• Status must be 'running' and assigned_worker must not be null</li>
                  <li>• Countdown begins from assignment time + default delivery time</li>
                  <li>• Pre-alert notification sent at ETA minus margin time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Configuration Display */}
          {etaConfig && (
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
              <h4 className="font-medium text-gray-800 mb-2">Current Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="ml-2 font-medium">{etaConfig.defaultDeliveryTimeMinutes} minutes</span>
                </div>
                <div>
                  <span className="text-gray-600">Pre-Alert:</span>
                  <span className="ml-2 font-medium">{etaConfig.preAlertMarginMinutes} minutes</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {etaConfig.updatedAt.toDate().toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={!hasChanges}
              className="bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ETAConfiguration;
