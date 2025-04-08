
// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  const isAuthed = localStorage.getItem('user-authenticated') === 'true';
  return isAuthed;
}

// Função para obter o papel do usuário atual
export function getUserRole(): string | null {
  return localStorage.getItem('user-role');
}

// Função para obter o nome do usuário atual
export function getUserName(): string | null {
  return localStorage.getItem('user-name');
}

// Função para obter o município selecionado
export function getSelectedMunicipality(): string | null {
  return localStorage.getItem('municipio-selecionado');
}

// Função para verificar se o usuário pode acessar uma rota específica
export function canAccess(requiredRole: string | string[]): boolean {
  const userRole = getUserRole();
  
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

// Função para verificar se o usuário pode editar etapas de workflow
export function getPermittedWorkflowStep(): string | undefined {
  const userRole = getUserRole();
  const userName = getUserName();
  
  if (userRole === 'admin') {
    return undefined; // Admin can edit any step
  }
  
  if (userName === 'André Luis') {
    // Health sector employee can edit any workflow step
    return undefined;
  }
  
  if (userName === 'Breno Jorge') {
    return 'Pesquisa de Preços';
  }
  
  return undefined;
}

// Função para verificar se o usuário pode editar uma etapa específica do workflow
export function canEditWorkflowStep(stepTitle: string): boolean {
  const userRole = getUserRole();
  const userName = getUserName();
  
  if (userRole === 'admin' || userRole === 'manager') {
    return true; // Admin and manager can edit any step
  }
  
  // Check if user is a health sector employee (André) - can edit any step
  if (userName === 'André Luis') {
    return true;
  }
  
  // For non-admin users, check specific permissions
  const permittedStep = getPermittedWorkflowStep();
  if (permittedStep === undefined) {
    return false;
  }
  
  return permittedStep === stepTitle;
}

// Função para verificar se o usuário tem permissão para acessar uma secretaria específica
export function canAccessSetor(setor: string): boolean {
  const userRole = getUserRole();
  
  if (userRole === 'admin') {
    return true;
  }
  
  return true; // Temporariamente retornando true para todos setores
}

// Função para verificar se o usuário pode gerenciar usuários
export function canAccessUserManagement(): boolean {
  const userRole = getUserRole();
  return userRole === 'admin' || userRole === 'gerente' || userRole === 'manager';
}
