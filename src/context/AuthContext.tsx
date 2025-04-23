
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService, usuarioService } from '@/services/supabase';
import { UsuarioLogin } from '@/types';

type AuthContextType = {
  user: any | null; // Usuário do Supabase Auth
  userProfile: UsuarioLogin | null; // Perfil completo do usuário
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean, error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UsuarioLogin | null>(null);
  const [loading, setLoading] = useState(true);

  // Efeito para verificar a sessão atual e configurar o ouvinte de alterações de estado de autenticação
  useEffect(() => {
    // Primeiro, definimos o ouvinte de alterações de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            try {
              const userProfile = await usuarioService.getByAuthUserId(session.user.id);
              setUserProfile(userProfile);
            } catch (error) {
              console.error("Erro ao buscar perfil do usuário:", error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Depois, verificamos a sessão atual
    const checkCurrentSession = async () => {
      try {
        const { session, error } = await authService.getSession();
        
        if (session) {
          setUser(session.user);
          
          const userProfile = await usuarioService.getByAuthUserId(session.user.id);
          setUserProfile(userProfile);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkCurrentSession();
    
    // Limpar a assinatura quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      const { user, error } = await authService.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    await authService.signOut();
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
