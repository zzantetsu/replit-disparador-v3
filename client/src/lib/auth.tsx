import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../../../shared/schema';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; needsActivation?: boolean }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  checkUserStatus: () => Promise<{ isActivated: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/me');
        const userData = await response.json();
        setUser(userData);
        setSession({ user: userData, access_token: 'session-token' });
      } catch (error) {
        // No session found
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const checkUserStatus = async () => {
    try {
      if (!session) {
        return { isActivated: false, error: 'No valid session' };
      }

      const response = await apiRequest('/api/auth/status');
      if (response.ok) {
        const data = await response.json();
        return { isActivated: data.emailVerified };
      } else {
        return { isActivated: false, error: 'Failed to check status' };
      }
    } catch (error) {
      return { isActivated: false, error: 'Connection error' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Login failed' };
      }

      const userData = await response.json();
      setUser(userData);
      setSession({ user: userData, access_token: 'session-token' });

      // Check activation status
      const statusResult = await checkUserStatus();
      
      if (!statusResult.isActivated) {
        return { needsActivation: true };
      }

      toast({
        title: "Success",
        description: "Successfully signed in!",
      });

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Registration failed' };
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      });

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    try {
      const response = await apiRequest('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      setSession(null);

      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Password reset failed' };
      }

      toast({
        title: "Success",
        description: "Password reset link sent to your email!",
      });

      return {};
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
