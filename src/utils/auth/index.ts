
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export function getUserRoleSync(): UserRole | null {
  const storedRole = localStorage.getItem('user-role');
  if (!storedRole) return null;
  
  // Validate the role is a valid UserRole
  if (['admin', 'user', 'manager', 'prefeito'].includes(storedRole)) {
    return storedRole as UserRole;
  }
  
  return null;
}

export function getUserIdSync(): string | null {
  return localStorage.getItem('user-id');
}

export function getUserNameSync(): string {
  return localStorage.getItem('user-name') || 'Usuário';
}

export function getUserSetorSync(): string | null {
  return localStorage.getItem('user-setor');
}

export function getUserMunicipioSync(): string | null {
  return localStorage.getItem('user-municipality');
}

export function isAuthenticatedSync(): boolean {
  return localStorage.getItem('user-authenticated') === 'true';
}

export function getUserSecretariasSync(): string[] {
  const storedSecretarias = localStorage.getItem('user-secretarias');
  if (!storedSecretarias) return [];
  
  try {
    return JSON.parse(storedSecretarias);
  } catch (e) {
    console.error('Error parsing user secretarias', e);
    return [];
  }
}

// New functions needed to resolve errors
export function canAccessUserManagementSync(): boolean {
  const userRole = getUserRoleSync();
  return userRole === 'admin' || userRole === 'prefeito';
}

export function canAccessDashboardSync(): boolean {
  const userRole = getUserRoleSync();
  return userRole === 'admin' || userRole === 'prefeito' || userRole === 'manager';
}

export function shouldFilterByUserSetorSync(): boolean {
  const userRole = getUserRoleSync();
  return userRole !== 'admin' && userRole !== 'prefeito';
}

export function hasSetorAccessSync(setorId: string): boolean {
  const userSetor = getUserSetorSync();
  if (!userSetor) return false;
  
  if (userSetor === setorId) return true;
  
  const userSecretarias = getUserSecretariasSync();
  return userSecretarias.includes(setorId);
}

export function getPermittedWorkflowStep(): number {
  // TODO: Implement this based on user permissions
  // For now, return a default value
  return 0;
}

// Async versions of the functions above
export async function getUserRole(): Promise<UserRole | null> {
  return getUserRoleSync();
}

export async function getUserId(): Promise<string | null> {
  return getUserIdSync();
}

export async function getUserName(): Promise<string> {
  return getUserNameSync();
}

export async function getUserSetor(): Promise<string | null> {
  return getUserSetorSync();
}

export async function getUserMunicipio(): Promise<string | null> {
  return getUserMunicipioSync();
}

export async function isAuthenticated(): Promise<boolean> {
  return isAuthenticatedSync();
}

// Session management for Supabase
export async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error checking session:', error);
    return null;
  }
  
  return data?.session;
}
