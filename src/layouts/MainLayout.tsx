import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAuthInstance } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { Car, Home, Plus, TestTube, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const { toast } = useToast();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Ticket', href: '/create-ticket', icon: Plus },
    { name: 'Test Voice', href: '/test-voice', icon: TestTube },
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuthInstance();
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the system"
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error signing out",
        variant: "destructive"
      });
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation Header with Glass Morphism */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl">
                  <img 
                    src="/lovable-uploads/b2860a75-786b-473b-9558-918995cd240e.png" 
                    alt="iVALET" 
                    className="h-8 w-auto"
                  />
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-300 backdrop-blur-md ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer with Glass Morphism */}
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/10 mt-auto shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-300">
            © 2024 iVALET System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
