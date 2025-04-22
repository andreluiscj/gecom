
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrentUser, getUserMunicipalities, getUserSectors } from '@/services/authService';

interface AuthContextData {
  user: any;
  loading: boolean;
  userMunicipality: any;
  userRole: string | null;
  userSectors: any[];
  setCurrentMunicipality: (municipality: any) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<any>(null);
  const [userMunicipalities, setUserMunicipalities] = useState<any[]>([]);
  const [userSectors, setUserSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANTE: Primeiro configurar o listener de mudanças de autenticação
    // antes de buscar a sessão atual
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (session) {
          // Usar setTimeout(0) para evitar ciclos de promessas dentro de listeners de eventos
          // que podem causar deadlock nas chamadas do Supabase
          setTimeout(async () => {
            try {
              const userProfile = await getCurrentUser();
              setUser(userProfile);
              setUserRole(userProfile?.role || null);
              
              // Carregar municípios do usuário
              const municipalities = await getUserMunicipalities(session.user.id);
              setUserMunicipalities(municipalities);
              
              // Definir município padrão se disponível
              const selectedMunicipality = localStorage.getItem('municipio-selecionado');
              if (selectedMunicipality) {
                try {
                  const parsedMunicipality = JSON.parse(selectedMunicipality);
                  setUserMunicipality(parsedMunicipality);
                } catch (e) {
                  console.error("Error parsing municipality from localStorage", e);
                  if (municipalities && municipalities.length > 0) {
                    setUserMunicipality(municipalities[0]);
                    localStorage.setItem('municipio-selecionado', JSON.stringify(municipalities[0]));
                  }
                }
              } else if (municipalities && municipalities.length > 0) {
                setUserMunicipality(municipalities[0]);
                localStorage.setItem('municipio-selecionado', JSON.stringify(municipalities[0]));
              }
              
              // Carregar setores do usuário
              const sectors = await getUserSectors(session.user.id);
              setUserSectors(sectors);
            } catch (error) {
              console.error("Error loading user data:", error);
              toast.error("Erro ao carregar dados do usuário");
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setUserRole(null);
          setUserMunicipality(null);
          setUserMunicipalities([]);
          setUserSectors([]);
          localStorage.removeItem('municipio-selecionado');
          setLoading(false);
        }
      }
    );

    // DEPOIS verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userProfile = await getCurrentUser();
          setUser(userProfile);
          setUserRole(userProfile?.role || null);
          
          // Carregar municípios do usuário
          const municipalities = await getUserMunicipalities(session.user.id);
          setUserMunicipalities(municipalities);
          
          // Definir município padrão se disponível
          const selectedMunicipality = localStorage.getItem('municipio-selecionado');
          if (selectedMunicipality) {
            try {
              const parsedMunicipality = JSON.parse(selectedMunicipality);
              setUserMunicipality(parsedMunicipality);
            } catch (e) {
              if (municipalities && municipalities.length > 0) {
                setUserMunicipality(municipalities[0]);
                localStorage.setItem('municipio-selecionado', JSON.stringify(municipalities[0]));
              }
            }
          } else if (municipalities && municipalities.length > 0) {
            setUserMunicipality(municipalities[0]);
            localStorage.setItem('municipio-selecionado', JSON.stringify(municipalities[0]));
          }
          
          // Carregar setores do usuário
          const sectors = await getUserSectors(session.user.id);
          setUserSectors(sectors);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function setCurrentMunicipality(municipality: any) {
    setUserMunicipality(municipality);
    localStorage.setItem('municipio-selecionado', JSON.stringify(municipality));
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        userRole, 
        userMunicipality,
        userSectors,
        setCurrentMunicipality 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
