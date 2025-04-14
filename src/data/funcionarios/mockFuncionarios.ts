
// Re-export from services
export {
  getFuncionarios,
  addFuncionario,
  updateFuncionario,
  deleteFuncionario,
  filtrarFuncionariosPorSetor
} from '@/services/funcionarioService';

import { signIn as autenticarUsuario, changePassword as atualizarSenhaUsuario } from '@/services/authService';

// Re-export for compatibility
export { autenticarUsuario, atualizarSenhaUsuario };

// Generate username from name helper
export const generateUsername = (nome: string): string => {
  const nameParts = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
  
  if (nameParts.length >= 2) {
    return `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
  } else if (nameParts.length === 1) {
    return nameParts[0];
  } else {
    return `user_${Date.now()}`;
  }
};

// The following functions are now handled by the Supabase auth system
export const criarTokenRecuperacaoSenha = async (username: string) => {
  console.warn('Using Supabase auth. This function is deprecated.');
  return { success: false };
};

export const validarTokenRecuperacaoSenha = (token: string) => {
  console.warn('Using Supabase auth. This function is deprecated.');
  return { valid: false, message: 'Token inválido' };
};

export const recuperarSenhaComToken = (token: string, novaSenha: string) => {
  console.warn('Using Supabase auth. This function is deprecated.');
  return { success: false, message: 'Erro ao atualizar senha' };
};

export const getUserById = async (userId: string) => {
  console.warn('Using Supabase auth. This function is deprecated.');
  return null;
};

// Mock data arrays that are now replaced by Supabase tables
export const mockFuncionarios = [];
export const mockUsuariosLogin = [];
export const mockLoginLogs = [];
export const mockPasswordResetTokens = {};

// Functions now handled by services
export const getUsuariosLogin = () => {
  console.warn('Using Supabase auth. This function is deprecated.');
  return [];
};

export const getFuncionarios = async () => {
  console.warn('Using Supabase for users. This function is deprecated.');
  return [];
};

export const getLoginLogs = () => {
  console.warn('Using Supabase for login logs. This function is deprecated.');
  return [];
};

export const addLoginLog = (userId: string, success: boolean, ip: string = "127.0.0.1") => {
  console.warn('Using Supabase for login logs. This function is deprecated.');
  return {};
};

// Compatibility function just in case it's still used somewhere
export const ensureAdminExists = () => {
  console.warn('Using Supabase auth. This function is deprecated.');
};
