import { useState, useEffect } from 'react';
import { localAuthService, LocalUser } from '../services/localAuth';
import { UserProfile } from '../types/user';

export const useLocalAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = localAuthService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      setUserProfile({
        uid: currentUser.uid,
        ...currentUser.profile
      });
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await localAuthService.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      setUserProfile({
        uid: result.user.uid,
        ...result.user.profile
      });
    }
    
    return result;
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    age: number,
    gender: 'male' | 'female' | 'other'
  ) => {
    const result = await localAuthService.register(email, password, fullName, phone, age, gender);
    
    if (result.success && result.user) {
      setUser(result.user);
      setUserProfile({
        uid: result.user.uid,
        ...result.user.profile
      });
    }
    
    return result;
  };

  const logout = async () => {
    await localAuthService.logout();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    const result = await localAuthService.updateProfile(user.uid, updates);
    
    if (result.success && result.user) {
      setUser(result.user);
      setUserProfile({
        uid: result.user.uid,
        ...result.user.profile
      });
    }
    
    return result;
  };

  return {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    setUserProfile: (profile: UserProfile) => setUserProfile(profile),
    isAuthenticated: () => localAuthService.isAuthenticated()
  };
};