
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
    console.info("AuthProvider initialized");
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Auth state changed:", event, session?.user?.id);
      
      if (session) {
        try {
          const userProfile = await getCurrentUser();
          console.log("User profile loaded:", userProfile);
          
          setUser(userProfile);
          setUserRole(userProfile?.role || null);
          
          // Load user municipalities
          const municipalities = await getUserMunicipalities(session.user.id);
          console.log("User municipalities loaded:", municipalities);
          setUserMunicipalities(municipalities);
          
          // Set default municipality if available
          const selectedMunicipality = localStorage.getItem('municipio-selecionado');
          if (selectedMunicipality) {
            const parsedMunicipality = JSON.parse(selectedMunicipality);
            setUserMunicipality(parsedMunicipality);
          } else if (municipalities && municipalities.length > 0) {
            setUserMunicipality(municipalities[0]);
            localStorage.setItem('municipio-selecionado', JSON.stringify(municipalities[0]));
          }
          
          // Load user sectors
          const sectors = await getUserSectors(session.user.id);
          console.log("User sectors loaded:", sectors);
          setUserSectors(sectors);
        } catch (error) {
          console.error("Error loading user data:", error);
          toast.error("Erro ao carregar dados do usuário");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserMunicipality(null);
        setUserMunicipalities([]);
        setUserSectors([]);
        localStorage.removeItem('municipio-selecionado');
        setLoading(false);
      }
    });

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          console.log("Initial session found:", data.session.user.id);
          // Auth state change listener will handle setting the user
        } else {
          console.log("No initial session found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
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
