
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  error: null,
  signIn: async () => ({ success: false }),
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session and set up auth state change listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Get user role if session exists
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('usuarios')
                .select('role')
                .eq('auth_user_id', session.user.id)
                .single();
                
              if (data) {
                setUserRole(data.role as UserRole);
                localStorage.setItem('user-role', data.role);
                localStorage.setItem('user-authenticated', 'true');
              } else {
                console.error('No user data found:', error);
                setUserRole(null);
              }
            } catch (err) {
              console.error('Error fetching user role:', err);
              setUserRole(null);
            }
          }, 0);
        } else {
          setUserRole(null);
          localStorage.removeItem('user-role');
          localStorage.removeItem('user-authenticated');
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user role
        supabase
          .from('usuarios')
          .select('role')
          .eq('auth_user_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              setUserRole(data.role as UserRole);
              localStorage.setItem('user-role', data.role);
              localStorage.setItem('user-authenticated', 'true');
            } else {
              console.error('No user data found:', error);
              setUserRole(null);
            }
          })
          .catch(err => {
            console.error('Error fetching user role:', err);
            setUserRole(null);
          });
      }
      
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching session:', err);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        toast.success('Login realizado com sucesso!');
        return { success: true };
      } else {
        return { success: false, error: "Falha na autenticação" };
      }
    } catch (err) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user-authenticated');
      localStorage.removeItem('user-role');
      toast.success('Logout realizado com sucesso!');
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error('Erro ao fazer logout');
    }
  };

  const value = {
    user,
    userRole,
    loading,
    error,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
