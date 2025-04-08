
// Utility functions for authentication and permissions

/**
 * Check if the current user has permission to edit a specific task or workflow step
 * @param stepTitle - The title of the workflow step
 * @returns boolean - Whether the current user has permission
 */
export const canEditWorkflowStep = (stepTitle?: string): boolean => {
  const userRole = localStorage.getItem('user-role');
  
  // Admin and manager can edit any step
  if (userRole === 'admin' || userRole === 'manager') {
    return true;
  }
  
  // For regular users, check if they have permission for this specific step
  if (userRole === 'user') {
    // Get the user's assigned workflow step (if any)
    const permittedStep = localStorage.getItem('user-permitted-step');
    
    // If user has a permitted step and it matches the current step, allow editing
    if (permittedStep && stepTitle && permittedStep === stepTitle) {
      return true;
    }
    
    // No match found
    return false;
  }
  
  return false;
};

/**
 * Check if user can create new DFDs/pedidos
 * @returns boolean - Whether the current user can create new DFDs
 */
export const canCreateNewDFD = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  return userRole === 'admin' || userRole === 'manager' || userRole === 'user';
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
 * Get the user's permitted workflow step (if any)
 * @returns string | null - The permitted workflow step or null
 */
export const getPermittedWorkflowStep = (): string | null => {
  return localStorage.getItem('user-permitted-step');
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
  const name = getUserName();
  
  if (role === 'admin') {
    return 'Administrador';
  } else if (role === 'manager' && name) {
    return name;
  } else if (role === 'user' && name) {
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
