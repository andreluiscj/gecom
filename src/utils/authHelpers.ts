
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

// Function to get user profile photo
export function getProfilePhoto(): string | null {
  return localStorage.getItem('user-profile-photo');
}

// Function to set user profile photo
export function setProfilePhoto(photoUrl: string | null): void {
  if (photoUrl) {
    localStorage.setItem('user-profile-photo', photoUrl);
  } else {
    localStorage.removeItem('user-profile-photo');
  }
}

// Function to get the selected municipality
export function getSelectedMunicipality(): string | null {
  return localStorage.getItem('municipio-selecionado');
}

// Function to check if user is on first login
export function isFirstLogin(): boolean {
  return localStorage.getItem('first-login') === 'true';
}

// Function to set first login status
export function setFirstLogin(status: boolean): void {
  localStorage.setItem('first-login', status.toString());
}

// Function to check if user has accepted GDPR terms
export function hasAcceptedGDPR(): boolean {
  const userId = getUserId();
  if (!userId) return false;
  
  return localStorage.getItem(`gdpr-accepted-${userId}`) === 'true';
}

// Function to set GDPR acceptance status
export function setGDPRAccepted(status: boolean): void {
  const userId = getUserId();
  if (userId) {
    localStorage.setItem(`gdpr-accepted-${userId}`, status.toString());
  }
}

// Function to get user contact information
export function getUserContactInfo(): {phone: string, email: string} {
  return {
    phone: localStorage.getItem('user-phone') || '',
    email: localStorage.getItem('user-email') || ''
  };
}

// Function to get user address information
export function getUserAddressInfo(): {address: string, city: string, state: string} {
  return {
    address: localStorage.getItem('user-address') || '',
    city: localStorage.getItem('user-city') || '',
    state: localStorage.getItem('user-state') || ''
  };
}

// Function to check if user can access a specific route
export function canAccess(requiredRole: string | string[]): boolean {
  const userRole = getUserRole();
  
  if (!userRole) return false;
  
  // Admin e prefeito podem acessar tudo
  if (userRole === 'admin' || userRole === 'prefeito') return true;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

// Function to get the workflow step a user is permitted to edit
export function getPermittedWorkflowStep(): string | undefined {
  const userRole = getUserRole();
  
  // Admin or prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return undefined; // Undefined means all steps are permitted
  }
  
  const funcionarioId = getFuncionarioId();
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
  
  // Admin e prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For non-admin users, check specific permissions
  const permittedStep = getPermittedWorkflowStep();
  
  // If permittedStep is undefined but not admin, no permission
  if (permittedStep === undefined) {
    return false;
  }
  
  // Allow if the permitted step exactly matches the current step
  if (permittedStep === stepTitle) {
    return true;
  }
  
  // Allow if the user has "all" permissions
  if (permittedStep === "all") {
    return true;
  }
  
  return false;
}

// Função para verificar se o usuário pode acessar pedidos de um setor específico
export function canAccessSetor(setor: string): boolean {
  const userRole = getUserRole();
  const userSetor = getUserSetor();
  
  // Admin e prefeito podem acessar todos os setores
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // Gerentes e funcionários só podem acessar seu próprio setor
  return setor === userSetor;
}

// Function to check if user can manage users
export function canAccessUserManagement(): boolean {
  const userRole = getUserRole();
  return userRole === 'admin';
}

// Function to check if user can access dashboard
export function canAccessDashboard(): boolean {
  const userRole = getUserRole();
  return userRole === 'admin' || userRole === 'prefeito' || userRole === 'manager';
}

// Função para verificar se o usuário deve ver apenas dados do seu setor
export function shouldFilterByUserSetor(): boolean {
  const userRole = getUserRole();
  // Admin e prefeito veem tudo, outros veem apenas seu setor
  return userRole !== 'admin' && userRole !== 'prefeito';
}
