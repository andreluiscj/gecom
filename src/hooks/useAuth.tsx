
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Usuario, UserRole } from '@/types/supabase';
import { clearUserInfo } from '@/utils/auth';

interface AuthContextType {
  user: Usuario | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  handleLogout: () => Promise<void>; // Added for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession) {
        try {
          // Get user profile from database
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (userError) throw userError;
          
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Don't sign out - might just be RLS permissions
        }
      }
      
      setLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          
          if (event === 'SIGNED_IN' && newSession) {
            setLoading(true);
            
            try {
              // Get user profile
              const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', newSession.user.id)
                .single();
              
              if (userError) throw userError;
              
              setUser(userData);
            } catch (error) {
              console.error('Error fetching user data on sign in:', error);
            } finally {
              setLoading(false);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error during sign in:', error);
      toast.error(error.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string, role: UserRole = 'servidor') => {
    try {
      setLoading(true);
      
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', email);
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        toast.error('Este email já está cadastrado');
        return;
      }
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email,
            nome,
            role,
            primeiro_acesso: true
          });
        
        if (profileError) throw profileError;
        
        toast.success('Cadastro realizado com sucesso!');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error during sign up:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      clearUserInfo();
      navigate('/login');
      toast.success('Sessão encerrada com sucesso');
    } catch (error: any) {
      console.error('Error during sign out:', error);
      toast.error(error.message || 'Erro ao encerrar sessão');
    } finally {
      setLoading(false);
    }
  };

  // Alias for signOut for compatibility
  const handleLogout = async () => {
    return signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('Email de recuperação enviado com sucesso');
    } catch (error: any) {
      console.error('Error during password reset:', error);
      toast.error(error.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Senha atualizada com sucesso');
      
      // Update primeiro_acesso if needed
      if (user && user.primeiro_acesso) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ primeiro_acesso: false })
          .eq('id', user.id);
        
        if (updateError) throw updateError;
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
