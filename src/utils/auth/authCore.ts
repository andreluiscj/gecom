
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

// Function to get the current funcionario ID
export function getFuncionarioId(): string | null {
  return localStorage.getItem('funcionario-id');
}

// Function to get the current user's setor
export function getUserSetor(): string | null {
  return localStorage.getItem('user-setor');
}
