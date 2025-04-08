
// Utility functions for authentication and permissions

/**
 * Check if the current user has permission to edit a specific task or workflow step
 * @param stepResponsavel - The user responsible for the workflow step
 * @returns boolean - Whether the current user has permission
 */
export const canEditWorkflowStep = (stepResponsavel?: string): boolean => {
  const userRole = localStorage.getItem('user-role');
  
  // All users can edit any step now
  if (userRole === 'admin' || userRole === 'gerente' || userRole === 'user') {
    return true;
  }
  
  return false;
};

/**
 * Check if user can create new DFDs/pedidos
 * @returns boolean - Whether the current user can create new DFDs
 */
export const canCreateNewDFD = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  return userRole === 'admin' || userRole === 'gerente' || userRole === 'user';
};

/**
 * Get the current user's municipality context
 * @returns string | null - The municipality name or null
 */
export const getUserMunicipality = (): string | null => {
  return localStorage.getItem('user-municipality');
};

/**
 * Get the current user's role
 * @returns string | null - The user role or null
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('user-role');
};

/**
 * Get the current user's name
 * @returns string | null - The user name or null
 */
export const getUserName = (): string | null => {
  return localStorage.getItem('user-name');
};

/**
 * Check if user is authenticated
 * @returns boolean - Whether the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user-authenticated') === 'true';
};

/**
 * Format user display name based on role and municipality
 * @returns string - Formatted display name
 */
export const formatUserDisplayName = (): string => {
  const role = getUserRole();
  const municipality = getUserMunicipality();
  const name = getUserName();
  
  if (role === 'admin') {
    return 'Administrador';
  } else if (role === 'gerente' && municipality) {
    return `Gerente - ${municipality}`;
  } else if (role === 'manager' && name) {
    return name;
  }
  
  return 'Usuário';
};

/**
 * Check if the current user can access user management
 * @returns boolean - Whether the user can access user management
 */
export const canAccessUserManagement = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  const userName = localStorage.getItem('user-name');
  
  return userRole === 'admin' || (userRole === 'manager' && userName === 'Amanda Amarante');
};

