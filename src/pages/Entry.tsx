import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode } from 'lucide-react';

const Entry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] relative flex flex-col items-center justify-center p-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Action buttons */}
        <div className="space-y-4" dir="rtl">
          <Button
            onClick={() => navigate('/create-ticket')}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <CreditCard className="h-5 w-5 ml-2" />
            بطاقة جديدة
          </Button>

          <Button
            onClick={() => navigate('/scan-close')}
            variant="outline"
            size="lg"
            className="w-full glass-button"
          >
            <QrCode className="h-5 w-5 ml-2" />
            إغلاق بطاقة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Entry;