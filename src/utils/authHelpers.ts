
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

// Function to get the selected municipality
export function getSelectedMunicipality(): string | null {
  return localStorage.getItem('municipio-selecionado');
}

// Function to check if user can access a specific route
export function canAccess(requiredRole: string | string[]): boolean {
  const userRole = getUserRole();
  
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

// Function to get the workflow step a user is permitted to edit
export function getPermittedWorkflowStep(): string | undefined {
  const userRole = getUserRole();
  const userName = getUserName();
  
  if (userRole === 'admin') {
    return undefined; // Admin can edit any step
  }
  
  const funcionarioId = localStorage.getItem('user-id');
  if (funcionarioId) {
    // Get the employee data from localStorage
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const funcionario = funcionarios.find((f: any) => f.id === funcionarioId);
    
    if (funcionario && funcionario.permissaoEtapa) {
      return funcionario.permissaoEtapa;
    }
  }
  
  return undefined;
}

// Function to check if user can edit a specific workflow step
export function canEditWorkflowStep(stepTitle: string): boolean {
  const userRole = getUserRole();
  
  if (userRole === 'admin' || userRole === 'manager') {
    return true; // Admin and manager can edit any step
  }
  
  // For non-admin users, check specific permissions
  const permittedStep = getPermittedWorkflowStep();
  if (permittedStep === undefined) {
    return false;
  }
  
  return permittedStep === stepTitle;
}

// Function to check if user has permission to access a specific sector
export function canAccessSetor(setor: string): boolean {
  const userRole = getUserRole();
  
  if (userRole === 'admin') {
    return true;
  }
  
  return true; // Temporarily returning true for all sectors
}

// Function to check if user can manage users
export function canAccessUserManagement(): boolean {
  const userRole = getUserRole();
  return userRole === 'admin' || userRole === 'gerente' || userRole === 'manager';
}
