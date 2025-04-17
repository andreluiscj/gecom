
import { supabase } from '@/integrations/supabase/client';
import { getUserIdSync } from './authCore';

// Helper function to check if the user should filter by setor
export async function shouldFilterByUserSetor(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return false;
    
    // Regular users can only see their own setor
    return data.role === 'servidor';
  } catch (error) {
    console.error('Error checking user setor filter:', error);
    return false;
  }
}

// Synchronous version for UI
export function shouldFilterByUserSetorSync(): boolean {
  const role = localStorage.getItem('user-role');
  return role === 'servidor';
}

// Helper function to check if user has access to a specific setor
export async function hasSetorAccess(setorId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    if (await isAdmin()) return true;
    
    const { data, error } = await supabase
      .from('usuario_secretarias')
      .select('*')
      .eq('usuario_id', session.user.id)
      .eq('secretaria_id', setorId)
      .single();
    
    return !error && !!data;
  } catch (error) {
    console.error('Error checking setor access:', error);
    return false;
  }
}

// Synchronous version for UI
export function hasSetorAccessSync(setorId: string): boolean {
  if (localStorage.getItem('user-role') === 'admin') return true;
  
  try {
    const secretarias = localStorage.getItem('user-secretarias');
    if (!secretarias) return false;
    
    const parsed = JSON.parse(secretarias) as string[];
    return parsed.includes(setorId);
  } catch (e) {
    return false;
  }
}

// Helper to check if user can access user management
export function canAccessUserManagementSync(): boolean {
  const role = localStorage.getItem('user-role');
  return role === 'admin' || role === 'prefeito';
}

export function getUserNameSync(): string | null {
  return localStorage.getItem('user-name');
}
