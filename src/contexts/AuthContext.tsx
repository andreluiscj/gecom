
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session) {
          const userProfile = await getCurrentUser();
          setUser(userProfile);
          setUserRole(userProfile?.role || null);
          
          // Load user municipalities
          const municipalities = await getUserMunicipalities(session.user.id);
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
          setUserSectors(sectors);
        } else {
          setUser(null);
          setUserRole(null);
          setUserMunicipality(null);
          setUserMunicipalities([]);
          setUserSectors([]);
          localStorage.removeItem('municipio-selecionado');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userProfile = await getCurrentUser();
        setUser(userProfile);
        setUserRole(userProfile?.role || null);
        
        // Load user municipalities
        const municipalities = await getUserMunicipalities(session.user.id);
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
        setUserSectors(sectors);
      }
      
      setLoading(false);
    });

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
