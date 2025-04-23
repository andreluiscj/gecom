
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => ({ success: false }),
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as string) || 'user'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as string) || 'user'
        });
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching session:", err);
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
        // Fetch additional user data if needed
        try {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();

          if (!userError && userData) {
            // Store any relevant user data in localStorage for easy access
            localStorage.setItem('user-role', userData.role);
            localStorage.setItem('user-authenticated', 'true');
            localStorage.setItem('user-id', userData.id);
            localStorage.setItem('funcionario-id', userData.funcionario_id);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }

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
      localStorage.removeItem('user-id');
      localStorage.removeItem('funcionario-id');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const value = {
    user,
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
