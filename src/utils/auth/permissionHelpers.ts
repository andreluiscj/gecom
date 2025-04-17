
// Permission and access control functions
import { supabase } from '@/integrations/supabase/client';
import { getUserIdSync, getUserRoleSync, getUserSetorSync, getUserSecretariasSync } from './authCore';

// Function to check if user is on first login
export async function isFirstLogin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('primeiro_acesso')
    .eq('id', userId)
    .single();
    
  if (error || !data) return false;
  return data.primeiro_acesso === true;
}

// Function to set first login status
export async function setFirstLogin(userId: string, status: boolean): Promise<void> {
  if (!userId) return;
  
  await supabase
    .from('usuarios')
    .update({ primeiro_acesso: status })
    .eq('id', userId);
}

// Function to check if user has accepted GDPR terms
export function hasAcceptedGDPR(userId: string): boolean {
  if (!userId) return false;
  
  return localStorage.getItem(`gdpr-accepted-${userId}`) === 'true';
}

// Function to set GDPR acceptance status
export function setGDPRAccepted(userId: string, status: boolean): void {
  if (userId) {
    localStorage.setItem(`gdpr-accepted-${userId}`, status.toString());
  }
}

// Function to get the selected municipality
export function getSelectedMunicipality(): string | null {
  return localStorage.getItem('municipio-selecionado');
}

// Function to check if user can access a specific route
export async function canAccess(userId: string, requiredRole: string | string[]): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  const userRole = data.role;
  
  // Admin e prefeito podem acessar tudo
  if (userRole === 'admin' || userRole === 'prefeito') return true;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

// Synchronous version for route access checking
export function canAccessSync(requiredRole: string | string[]): boolean {
  const userRole = getUserRoleSync();
  
  if (!userRole) return false;
  
  // Admin e prefeito podem acessar tudo
  if (userRole === 'admin' || userRole === 'prefeito') return true;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

// Function to check if user can edit a specific workflow step
export async function canEditWorkflowStep(userId: string, stepTitle: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  const userRole = data.role;
  
  // Admin e prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For future implementation: check specific permissions for workflow steps
  
  return false;
}

// Synchronous version of workflow step editing permission check
export function canEditWorkflowStepSync(stepTitle: string): boolean {
  const userRole = getUserRoleSync();
  
  // Admin e prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For future implementation: check specific permissions for workflow steps
  
  return false;
}

// Function to get the permitted workflow step for the current user
export function getPermittedWorkflowStep(): string | null {
  const userRole = getUserRoleSync();
  
  if (userRole === 'admin' || userRole === 'prefeito') {
    return 'all';
  }
  
  if (userRole === 'manager') {
    return 'approval';
  }
  
  return null;
}

// Function to check if user can access pedidos from a specific sector
export async function canAccessSetor(userId: string, setor: string): Promise<boolean> {
  if (!userId || !setor) return false;
  
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (userError || !userData) return false;
  
  // Admin e prefeito podem acessar todos os setores
  if (userData.role === 'admin' || userData.role === 'prefeito') {
    return true;
  }
  
  // Check if user belongs to the specified setor
  const { data: setorData, error: setorError } = await supabase
    .from('usuario_secretarias')
    .select('*')
    .eq('usuario_id', userId)
    .eq('secretaria_id', setor);
    
  if (setorError) return false;
  
  return setorData && setorData.length > 0;
}

// Synchronous version of sector access check
export function canAccessSetorSync(setor: string): boolean {
  const userRole = getUserRoleSync();
  
  // Admin e prefeito podem acessar todos os setores
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // Check if user belongs to the specified setor
  try {
    const secretarias = getUserSecretariasSync();
    return secretarias.includes(setor);
  } catch (e) {
    return false;
  }
}

// Function to check if user can manage users
export async function canAccessUserManagement(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  return data.role === 'admin' || data.role === 'prefeito'; 
}

// Synchronous version of user management permission check
export function canAccessUserManagementSync(): boolean {
  const userRole = getUserRoleSync();
  return userRole === 'admin' || userRole === 'prefeito';
}

// Function to check if user should only see data from their own sector
export async function shouldFilterByUserSetor(userId: string): Promise<boolean> {
  if (!userId) return true;
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return true;
  
  // Admin e prefeito veem tudo, outros veem apenas seu setor
  return data.role !== 'admin' && data.role !== 'prefeito';
}

// Synchronous version of the filter check
export function shouldFilterByUserSetorSync(): boolean {
  const userRole = getUserRoleSync();
  
  // Admin e prefeito veem tudo, outros veem apenas seu setor
  return userRole !== 'admin' && userRole !== 'prefeito';
}

// Get user's secondary sectors if they have access to multiple
export async function getUserSetoresAdicionais(userId: string): Promise<string[]> {
  if (!userId) return [];
  
  const { data: primarySetor, error: primaryError } = await supabase
    .from('usuario_secretarias')
    .select('secretaria_id')
    .eq('usuario_id', userId)
    .limit(1);
  
  const { data: allSetores, error: allError } = await supabase
    .from('usuario_secretarias')
    .select('secretaria_id')
    .eq('usuario_id', userId);
    
  if (primaryError || allError || !primarySetor || !primarySetor.length || !allSetores) return [];
  
  // Filter out the primary sector to get additional sectors
  const primarySetorId = primarySetor[0].secretaria_id;
  return allSetores
    .filter(item => item.secretaria_id !== primarySetorId)
    .map(item => item.secretaria_id);
}

// Check if user has access to a specific setor (primary or additional)
export async function hasSetorAccess(userId: string, setor: string): Promise<boolean> {
  if (!userId || !setor) return false;
  
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (userError || !userData) return false;
  
  // Admin and prefeito have access to all sectors
  if (userData.role === 'admin' || userData.role === 'prefeito') {
    return true;
  }
  
  // Check if user has access to this sector
  const { data: setorData, error: setorError } = await supabase
    .from('usuario_secretarias')
    .select('*')
    .eq('usuario_id', userId)
    .eq('secretaria_id', setor);
    
  if (setorError) return false;
  
  return setorData && setorData.length > 0;
}

// Synchronous version to check setor access
export function hasSetorAccessSync(setor: string): boolean {
  const userRole = getUserRoleSync();
  
  // Admin and prefeito have access to all sectors
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // Check if user has access to this sector
  try {
    const secretarias = getUserSecretariasSync();
    return secretarias.includes(setor);
  } catch (e) {
    return false;
  }
}
