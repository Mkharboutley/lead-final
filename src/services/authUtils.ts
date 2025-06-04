
import { getAuth } from 'firebase/auth';

export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};

export const requireAuth = () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated. Please log in to continue.');
  }
  return user;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
