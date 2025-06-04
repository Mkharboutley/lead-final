import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { doc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ScanClose: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();
  const db = getFirestoreInstance();

  const updateStatus = (message: string, type: 'success' | 'error') => {
    setStatusMsg(message);
    setStatusType(type);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        const decodedText = result.data;
        const match = decodedText.match(/\/ticket\/([a-zA-Z0-9-]+)/);

        if (!match) {
          return updateStatus('❌ رمز غير صالح', 'error');
        }

        const ticketId = match[1];

        try {
          const ticketRef = doc(db, 'tickets', ticketId);
          await updateDoc(ticketRef, {
            status: 'completed',
            completed_at: Timestamp.now()
          });

          updateStatus('✅ تم تسليم السيارة بنجاح', 'success');
          scanner.stop();
          
          // Return to entry page after success
          setTimeout(() => {
            navigate('/entry');
          }, 2000);
        } catch (err) {
          console.error('Firestore error:', err);
          updateStatus('⚠️ حدث خطأ أثناء تحديث الحالة', 'error');
        }
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start().catch((err) => {
      console.error('Camera error:', err);
      updateStatus('📵 لا يمكن الوصول إلى الكاميرا', 'error');
    });

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [db, navigate]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera View */}
      <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

      {/* Scanning Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
        {/* Header */}
        <div className="w-full">
          <Button
            onClick={() => navigate('/entry')}
            variant="ghost"
            className="text-white"
          >
            <ArrowRight className="h-5 w-5 ml-2" />
            رجوع
          </Button>
        </div>

        {/* Status Message */}
        <div className="w-full max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            امسح رمز QR لإغلاق البطاقة
          </h2>
          
          {statusMsg && (
            <div className={`text-lg font-medium p-4 rounded-xl backdrop-blur-xl
              ${statusType === 'success' 
                ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}
            >
              {statusMsg}
            </div>
          )}
        </div>

        {/* Scanning Frame */}
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
          <div className="absolute inset-0 border-2 border-white/20 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ScanClose;