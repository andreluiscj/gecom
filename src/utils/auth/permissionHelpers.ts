
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/supabase';
import { getUserRoleSync, getUserSetorSync } from './index';

// Helper function to check workflow permissions
export async function getPermittedWorkflowStep(): Promise<number | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return null;
    
    // Different roles can access different workflow steps
    if (data.role === 'admin') return null; // Admin can access all steps
    if (data.role === 'gestor') return 2; // Manager can access step 2
    return null; // Other roles have no specific workflow step permissions
  } catch (error) {
    console.error('Error checking workflow permissions:', error);
    return null;
  }
}

// Helper function to check if user can edit a specific workflow step
export async function canEditWorkflowStep(stepTitle: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return false;
    
    // This is a simplified implementation
    if (data.role === 'admin') return true;
    
    // Define which roles can edit which steps
    const stepPermissions: Record<string, UserRole[]> = {
      'Aprovação da DFD': ['admin', 'gestor'],
      'Cotação': ['admin', 'gestor'],
      'Abertura de Processo': ['admin'],
      'Empenhamento': ['admin', 'gestor'],
      'Licitação': ['admin', 'gestor'],
      'Contratação': ['admin', 'prefeito'],
      'Entrega': ['admin', 'gestor'],
      'Pagamento': ['admin', 'gestor']
    };
    
    // Check if the user's role is in the allowed roles for this step
    return stepPermissions[stepTitle]?.includes(data.role as UserRole) || false;
  } catch (error) {
    console.error('Error checking workflow edit permissions:', error);
    return false;
  }
}

// Sync version for UI purposes
export function canEditWorkflowStepSync(stepTitle: string): boolean {
  const role = getUserRoleSync();
  
  if (!role) return false;
  if (role === 'admin') return true;
  
  // Define which roles can edit which steps
  const stepPermissions: Record<string, UserRole[]> = {
    'Aprovação da DFD': ['admin', 'gestor'],
    'Cotação': ['admin', 'gestor'],
    'Abertura de Processo': ['admin'],
    'Empenhamento': ['admin', 'gestor'],
    'Licitação': ['admin', 'gestor'],
    'Contratação': ['admin', 'prefeito'],
    'Entrega': ['admin', 'gestor'],
    'Pagamento': ['admin', 'gestor']
  };
  
  return stepPermissions[stepTitle]?.includes(role) || false;
}

// Check if user can access specific features
export async function canAccess(feature: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return false;
    
    // Define feature permissions
    const featurePermissions: Record<string, UserRole[]> = {
      'dashboard': ['admin', 'gestor', 'prefeito', 'servidor'],
      'pedidos': ['admin', 'gestor', 'servidor'],
      'aprovacao': ['admin', 'gestor', 'prefeito'],
      'usuarios': ['admin'],
      'relatorios': ['admin', 'gestor', 'prefeito'],
      'setores': ['admin', 'gestor', 'prefeito']
    };
    
    return featurePermissions[feature]?.includes(data.role as UserRole) || false;
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

// Sync version for UI purposes
export function canAccessSync(feature: string): boolean {
  const role = getUserRoleSync();
  
  if (!role) return false;
  
  // Define feature permissions
  const featurePermissions: Record<string, UserRole[]> = {
    'dashboard': ['admin', 'gestor', 'prefeito', 'servidor'],
    'pedidos': ['admin', 'gestor', 'servidor'],
    'aprovacao': ['admin', 'gestor', 'prefeito'],
    'usuarios': ['admin'],
    'relatorios': ['admin', 'gestor', 'prefeito'],
    'setores': ['admin', 'gestor', 'prefeito']
  };
  
  return featurePermissions[feature]?.includes(role) || false;
}
