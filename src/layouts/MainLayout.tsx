import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAuthInstance } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';
  const isDashboard = location.pathname === '/dashboard';
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const auth = getAuthInstance();
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً"
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive"
      });
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed-height-container ${isDashboard ? 'dashboard-content' : ''}`}>
      {/* Minimal Glass Header */}
      <header className="relative z-10">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard">
            <Logo className="w-32" />
          </Link>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="glass-button"
          >
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;