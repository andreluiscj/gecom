
// Core authentication functions
import { supabase } from '@/integrations/supabase/client';

// Function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

// Function to get current user's role
export async function getUserRole(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  
  const { data: userData, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', data.session.user.id)
    .single();
    
  if (error || !userData) return null;
  return userData.role;
}

// Function to get current user's name
export async function getUserName(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  
  const { data: userData, error } = await supabase
    .from('usuarios')
    .select('nome')
    .eq('id', data.session.user.id)
    .single();
    
  if (error || !userData) return null;
  return userData.nome;
}

// Function to get the current user ID
export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
}

// Function to get the current funcionario ID (alias for getUserId for backward compatibility)
export async function getFuncionarioId(): Promise<string | null> {
  return getUserId();
}

// Function to get the current user's setor
export async function getUserSetor(): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('usuario_secretarias')
    .select('secretaria_id')
    .eq('usuario_id', userId)
    .single();
    
  if (error || !data) return null;
  return data.secretaria_id;
}

// Function to get the user's municipality ID
export async function getUserMunicipality(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  
  const { data: userData, error } = await supabase
    .from('usuarios')
    .select('municipio_id')
    .eq('id', data.session.user.id)
    .single();
    
  if (error || !userData) return null;
  return userData.municipio_id;
}

// Function to check if the current user can access the dashboard
export async function canAccessDashboard(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin' || role === 'prefeito' || role === 'gestor';
}

// Function to get user's secretarias (departments)
export async function getUserSecretarias(): Promise<string[]> {
  const userId = await getUserId();
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('usuario_secretarias')
    .select('secretaria_id')
    .eq('usuario_id', userId);
    
  if (error || !data) return [];
  return data.map(item => item.secretaria_id);
}

// Helper functions for user roles
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

export async function isPrefeito(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'prefeito';
}

export async function isGestor(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'gestor';
}

export async function isServidor(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'servidor';
}

// Helper functions for local storage (for backward compatibility)
export function getLocalUserRole(): string | null {
  return localStorage.getItem('user-role');
}

export function getLocalUserName(): string | null {
  return localStorage.getItem('user-name');
}

export function getLocalUserId(): string | null {
  return localStorage.getItem('user-id');
}

export function getLocalUserMunicipality(): string | null {
  return localStorage.getItem('user-municipality');
}

