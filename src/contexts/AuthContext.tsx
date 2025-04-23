
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: string;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userDetails?: object) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: '',
  loading: true,
  error: null,
  signIn: async () => ({ success: false, error: 'AuthContext not initialized' }),
  signUp: async () => ({ success: false, error: 'AuthContext not initialized' }),
  signOut: async () => { /* empty function */ },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);

      // Set user data in localStorage
      if (newSession?.user) {
        localStorage.setItem('user-authenticated', 'true');
        getUserRole(newSession.user.id);
      } else {
        localStorage.setItem('user-authenticated', 'false');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-id');
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      if (currentSession?.user) {
        localStorage.setItem('user-authenticated', 'true');
        getUserRole(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('role')
        .eq('auth_user_id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        const role = data.role;
        setUserRole(role);
        localStorage.setItem('user-role', role);
        localStorage.setItem('user-id', userId);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Use localStorage fallback for demo/development purposes
      const mockRole = localStorage.getItem('user-role') || 'user';
      setUserRole(mockRole);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        return { success: true };
      } else {
        return { success: false, error: 'No user data returned' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, userDetails = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userDetails
        }
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.setItem('user-authenticated', 'false');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-id');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole,
      loading, 
      error, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
