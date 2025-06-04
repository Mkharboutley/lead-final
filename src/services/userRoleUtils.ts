
import { getCurrentUser } from './authUtils';

export const getUserRole = async (): Promise<'admin' | 'user' | null> => {
  try {
    const user = getCurrentUser();
    if (!user) return null;
    
    // Get user role from custom claims or database
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role as string;
    
    // Default to 'user' if no role is set
    return role === 'admin' ? 'admin' : 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default to user role on error
  }
};

export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};
