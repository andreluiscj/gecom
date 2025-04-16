
// Core authentication functions

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  const isAuthed = localStorage.getItem('user-authenticated') === 'true';
  return isAuthed;
}

// Function to get current user's role
export function getUserRole(): string | null {
  return localStorage.getItem('user-role');
}

// Function to get current user's name
export function getUserName(): string | null {
  return localStorage.getItem('user-name');
}

// Function to get the current user ID
export function getUserId(): string | null {
  return localStorage.getItem('user-id');
}

// Function to get the current funcionario ID (alias for getUserId for backward compatibility)
export function getFuncionarioId(): string | null {
  return localStorage.getItem('user-id') || localStorage.getItem('funcionario-id');
}

// Function to get the current user's setor
export function getUserSetor(): string | null {
  return localStorage.getItem('user-setor');
}

// Function to get the user's municipality ID
export function getUserMunicipality(): string | null {
  return localStorage.getItem('user-municipality');
}

// Function to check if the current user can access the dashboard
export function canAccessDashboard(): boolean {
  const role = getUserRole();
  return ['admin', 'prefeito', 'gestor'].includes(role || '');
}

// Function to get user's secretarias (departments)
export function getUserSecretarias(): string[] {
  const secretariasStr = localStorage.getItem('user-secretarias');
  if (!secretariasStr) return [];
  
  try {
    return JSON.parse(secretariasStr);
  } catch (e) {
    console.error('Error parsing user secretarias:', e);
    return [];
  }
}

// Helper functions for user roles
export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}

export function isPrefeito(): boolean {
  return getUserRole() === 'prefeito';
}

export function isGestor(): boolean {
  return getUserRole() === 'gestor';
}

export function isServidor(): boolean {
  return getUserRole() === 'servidor';
}
