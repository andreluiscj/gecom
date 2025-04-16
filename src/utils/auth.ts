
// Collection of auth helper functions

/**
 * Get the current user role from localStorage
 */
export const getUserRole = (): string => {
  return localStorage.getItem('user-role') || '';
};

/**
 * Get the current user's sector from localStorage
 */
export const getUserSetor = (): string | null => {
  return localStorage.getItem('user-setor');
};

/**
 * Check if the current user can access the dashboard
 * Only 'admin', 'prefeito', and 'gestor' can access the dashboard
 */
export const canAccessDashboard = (): boolean => {
  const role = getUserRole();
  return ['admin', 'prefeito', 'gestor'].includes(role);
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

/**
 * Check if user is a mayor (prefeito)
 */
export const isPrefeito = (): boolean => {
  return getUserRole() === 'prefeito';
};

/**
 * Check if user is a manager (gestor)
 */
export const isGestor = (): boolean => {
  return getUserRole() === 'gestor';
};

/**
 * Check if user is a regular employee (servidor)
 */
export const isServidor = (): boolean => {
  return getUserRole() === 'servidor';
};

/**
 * Get the user's municipality ID
 */
export const getUserMunicipality = (): string | null => {
  return localStorage.getItem('user-municipality');
};

/**
 * Get the user's name
 */
export const getUserName = (): string => {
  return localStorage.getItem('user-name') || 'Usuário';
};

/**
 * Get the user's ID
 */
export const getUserId = (): string | null => {
  return localStorage.getItem('funcionario-id');
};

/**
 * Get the user's secretarias (departments)
 */
export const getUserSecretarias = (): string[] => {
  const secretariasStr = localStorage.getItem('user-secretarias');
  if (!secretariasStr) return [];
  
  try {
    return JSON.parse(secretariasStr);
  } catch (e) {
    console.error('Error parsing user secretarias:', e);
    return [];
  }
};
