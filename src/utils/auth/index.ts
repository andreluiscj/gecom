
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/supabase';

// Helper to get user role
export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    // Get user role from profile
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return null;
    
    return data.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Sync version - use with caution, for UI purposes only
export const getUserRoleSync = (): UserRole | null => {
  // Use local storage as fallback - this is for UI purposes only
  // Critical permissions should always be checked server-side
  const role = localStorage.getItem('user-role');
  return role as UserRole | null;
};

// Helper to get user secretarias (departments)
export const getUserSecretarias = async (): Promise<string[]> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];
    
    // Get user secretarias
    const { data, error } = await supabase
      .from('usuario_secretarias')
      .select('secretaria_id')
      .eq('usuario_id', session.user.id);
    
    if (error || !data) return [];
    
    return data.map(item => item.secretaria_id);
  } catch (error) {
    console.error('Error getting user secretarias:', error);
    return [];
  }
};

// Sync version - use with caution, for UI purposes only
export const getUserSetorSync = (): string | null => {
  return localStorage.getItem('user-setor');
};

export const getUserInfo = async () => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    // Get user info
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Function to check if the current user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Function to store user info in local storage for faster UI access
export const storeUserInfo = (user: any) => {
  if (!user) return;
  
  localStorage.setItem('user-id', user.id || '');
  localStorage.setItem('user-name', user.nome || '');
  localStorage.setItem('user-email', user.email || '');
  localStorage.setItem('user-role', user.role || '');
  
  if (user.municipio_id) {
    localStorage.setItem('user-municipio', user.municipio_id);
  }
};

// Function to clear stored user info
export const clearUserInfo = () => {
  localStorage.removeItem('user-id');
  localStorage.removeItem('user-name');
  localStorage.removeItem('user-email');
  localStorage.removeItem('user-role');
  localStorage.removeItem('user-municipio');
  localStorage.removeItem('user-setor');
};
