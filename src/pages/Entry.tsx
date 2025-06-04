import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode } from 'lucide-react';

const Entry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] relative flex flex-col items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      {/* Glowing orbs with reduced size */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-[96px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full filter blur-[96px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm space-y-4" dir="rtl">
        {/* Action buttons with improved glass morphism */}
        <Button
          onClick={() => navigate('/create-ticket')}
          className="w-full h-14 bg-gradient-to-r from-blue-600/80 to-blue-400/80 hover:from-blue-500/90 hover:to-blue-300/90
            backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(59,130,246,0.3)]
            hover:shadow-[0_8px_48px_rgba(59,130,246,0.4)] transition-all duration-300
            text-white text-lg rounded-2xl"
        >
          <CreditCard className="h-5 w-5 ml-2" />
          بطاقة جديدة
        </Button>

        <Button
          onClick={() => navigate('/scan-close')}
          className="w-full h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl 
            border border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]
            hover:shadow-[0_8px_48px_rgba(0,0,0,0.3)] transition-all duration-300
            text-white text-lg rounded-2xl"
        >
          <QrCode className="h-5 w-5 ml-2" />
          إغلاق بطاقة
        </Button>
      </div>
    </div>
  );
};

export default Entry;