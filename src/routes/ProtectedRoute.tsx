
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../services/userRoleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      if (user) {
        setAuthenticated(true);
        try {
          const role = await getUserRole();
          console.log('User role:', role);
          setUserRole(role);
        } catch (error) {
          console.error('Error getting user role:', error);
          setUserRole('user'); // Default to user
        }
      } else {
        setAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based redirects for root and entry paths
  if (authenticated && userRole) {
    const currentPath = location.pathname;
    console.log('Current path:', currentPath, 'User role:', userRole);
    
    // If user is on root path, entry page, or dashboard, redirect based on role
    if (currentPath === '/' || currentPath === '/entry') {
      if (userRole === 'admin') {
        console.log('Redirecting admin to dashboard');
        return <Navigate to="/dashboard" replace />;
      } else {
        console.log('Redirecting user to entry');
        return <Navigate to="/entry" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
