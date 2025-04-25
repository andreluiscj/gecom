
// Helper functions for authentication-related tasks

// Get current user's role from localStorage
export const getUserRole = (): string | null => {
  return localStorage.getItem('user-role');
};

// Get current user's id from localStorage
export const getUserId = (): string | null => {
  return localStorage.getItem('user-id');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user-authenticated') === 'true';
};

// Get current user's municipality
export const getUserMunicipality = (): string | null => {
  return localStorage.getItem('user-municipality');
};

// Get current employee id
export const getFuncionarioId = (): string | null => {
  return localStorage.getItem('funcionario-id');
};
