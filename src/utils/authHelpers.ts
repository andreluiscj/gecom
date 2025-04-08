
// Utility functions for authentication and permissions

/**
 * Check if the current user has permission to edit a specific task or workflow step
 * @param stepResponsavel - The user responsible for the workflow step
 * @returns boolean - Whether the current user has permission
 */
export const canEditWorkflowStep = (stepResponsavel?: string): boolean => {
  const userRole = localStorage.getItem('user-role');
  
  // Admin and gerente can edit any step
  if (userRole === 'admin' || userRole === 'gerente' || userRole === 'user') {
    return true;
  }
  
  // Funcionário can only edit steps where they are responsible
  if (userRole === 'funcionario') {
    const userName = localStorage.getItem('user-municipality');
    
    // If no responsável is defined yet, allow editing (since it needs to be assigned)
    if (!stepResponsavel) {
      return true;
    }
    
    // If the current user is the responsável for this step, allow editing
    return stepResponsavel.toLowerCase().includes(userName?.toLowerCase() || '');
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
  
  if (role === 'admin') {
    return 'Administrador';
  } else if (role === 'gerente' && municipality) {
    return `Gerente - ${municipality}`;
  } else if (role === 'funcionario' && municipality) {
    return `Funcionário - ${municipality}`;
  }
  
  return 'Usuário';
};
